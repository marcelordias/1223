import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-clock',
  standalone: false,
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})
export class ClockComponent  {
  @Input() time: string = '';

  constructor() {}

  getCurrentTime(time: string): string {
    const now = new Date(time);
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
}
