import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-grid',
  standalone: false,
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
})
export class GridComponent {
  @Input() rows: number = 0;
  @Input() cols: number = 0;

  @Input() grid: string[][] = [];

  constructor() {}
}
