import { Server, Socket } from "socket.io";
import { Application } from "express";
import http from "http";
import {
  ResponseMessageEnum,
  ResponseStatusEnum,
} from "./enums/response-status.enum";
import { verifyToken } from "./utils/token.util";
import { Payment } from "./models/payment.model";
import { User } from "./models/user.model";
import { UserType } from "./types/user.type";

interface SocketWithUser extends Socket {
  user?: UserType;
}

interface PaymentData {
  name: string;
  amount: number;
  code: number;
  gridData: string;
  grid: number;
}

const GRID_ROWS = 10;
const GRID_COLS = 10;
const BIAS_PERCENTAGE = 0.2;
const GRID_UPDATE_INTERVAL = 2000;
const COOLDOWN_DURATION = 4000;

const randomLetter = (): string =>
  String.fromCharCode(97 + Math.floor(Math.random() * 26));

const countOccurrences = (grid: string[][], char: string): number =>
  grid.reduce(
    (count, row) => count + row.filter((cell) => cell === char).length,
    0
  );

const reduceToSingleDigit = (value: number): number => {
  while (value > 9) value = Math.floor(value / 2);
  return value;
};

const generateGrid = (bias?: string): string[][] => {
  if (bias && !/^[a-z]$/i.test(bias)) {
    throw new Error("Bias must be a single letter.");
  }
  const totalCells = GRID_ROWS * GRID_COLS;
  const biasedCells = bias ? Math.floor(totalCells * BIAS_PERCENTAGE) : 0;
  const grid = Array.from({ length: GRID_ROWS }, () =>
    Array(GRID_COLS).fill(null).map(randomLetter)
  );

  if (bias && biasedCells > 0) {
    const lowerBias = bias.toLowerCase();
    for (let i = 0; i < biasedCells; i++) {
      const row = Math.floor(Math.random() * GRID_ROWS);
      const col = Math.floor(Math.random() * GRID_COLS);
      grid[row][col] = lowerBias;
    }
  }
  return grid;
};

const generateCode = (grid: string[][]): number => {
  const seconds = new Date().getSeconds();
  const digit1 = Math.floor(seconds / 10);
  const digit2 = seconds % 10;

  const char1 = grid[digit1][digit2];
  const char2 = grid[digit2][digit1];

  const count1 = reduceToSingleDigit(countOccurrences(grid, char1));
  const count2 = reduceToSingleDigit(countOccurrences(grid, char2));

  return Number(`${count1}${count2}`);
};

