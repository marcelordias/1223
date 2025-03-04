import { Server } from "socket.io";
import { Payment } from "../models/payment.model";
import { PaymentData } from "../types/socket.types";

export class PaymentService {
  private readonly io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  /**
   * Adds or updates a payment
   */
  async addPayment(payment: PaymentData, username: string): Promise<void> {
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
    
    await this.broadcastPayments();
  }

  /**
   * Gets all payments
   */
  async getPayments(): Promise<any[]> {
    return Payment.find();
  }

  /**
   * Broadcasts payments to all connected clients
   */
  async broadcastPayments(): Promise<void> {
    const payments = await this.getPayments();
    this.io.emit("paymentUpdate", payments);
  }
}
