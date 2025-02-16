import {inject, NgModule, provideAppInitializer } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from './services/theme/theme.service';
import { AuthService } from '../shared/services/auth/auth.service';

export function initAuth(authService: AuthService) {
  return () => authService.autoLogin();
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    provideAppInitializer(() => {
      inject(ThemeService).init();
   }),
   provideAppInitializer(() => initAuth(inject(AuthService))()),
  ]
})
export class CoreModule { }
