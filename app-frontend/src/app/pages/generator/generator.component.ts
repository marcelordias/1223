import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GridService } from '../../shared/services/grid/grid.service';
import { SocketService } from '../../shared/services/socket/socket.service';

@Component({
  selector: 'app-generator',
  standalone: false,
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class GeneratorComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  grid: string[][] = [];
  character: string = '';
  cooldownActive: boolean = false;
  error: string = '';
  serverTime: string = '';

  constructor(private readonly gridService: GridService, private readonly socketService: SocketService) {
    this.gridService.grid$
      .pipe(takeUntil(this.destroy$))
      .subscribe((grid) => (this.grid = grid));

    this.gridService.cooldown$
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => (this.cooldownActive = status));

    this.socketService.on<string>('serverTime', (time) => {
      this.serverTime = time;
    });
  }

  ngOnInit(): void {
    this.character = this.gridService.getBias() ?? '';
  }

  onBiasChange(newValue: string): void {
    if (!newValue || /^[a-zA-Z]$/.test(newValue)) {
      this.error = '';
      this.gridService.setBias(newValue);
    } else {
      this.error = 'Please enter a single letter';
    }
  }

  startGenerator(): void {
    this.gridService.startGlobalGeneration(this.character);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}