import { Socket } from "socket.io";
import { UserType } from "./user.type";

export interface SocketWithUser extends Socket {
  user?: UserType;
}

export interface PaymentData {
  name: string;
  amount: number;
  code: number;
  gridData: string;
  grid: number;
}
