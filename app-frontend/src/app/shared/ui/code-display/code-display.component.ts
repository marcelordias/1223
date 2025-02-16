import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SocketService } from '../../services/socket/socket.service';
import { GridService } from '../../services/grid/grid.service';

@Component({
  selector: 'app-code-display',
  templateUrl: './code-display.component.html',
  styleUrls: ['./code-display.component.css'],
  standalone: false,
})
export class CodeDisplayComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  
  code: string = '00';
  isLive: boolean = false;

  constructor(
    private readonly gridService: GridService,
    private readonly socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.socketService.connectionStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => {
        this.isLive = status;
      });

    this.gridService.code$
      .pipe(takeUntil(this.destroy$))
      .subscribe((code) => (this.code = code < 10 ? `0${code}` : `${code}`));
  }

  copyCode(): void {
    navigator.clipboard.writeText(this.code).then(
      () => alert('Code copied to clipboard!'),
      () => alert('Failed to copy code')
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}