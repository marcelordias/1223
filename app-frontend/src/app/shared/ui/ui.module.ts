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

@NgModule({
  declarations: [
    InputComponent,
    NavbarComponent,
    ThemeControlComponent,
    CodeDisplayComponent,
    TableComponent,
    ModalComponent,
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
  ]
})
export class UiModule { }
