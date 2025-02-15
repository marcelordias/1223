import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { GridService } from '../../../services/grid/grid.service';

@Component({
  selector: 'app-grid',
  standalone: false,
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
})
export class GridComponent implements OnInit, OnDestroy {
  rows = 10;
  cols = 10;
  grid: string[][] = [];

  private gridSub!: Subscription;

  constructor(@Inject(GridService) private readonly gridService: GridService) {}

  ngOnInit(): void {
    this.grid = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => '')
    );
  }

  startRefresher(): void {
    if (this.gridSub) return;
    this.gridSub = interval(2000)
      .pipe(switchMap(() => this.gridService.getGrid()))
      .subscribe((response) => {
        this.grid = response.grid;
      });
  }

  stopRefresher(): void {
    if (this.gridSub) {
      this.gridSub.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.stopRefresher();
  }
}
