import express, { Application } from "express";
import http from "http";
import Server from "./src/index";
import dotenv from "dotenv";
import { initializeSocketServer } from "./src/socket";

dotenv.config();

const app: Application = express();
const serverInstance: Server = new Server(app);
const PORT: number = Number(process.env.PORT) || 8000;
const HOST: string = process.env.HOST ?? "localhost";

serverInstance
  .init()
  .then(() => {
    const httpServer = http.createServer(app);

    initializeSocketServer(app, httpServer);

    httpServer
      .listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
      })
      .on("error", (err: any) => {
        if (err.code === "EADDRINUSE") {
          console.error("Error: address already in use");
        } else {
          console.error(err);
        }
      });
  })
  .catch((err: any) => console.error(err));
