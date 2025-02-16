import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false,
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  choosePassword: string = '';
  error: string = '';
  signupMode: boolean = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  onLogin(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.error = '';
        this.signupMode = false;
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        if (err.message === 'user_not_found') {
          this.signupMode = true;
          this.error = 'User not found. Please sign up by choosing a password.';
        } else {
          this.error = err.message;
        }
      },
    });
  }

  onSignup(): void {
    this.authService.register(this.username, this.choosePassword).subscribe({
      next: () => {
        this.error = '';
        this.signupMode = false;
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        this.error = err.message;
      },
    });
  }
}