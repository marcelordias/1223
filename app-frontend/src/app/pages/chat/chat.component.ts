import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SocketService } from '../../shared/services/socket/socket.service';
import { AuthService, UserInfo } from '../../shared/services/auth/auth.service';
import { ChatService } from '../../shared/services/chat/chat.service';

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

interface User extends UserInfo {
  isOnline: boolean;
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
  private readonly ACTIVE_USERS_EVENT = 'activeUsers';

  user$: Observable<UserInfo | null>;

  constructor(
    private readonly socketService: SocketService,
    private readonly authService: AuthService,
    private readonly chatService: ChatService
  ) {
    this.user$ = this.authService.userInfoSubject$;
  }

  ngOnInit(): void {
    this.socketService.connectionStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => {
        this.isGeneratorActive = status;
      });

    this.chatService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => {
        this.users = users.map((user) => ({
          ...user,
          isOnline: false,
          isTyping: false,
        }));

        this.socketService.emit('requestActiveUsers');
      });

    this.socketService.on(this.ACTIVE_USERS_EVENT, (activeUsers: string[]) => {
     
      this.users = this.users.map((user) => {
        const wasOnline = user.isOnline;
        const isNowOnline = activeUsers.includes(user.username);

        if (wasOnline && !isNowOnline) {
          return {
            ...user,
            isOnline: false,
            lastSeen: new Date(),
          };
        }

        return {
          ...user,
          isOnline: isNowOnline,
        };
      });

      console.log('Active users:',  this.users);
    });

    this.socketService.on(
      'userDisconnected',
      (data: { username: string; timestamp: Date }) => {
        this.users = this.users.map((user) => {
          if (user.username === data.username) {
            return {
              ...user,
              isOnline: false,
              lastSeen: new Date(data.timestamp),
            };
          }
          return user;
        });
      }
    );
  }

  onlineUsers(): User[] {
    return this.users.filter((user) => user.isOnline);
  }

  offlineUsers(): User[] {
    return this.users.filter((user) => !user.isOnline);
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

  ngOnDestroy(): void {
    this.socketService.off(this.ACTIVE_USERS_EVENT);
    this.socketService.off('userDisconnected');
    this.destroy$.next();
    this.destroy$.complete();
  }
}
