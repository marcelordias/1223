import { Server } from "socket.io";
import { generateGrid, generateCode } from "../utils/grid.util";
import { GRID_UPDATE_INTERVAL } from "../constants/grid.constants";

export class GridService {
  private readonly io: Server;
  private globalGridInterval: NodeJS.Timeout | null = null;
  private currentBias?: string;
  private isGeneratingGrid = false;

  constructor(io: Server) {
    this.io = io;
  }

  /**
   * Starts grid generation at regular intervals
   */
  startGridGeneration(bias?: string): void {
    if (this.isGeneratingGrid) {
      return;
    }
    
    this.isGeneratingGrid = true;
    this.currentBias = bias;
    
    if (this.globalGridInterval) {
      clearInterval(this.globalGridInterval);
    }
    
    this.globalGridInterval = setInterval(() => {
      try {
        const grid = generateGrid(this.currentBias);
        const code = generateCode(grid);
        this.io.emit("gridUpdate", { 
          grid, 
          code, 
          bias: this.currentBias 
        });
      } catch (error) {
        console.error("Error in global grid generation:", error);
      }
    }, GRID_UPDATE_INTERVAL);
  }

  /**
   * Sets the generation state to false
   */
  endGenerationCooldown(): void {
    this.isGeneratingGrid = false;
  }

  /**
   * Stops grid generation
   */
  stopGridGeneration(): void {
    if (this.globalGridInterval) {
      clearInterval(this.globalGridInterval);
      this.globalGridInterval = null;
    }
  }

  /**
   * Returns the current bias
   */
  getCurrentBias(): string | undefined {
    return this.currentBias;
  }
}
