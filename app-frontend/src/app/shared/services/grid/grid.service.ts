import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SocketService } from '../socket/socket.service';

export interface GridResponse {
  grid: string[][];
  code: number;
  bias?: string;
}

@Injectable({ providedIn: 'root' })
export class GridService {
  private readonly codeSubject = new BehaviorSubject<number>(0);
  public readonly code$ = this.codeSubject.asObservable();

  private readonly gridSubject = new BehaviorSubject<string[][]>(
    Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => ''))
  );
  public readonly grid$ = this.gridSubject.asObservable();

  private readonly biasSubject = new BehaviorSubject<string | null>(null);
  public readonly bias$ = this.biasSubject.asObservable();

  private readonly cooldownSubject = new BehaviorSubject<boolean>(false);
  public readonly cooldown$ = this.cooldownSubject.asObservable();

  private readonly emptyGrid: string[][] = Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => '')
  );

  constructor(private readonly socketService: SocketService) {
    this.socketService.on<GridResponse>('gridUpdate', (data: GridResponse) => {
      this.gridSubject.next(data.grid);
      this.codeSubject.next(data.code);
    });

    this.socketService.connectionStatus$.subscribe((isConnected) => {
      if (!isConnected) {
        this.gridSubject.next(this.emptyGrid);
        this.codeSubject.next(0);
        this.biasSubject.next(null);
      }
    });

    this.socketService.on<boolean>('cooldownStatus', (status: boolean) => {
      this.cooldownSubject.next(status);
    });
  }

  startGlobalGeneration(bias: string): void {
    this.socketService.emit('generateGrid', { bias });
    this.cooldownSubject.next(true);
    setTimeout(() => this.cooldownSubject.next(false), 4000);
  }

  getBias(): string | null {
    return this.biasSubject.value;
  }

  getCode(): number {
    return this.codeSubject.value;
  }

  getGridData(): string[][] {
    return this.gridSubject.value;
  }

  setBias(newValue: string): void {
    this.biasSubject.next(newValue);
    this.startGlobalGeneration(newValue);
  }
}