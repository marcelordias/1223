import { Component, ViewChild } from '@angular/core';
import { GridComponent } from '../../shared/modules/ui/grid/grid.component';

@Component({
  selector: 'app-generator',
  standalone: false,
  templateUrl: './generator.component.html',
  styleUrl: './generator.component.css',
})
export class GeneratorComponent {
  character: string = '';

  @ViewChild(GridComponent) gridComponent!: GridComponent;

  constructor() {}

  startGenerator(): void {
    this.gridComponent.startRefresher();
  }
}