import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GridComponent } from '../../shared/ui/grid/grid.component';
import { GridService } from '../../shared/services/grid/grid.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-generator',
  standalone: false,
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.css'],
})
export class GeneratorComponent implements OnInit, OnDestroy {
  character: string = '';
  error: string = '';
  cooldownActive: boolean = false;
  private cooldownTimeoutId?: number;
  grid: string[][] = [];

  private gridSub!: Subscription;

  @ViewChild(GridComponent) gridComponent!: GridComponent;

  constructor(@Inject(GridService) private readonly gridService: GridService) {}

  ngOnInit(): void {
    this.character = this.gridService.getBias() ?? '';
    this.gridSub = this.gridService.grid$.subscribe((newGrid) => {
      this.grid = newGrid;
    });
  }

  /**
   * Handles the input coming from the generic InputComponent.
   * Validates that the input is empty or a single alphabetical character.
   * On valid input, it sends the bias to the GridService.
   * If a non-empty value is received, the input is put on a 4-second cooldown.
   */
  onBiasChange(newValue: string): void {
    if (this.cooldownActive) {
      return;
    }
    if (newValue !== '' && !/^[a-zA-Z]$/.test(newValue)) {
      this.error = 'Please enter a single letter (a-z) or leave empty';
      return;
    }
    this.error = '';
    this.character = newValue;
    this.gridService.setBias(newValue === '' ? null : newValue);

    if (newValue !== '') {
      this.cooldownActive = true;
      this.cooldownTimeoutId = window.setTimeout(() => {
        this.cooldownActive = false;
      }, 4000);
    }
  }

  startGenerator(): void {
    this.gridService.startGlobalGeneration();
  }

  ngOnDestroy(): void {
    this.gridSub.unsubscribe();
    if (this.cooldownTimeoutId) {
      clearTimeout(this.cooldownTimeoutId);
    }
  }
}