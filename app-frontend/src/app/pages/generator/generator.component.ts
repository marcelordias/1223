import { Component, ViewChild } from '@angular/core';
import { GridComponent } from '../../shared/modules/ui/grid/grid.component';
import { GridService } from '../../shared/services/grid/grid.service';

@Component({
  selector: 'app-generator',
  standalone: false,
  templateUrl: './generator.component.html',
  styleUrl: './generator.component.css',
})
export class GeneratorComponent {
  character: string = '';
  error: string = '';
  cooldownActive: boolean = false;

  @ViewChild(GridComponent) gridComponent!: GridComponent;

  constructor(private readonly gridService: GridService) {}

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
      setTimeout(() => {
        this.cooldownActive = false;
      }, 4000);
    }
  }

  startGenerator(): void {
    this.gridComponent.startRefresher();
  }
}