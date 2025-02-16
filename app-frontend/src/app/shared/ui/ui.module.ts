import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input/input.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { ThemeControlComponent } from './theme-control/theme-control.component';
import { FormsModule } from '@angular/forms';
import { CodeDisplayComponent } from './code-display/code-display.component';
import { TableComponent } from './table/table.component';
import { ModalComponent } from './modal/modal.component';
import { FooterComponent } from './footer/footer.component';
import { ToastComponent } from './toast/toast.component';
import { ClockComponent } from './clock/clock.component';

@NgModule({
  declarations: [
    InputComponent,
    NavbarComponent,
    ThemeControlComponent,
    CodeDisplayComponent,
    TableComponent,
    ModalComponent,
    FooterComponent,
    ToastComponent,
    ClockComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule
  ],
  exports: [
    InputComponent,
    NavbarComponent,
    CodeDisplayComponent,
    TableComponent,
    ModalComponent,
    FooterComponent,
    ToastComponent,
    ClockComponent,
  ]
})
export class UiModule { }
