import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input',
  standalone: false,
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
})
export class InputComponent {
  @Input() value!: string;
  @Input() label!: string;
  @Input() hint = '';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() required = false;
}
