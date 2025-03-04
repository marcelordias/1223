import { Server } from "socket.io";
import { Application } from "express";
import http from "http";
import {
  ResponseMessageEnum,
  ResponseStatusEnum,
} from "./enums/response-status.enum";
import { verifyToken } from "./utils/token.util";
import { User } from "./models/user.model";
import { SocketWithUser, PaymentData } from "./types/socket.types";
import { GridService } from "./services/grid.service";
import { PaymentService } from "./services/payment.service";
import { UserService } from "./services/user.service";
import { COOLDOWN_DURATION } from "./constants/grid.constants";

export function initializeSocketServer(app: Application, server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const gridService = new GridService(io);
  const paymentService = new PaymentService(io);
  const userService = new UserService(io);

  // Emit server time every second
  setInterval(() => {
    try {
      const now = new Date();
      io.emit("serverTime", now.toISOString());
    } catch (error) {
      console.error("Error emitting server time:", error);
    }
  }, 1000);

  // Authentication middleware
  io.use((socket: SocketWithUser, next) => {
    try {
      const token = socket.handshake.auth.token;
      const verified = verifyToken(token);

      if (token && verified) {
        const { _id } = verified as { _id: string };
        User.findById(_id)
          .then((user) => {
            if (user) {
              const userData = { ...user.toObject(), _id: user._id.toString() };
              socket.user = userData;
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

  // Connection handling
  io.on("connection", (socket: SocketWithUser) => {
    const user = socket.user;
    if (!user) {
      return;
    }

    const username = user.username ?? "Unknown";
    const userId = user._id.toString();

    // Handle user connection
    userService.addUser(userId, socket);
    console.log(`Client connected: ${socket.id} (${username})`);
    console.log(`Active users: ${userService.getUserCount()}`);
    userService.broadcastActiveUsers();

    socket.broadcast.emit("toast", {
      message: `${username} connected.`,
      type: "info",
    });

    // Generate grid event
    socket.on("generateGrid", ({ bias }: { bias?: string }) => {
      try {
        gridService.startGridGeneration(bias);
        io.emit("cooldownStatus", true);
        setTimeout(() => {
          io.emit("cooldownStatus", false);
          gridService.endGenerationCooldown();
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

    // Payment events
    socket.on("addPayment", async (payment: PaymentData) => {
      try {
        await paymentService.addPayment(payment, username);
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
        const payments = await paymentService.getPayments();
        socket.emit("paymentUpdate", payments);
      } catch (error) {
        console.error("Error getting payments:", error);
        socket.emit("paymentError", {
          message: "Failed to retrieve payments.",
        });
      }
    });

    // User events
    socket.on("requestActiveUsers", () => {
      socket.emit("activeUsers", userService.getActiveUsernames());
    });

    // Disconnect event
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id} (${username})`);
      userService.removeUser(userId);
      userService.broadcastActiveUsers();

      io.emit("userDisconnected", {
        username,
        timestamp: new Date(),
      });

      socket.broadcast.emit("toast", {
        message: `${username} disconnected.`,
        type: "info",
      });

      if (userService.hasNoActiveUsers()) {
        gridService.stopGridGeneration();
        console.log(
          "All clients disconnected. Global grid generation stopped."
        );
      }
    });
  });

  return io;
}
