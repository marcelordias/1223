import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input',
  standalone: false,
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
})
export class InputComponent {
  @Input() value: any = '';
  @Input() label: string = '';
  @Input() hint: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() maxLength: number = 100;
  @Input() pattern: string = '';
  @Output() valueChange = new EventEmitter<string>();

  onKeyPress(event: KeyboardEvent): void {
    if (this.pattern) {
      const regex = new RegExp(this.pattern);
      if (!regex.test(event.key)) {
        event.preventDefault();
      }
    }
  }

  onInput(event: any): void {
    const newValue = event.target.value;
    this.valueChange.emit(newValue);
  }
}