import { Component, OnInit } from '@angular/core';
import { AuthService, UserInfo } from '../../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  userInfo?: UserInfo;

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.userInfoSubject$
      .subscribe((user) => {
        this.userInfo = user ?? undefined;
      });
  }

  onLogout(): void {
    this.authService.logout();
  }
}
