import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket/socket.service';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  socketId: string = 'Not connected';

  constructor(private readonly socketService: SocketService) {}

  ngOnInit(): void {
    this.socketService.on('connect', () => {
      this.socketId = this.socketService.getSocketId();
    });
    this.socketId = this.socketService.getSocketId();
  }
}