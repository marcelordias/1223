import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import Routes from "./routes";

export default class Server {
  private readonly app: Application;
  constructor(app: Application) {
    this.app = app;
  }

  public async init(): Promise<void> {
    try {
      this.config(this.app);
      await this.kickstartDatabase();
      new Routes(this.app);
    } catch (error) {
      throw new Error("Error initializing server");
    }
  }

  private config(app: Application): void {
    const corsOptions = {
      exposedHeaders: "x-api-key",
    };
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  }

  private async kickstartDatabase(): Promise<void> {
    const db: string = `${process.env.MONGODB_STRING_CONNECTION}`;
    await mongoose
      .connect(db)
      .then(() => console.log("Database connected"))
      .catch((error) => console.error(error));
  }
}
