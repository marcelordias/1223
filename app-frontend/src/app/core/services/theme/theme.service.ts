import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'theme';
  private readonly DEFAULT_THEME = 'light';
  
  private readonly themeSubject = new BehaviorSubject<string>(this.DEFAULT_THEME);
  theme$ = this.themeSubject.asObservable();

  constructor() { }

  init() {
    this.loadTheme();
  }

  private loadTheme() {
    const savedTheme = sessionStorage.getItem(this.THEME_KEY);
    const theme = savedTheme ?? this.DEFAULT_THEME;
    this.applyTheme(theme);
  }

  private applyTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme);
    this.themeSubject.next(theme);
  }

  toggleTheme() {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setTheme(theme: string) {
    sessionStorage.setItem(this.THEME_KEY, theme);
    this.applyTheme(theme);
  }

  getCurrentTheme(): string {
    return sessionStorage.getItem(this.THEME_KEY) ?? this.DEFAULT_THEME;
  }
}