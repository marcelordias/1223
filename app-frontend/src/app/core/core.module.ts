import {inject, NgModule, provideAppInitializer } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from './services/theme/theme.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    provideAppInitializer(() => {
      inject(ThemeService).init();
   })
  ]
})
export class CoreModule { }
