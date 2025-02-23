import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket/socket.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  socketId: string = '';
  activeUsers: string[] = [];

  constructor(
    private readonly socketService: SocketService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.socketService.on('connect', () => {
      this.socketId = this.socketService.getSocketId();
    });

    this.socketService.on('disconnect', () => {
      this.socketId = '';
      this.activeUsers = [];
    });

    this.socketService.on('activeUsers', (activeUsers: string[]) => {
      const currentUserStr = `${this.authService.getUserInfo()?.username} (You)`;
      this.activeUsers = activeUsers
        .map((user) => {
          if (user === this.authService.getUserInfo()?.username) {
            return currentUserStr;
          }
          return user;
        })
        .sort((a, b) => {
          if (a === currentUserStr) {
            return -1;
          }
          if (b === currentUserStr) {
            return 1;
          }
          return 0;
        });
    });
  }
}