export function initializeSocketServer(app: Application, server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  let globalGridInterval: NodeJS.Timeout | null = null;
  let currentBias: string | undefined;
  let isGeneratingGrid = false;
  const activeUsers: Map<string, SocketWithUser> = new Map();

  setInterval(() => {
    try {
      const now = new Date();
      io.emit("serverTime", now.toISOString());
    } catch (error) {
      console.error("Error emitting server time:", error);
    }
  }, 1000);

  const startGlobalGridGeneration = (bias?: string) => {
    if (isGeneratingGrid) {
      return;
    }
    isGeneratingGrid = true;
    currentBias = bias;
    if (globalGridInterval) clearInterval(globalGridInterval);
    globalGridInterval = setInterval(() => {
      try {
        const grid = generateGrid(currentBias);
        const code = generateCode(grid);
        io.emit("gridUpdate", { grid, code, bias: currentBias });
      } catch (error) {
        console.error("Error in global grid generation:", error);
      }
    }, GRID_UPDATE_INTERVAL);
    setTimeout(() => {
      isGeneratingGrid = false;
    }, COOLDOWN_DURATION);
  };

  io.use((socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const verified = verifyToken(token);

      if (token && verified) {
        const { id } = verified as { id: string };
        User.findById(id)
          .then((user) => {
            if (user) {
              const userData = { ...user.toObject(), _id: user._id.toString() };
              (socket as SocketWithUser).user = userData;
              next();
            } else {
              throw new Error("User not found");
            }
          })
          .catch((err) => {
            console.error("Error finding user by ID:", err);
            socket.emit("tokenError", {
              status: ResponseStatusEnum.ERROR,
              message: ResponseMessageEnum.INVALID_TOKEN,
            });
            next(new Error("Unauthorized: User not found"));
          });
      } else {
        throw new Error("Invalid token");
      }
    } catch (error) {
      console.error("Error validating token: ", error);
      socket.emit("tokenError", {
        status: ResponseStatusEnum.ERROR,
        message: ResponseMessageEnum.INVALID_TOKEN,
      });
      next(new Error("Unauthorized: Token validation failed"));
    }
  });

  io.on("connection", (socket: SocketWithUser) => {
    const user = socket.user;
    if (!user) {
      return;
    }

    const username = user.username ?? "Unknown";
    const userId = user._id.toString();

    if (activeUsers.has(userId)) {
      const oldSocket = activeUsers.get(userId)!;
      oldSocket.disconnect(true);
    }
    activeUsers.set(userId, socket);

    console.log(`Client connected: ${socket.id} (${username})`);
    console.log(`Active users: ${activeUsers.size}`);
    
    io.emit("activeUsers", Array.from(activeUsers.values()).map((u)=>u.user?.username));

    socket.broadcast.emit("toast", {
      message: `${username} connected.`,
      type: "info",
    });

    socket.on("generateGrid", ({ bias }: { bias?: string }) => {
      try {
        startGlobalGridGeneration(bias);
        io.emit("cooldownStatus", true);
        setTimeout(() => {
          io.emit("cooldownStatus", false);
        }, COOLDOWN_DURATION);
        io.emit("biasUpdate", bias);
        socket.broadcast.emit("toast", {
          message: `Grid was updated by: ${username}.`,
          type: "info",
        });
      } catch (error) {
        console.error("Error handling generateGrid event:", error);
        socket.emit("gridGenerationError", {
          message: "Failed to generate grid.",
        });
      }
    });

    socket.on("addPayment", async (payment: PaymentData) => {
      try {
        const existingPayment = await Payment.findOne({ name: payment.name });
        if (existingPayment) {
          existingPayment.amount += Number(payment.amount);
          existingPayment.code = payment.code;
          existingPayment.gridData = payment.gridData;
          existingPayment.grid = payment.grid;
          existingPayment.version = (existingPayment.version || 0) + 1;
          existingPayment.updatedAt = new Date();
          existingPayment.updatedBy = username;
          await existingPayment.save();
          console.log(
            `Merged payment for ${payment.name}. New version: ${existingPayment.version}`
          );
        } else {
          const newPayment = new Payment({
            ...payment,
            creator: username,
            updatedBy: username,
            version: 1,
          });
          await newPayment.save();
          console.log(`Added new payment for ${payment.name}`);
        }
        const payments = await Payment.find();
        io.emit("paymentUpdate", payments);
        socket.broadcast.emit("toast", {
          message: `Payment added by: ${username}.`,
          type: "success",
        });
      } catch (error) {
        console.error("Error adding payment: ", error);
        socket.emit("paymentError", {
          message: "Failed to add payment.",
        });
      }
    });

    socket.on("getPayments", async () => {
      try {
        const payments = await Payment.find();
        socket.emit("paymentUpdate", payments);
      } catch (error) {
        console.error("Error getting payments:", error);
        socket.emit("paymentError", {
          message: "Failed to retrieve payments.",
        });
      }
    });

    socket.on("disconnect", () => {
      activeUsers.delete(userId);
      io.emit("activeUsers", Array.from(activeUsers.values()).map((u)=>u.user?.username));
      socket.broadcast.emit("toast", {
        message: `${username} disconnected.`,
        type: "info",
      });
      console.log(`Client disconnected: ${socket.id} (${username})`);
      if (activeUsers.size === 0 && globalGridInterval) {
        clearInterval(globalGridInterval);
        globalGridInterval = null;
        console.log(
          "All clients disconnected. Global grid generation stopped."
        );
      }
    });
  });

  return io;
}
