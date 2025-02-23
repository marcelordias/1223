import { Injectable, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService implements OnDestroy {
  public connectionStatus$ = new BehaviorSubject<boolean>(false);
  private readonly authSubscription!: Subscription;
  private readonly socket: Socket;

  toast$ = new Subject<{ message: string; type: string }>();

  constructor(
    private readonly authService: AuthService
  ) {
    this.socket = io(environment.socketUrl, {
      auth: {
        token: this.authService.getToken(),
      },
      autoConnect: false,
    });

    this.socket.on('connect', () => {
      this.connectionStatus$.next(true);
    });

    this.socket.on('disconnect', () => {
      this.connectionStatus$.next(false);
    });

    this.socket.on('tokenError', () => {
      this.authService.logout();
    });

    this.socket.on("toast", (data: { message: string; type: string }) => {
      this.toast$.next(data);
    });

    this.authSubscription = this.authService.userInfoSubject$.subscribe(
      (user) => {
        if (!user && this.socket.connected) {
          this.disconnect();
        }
      }
    );
  }

  connect(): void {
    const token = this.authService.getToken();
    if (token) {
      this.socket.auth = { token };
      if (!this.socket.connected) {
        this.socket.connect();
      }
    } else {
      console.error('Token is null, cannot connect to socket server');
    }
  }

  disconnect(): void {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }

  public on<T>(event: string, callback: (data: T) => void): void {
    this.socket.on(event, callback);
  }

  public emit(event: string, data?: any): void {
    this.socket.emit(event, data);
  }

  public getSocketId(): string {
    return this.socket.connected ? this.socket.id ?? '' : '';
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    this.disconnect();
  }
}
