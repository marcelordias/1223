import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GridService } from '../../services/grid/grid.service';

@Component({
  selector: 'app-code-display',
  templateUrl: './code-display.component.html',
  styleUrls: ['./code-display.component.css'],
  standalone: false,
})
export class CodeDisplayComponent implements OnInit, OnDestroy {
  code: number = 0;
  isLive: boolean = false;
  private readonly subscriptions: Subscription = new Subscription();

  constructor(private readonly gridService: GridService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.gridService.code$.subscribe((code) => (this.code = code))
    );
    this.subscriptions.add(
      this.gridService.liveStatus$.subscribe((status) => (this.isLive = status))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
