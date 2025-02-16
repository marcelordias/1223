import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { GeneratorComponent } from './pages/generator/generator.component';
import { PaymentsComponent } from './pages/payments/payments.component';
import { AuthGuard } from './core/guards/auth/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'generator',
    component: GeneratorComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'payments',
    component: PaymentsComponent,
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/generator', pathMatch: 'full' },
  { path: '**', redirectTo: '/generator' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}