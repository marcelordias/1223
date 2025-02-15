import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UiModule } from './shared/ui/ui.module';
import { CoreModule } from './core/core.module';
import { GeneratorComponent } from './pages/generator/generator.component';
import { GridComponent } from './shared/ui/grid/grid.component';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { PaymentsComponent } from './pages/payments/payments.component';

@NgModule({
  declarations: [
    AppComponent,
    GeneratorComponent,
    GridComponent,
    PaymentsComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, UiModule, CoreModule],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent],
})
export class AppModule {}