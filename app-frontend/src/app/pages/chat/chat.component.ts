import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SocketService } from '../../shared/services/socket/socket.service';
import { AuthService, UserInfo } from '../../shared/services/auth/auth.service';

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

interface User {
  id: string;
  username: string;
  isActive: boolean;
  isTyping: boolean;
  lastSeen?: Date;
}

@Component({
  selector: 'app-chat',
  standalone: false,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: ChatMessage[] = [];
  newMessage = '';
  users: User[] = [];
  isGeneratorActive = false;
  isTyping = false;
  typingTimeout: any;
  private readonly destroy$ = new Subject<void>();

  user$: Observable<UserInfo | null>;

  constructor(
    private readonly socketService: SocketService,
    private readonly authService: AuthService
  ) {
    this.user$ = this.authService.userInfoSubject$;
  }

  ngOnInit(): void {
    this.socketService.connectionStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => {
        this.isGeneratorActive = status;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onKeyPress(): void {
    if (!this.isTyping) {
      this.isTyping = true;
    }

    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      this.isTyping = false;
    }, 2000);
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.isGeneratorActive) {
      this.newMessage = '';
      this.isTyping = false;
    }
  }
}
