import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneratorComponent } from './pages/generator/generator.component';
import { PaymentsComponent } from './pages/payments/payments.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'generator',
    pathMatch: 'full'
  },
  {
    path: '',
    children: [
      {
        path: 'generator',
        component: GeneratorComponent
      },
      {
        path: 'payments',
        component: PaymentsComponent
      },
    ]
  },
  {
    path: '**', redirectTo: 'generator'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
