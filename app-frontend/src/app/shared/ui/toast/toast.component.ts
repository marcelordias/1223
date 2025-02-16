import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toast',
  standalone: false,
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {

  @Input() message: string = '';
  @Input() type: 'info' | 'error' | 'success' = 'info';

  constructor() {}

}
