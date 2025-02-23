import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './shared/services/auth/auth.service';
import { SocketService } from './shared/services/socket/socket.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  private authSub!: Subscription;
  toasts: { message: string; type: 'info' | 'error' | 'success' }[] = [];

  constructor(
    private readonly authService: AuthService,
    private readonly socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.authSub = this.authService.userInfoSubject$
      .pipe(filter((user) => !!user))
      .subscribe(() => {
        this.socketService.connect();
      });

    this.authService.autoLogin().subscribe();

    this.socketService.toast$.subscribe(({ message, type}) => {
      this.toasts.push({ message, type: type as 'info' | 'error' | 'success' });
      setTimeout(() => {
        this.toasts.shift();
      }, 3000);
    });
  }

  ngOnDestroy(): void {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }
}
