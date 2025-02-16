import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'info' | 'error' | 'success';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toastSubject = new Subject<Toast>();

  show(message: string, type: 'info' | 'error' | 'success' = 'info'): void {
    this.toastSubject.next({ message, type });
  }
}