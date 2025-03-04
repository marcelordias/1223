import { Server } from "socket.io";
import { SocketWithUser } from "../types/socket.types";

export class UserService {
  private readonly io: Server;
  private readonly activeUsers: Map<string, SocketWithUser> = new Map();

  constructor(io: Server) {
    this.io = io;
  }

  /**
   * Adds a user to the active users map
   */
  addUser(userId: string, socket: SocketWithUser): void {
    if (this.activeUsers.has(userId)) {
      const oldSocket = this.activeUsers.get(userId)!;
      oldSocket.disconnect(true);
    }
    this.activeUsers.set(userId, socket);
  }

  /**
   * Removes a user from the active users map
   */
  removeUser(userId: string): void {
    this.activeUsers.delete(userId);
  }

  /**
   * Returns the number of active users
   */
  getUserCount(): number {
    return this.activeUsers.size;
  }

  /**
   * Returns an array of active usernames
   */
  getActiveUsernames(): (string | undefined)[] {
    return Array.from(this.activeUsers.values()).map((u) => u.user?.username);
  }

  /**
   * Broadcasts active users to all clients
   */
  broadcastActiveUsers(): void {
    this.io.emit("activeUsers", this.getActiveUsernames());
  }

  /**
   * Checks if there are no active users
   */
  hasNoActiveUsers(): boolean {
    return this.activeUsers.size === 0;
  }
}
