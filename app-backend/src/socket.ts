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

interface SocketWithUser extends Socket {
  user?: any;
}

const GRID_ROWS = 10;
const GRID_COLS = 10;
const BIAS_PERCENTAGE = 0.2;

function generateGrid(bias?: string): string[][] {
  const totalCells = GRID_ROWS * GRID_COLS;
  const biasedCells = bias ? Math.floor(totalCells * BIAS_PERCENTAGE) : 0;

  const grid = Array.from({ length: GRID_ROWS }, () =>
    Array.from({ length: GRID_COLS }, () => randomLetter())
  );

  if (bias && biasedCells > 0) {
    for (let i = 0; i < biasedCells; i++) {
      const randRow = Math.floor(Math.random() * GRID_ROWS);
      const randCol = Math.floor(Math.random() * GRID_COLS);
      grid[randRow][randCol] = bias.toLowerCase();
    }
  }
  return grid;
}

function generateCode(grid: string[][]): number {
  const seconds = new Date().getSeconds();
  const digit1 = Math.floor(seconds / 10);
  const digit2 = seconds % 10;

  const char1 = grid[digit1][digit2];
  const char2 = grid[digit2][digit1];

  let count1 = reduceToSingleDigit(countOccurrences(grid, char1));
  let count2 = reduceToSingleDigit(countOccurrences(grid, char2));

  return Number(`${count1}${count2}`);
}

function reduceToSingleDigit(value: number): number {
  while (value > 9) {
    value = Math.floor(value / 2);
  }
  return value;
}

function randomLetter(): string {
  return String.fromCharCode(97 + Math.floor(Math.random() * 26));
}

function countOccurrences(grid: string[][], char: string): number {
  let count = 0;
  grid.forEach((row) =>
    row.forEach((cell) => {
      if (cell === char) count++;
    })
  );
  return count;
}

/**
 * Estratégia simples de resolução de conflitos
 * para o evento 'addPayment'. Caso dois clientes enviem pagamentos com o mesmo nome,
 * o servidor faz merge das entradas:
 *   - Se o pagamento já existir, soma o valor, atualiza o código e a grid associada,
 *     incrementando o campo 'version' para indicar a atualização.
 *   - Caso contrário, cria um novo registro atribuindo um id e definindo a versão inicial.
 */
export function initializeSocketServer(app: Application, server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  let globalGridInterval: NodeJS.Timeout | null = null;
  let currentBias: string | undefined;

  function startGlobalGridGeneration(bias?: string) {
    currentBias = bias;
    if (globalGridInterval) {
      clearInterval(globalGridInterval);
    }
    globalGridInterval = setInterval(() => {
      try {
        const grid = generateGrid(currentBias);
        const code = generateCode(grid);
        io.emit("gridUpdate", { grid, code, bias: currentBias });
      } catch (error) {
        console.error("Error in global grid generation:", error);
      }
    }, 2000);
  }

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const verified = verifyToken(token);

      if (token && verified) {
        const { id } = verified as { id: string };

        User.findById(id)
          .then((user) => {
            (socket as SocketWithUser).user = user;
            next();
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
        socket.emit("tokenError", {
          status: ResponseStatusEnum.ERROR,
          message: ResponseMessageEnum.INVALID_TOKEN,
        });
        next(new Error("Unauthorized: Invalid token"));
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

  io.on("connection", (socket) => {
    const requester = (socket as SocketWithUser).user?.username || "Unknown";
    console.log(`Client connected: ${socket.id} (${requester})`);

    let serverTimeInterval: NodeJS.Timeout = setInterval(() => {
      try {
        const now = new Date();
        io.emit("serverTime", now.toISOString());
      } catch (error) {
        console.error("Error emitting server time:", error);
      }
    }, 1000);

    socket.on("generateGrid", ({ bias }: { bias?: string }) => {
      try {
        startGlobalGridGeneration(bias);

        const requester = (socket as SocketWithUser).user?.username || "Unknown";

        socket.broadcast.emit("toast", {
          message: `Grid was updated by: ${requester}.`,
          type: "info",
        });
      } catch (error) {
        console.error("Error handling generateGrid event:", error);
        socket.emit("gridGenerationError", { message: "Failed to generate grid." });
      }
    });

    socket.on("addPayment", async (payment) => {
      try {
        const hasPayment = await Payment.findOne({ name: payment.name })
          .lean()
          .exec();

        if (hasPayment) {
          hasPayment.amount += payment.amount;
          hasPayment.code = payment.code;
          hasPayment.gridData = payment.gridData;
          hasPayment.grid = payment.grid;
          hasPayment.version = (hasPayment.version || 1) + 1;
          hasPayment.updatedAt = new Date();
          console.log(
            `Merged payment for ${payment.name}. New version: ${hasPayment.version}`
          );
        } else {
          await Payment.create(payment);
          console.log(`Added new payment for ${payment.name}`);
        }
        const payments = await Payment.find().lean().exec();
        io.emit("paymentUpdate", payments);

        const requester =
          (socket as SocketWithUser).user?.username || "Unknown";
        socket.broadcast.emit("toast", {
          message: `Payment added by: ${requester}.`,
          type: "success",
        });
      } catch (error) {
        console.error("Error adding payment: ", error);
      }
    });

    socket.on("getPayments", async () => {
      try {
        const payments = await Payment.find().lean().exec();
        socket.emit("paymentUpdate", payments);
      } catch (error) {
        console.error("Error getting payments:", error);
      }
    });

    socket.on("disconnect", () => {
      const requester = (socket as SocketWithUser).user?.username || "Unknown";
      console.log(`Client disconnected: ${socket.id} (${requester})`);
      if (io.sockets.sockets.size === 0 && globalGridInterval) {
        clearInterval(globalGridInterval);
        clearInterval(serverTimeInterval);
        globalGridInterval = null;
        console.log(
          "All clients disconnected. Global grid generation stopped."
        );
      }
    });
  });

  return io;
}
