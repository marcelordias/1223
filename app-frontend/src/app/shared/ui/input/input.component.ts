import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input',
  standalone: false,
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
})
export class InputComponent {
  @Input() value: string = '';
  @Input() label: string = '';
  @Input() hint: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() maxLength: number = 100;
  @Output() valueChange = new EventEmitter<string>();

  onInput(event: any): void {
    const newValue = event.target.value;
    this.valueChange.emit(newValue);
  }
}