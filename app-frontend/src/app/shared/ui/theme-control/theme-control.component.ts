import { Component } from '@angular/core';
import { ThemeService } from '../../../core/services/theme/theme.service';

@Component({
  selector: 'app-theme-control',
  standalone: false,
  templateUrl: './theme-control.component.html',
  styleUrl: './theme-control.component.css'
})
export class ThemeControlComponent {
  currentTheme$;

  constructor(private readonly themeService: ThemeService) {
    this.currentTheme$ = this.themeService.theme$;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
