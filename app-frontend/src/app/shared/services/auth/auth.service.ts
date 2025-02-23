import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

export interface UserInfo {
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'authToken';
  private readonly userInfoSubject = new BehaviorSubject<UserInfo | null>(null);
  public readonly userInfoSubject$ = this.userInfoSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  login(username: string, password: string): Observable<any> {
    return this.http
      .post(`${environment.apiUrl}/auth/login`, { username, password })
      .pipe(
        map((response: any) => {
          if (response.status !== 'success') {
            throw response;
          }
          return response;
        }),
        tap((response: any) => {
          this.setToken(response.data.token);
        }),
        catchError((error: any) => throwError(() => error))
      );
  }

  register(username: string, password: string): Observable<any> {
    return this.http
      .post(`${environment.apiUrl}/auth/register`, { username, password })
      .pipe(
        map((response: any) => {
          if (response.status !== 'success') {
            throw response;
          }
          return response;
        }),
        tap((response: any) => {
          this.setToken(response.data.token);
        }),
        catchError((error: any) => throwError(() => error))
      );
  }

  private getUser(): Observable<UserInfo> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token provided'));
    }
    return this.http.get(`${environment.apiUrl}/user/user-info`).pipe(
      map((response: any) => {
        if (response.status !== 'success') {
          throw response;
        }
        this.userInfoSubject.next(response.data.user);
        return response.data.user;
      }),
      catchError((error: any) => throwError(() => error))
    );
  }

  validateToken(): Observable<boolean> {
    return this.getUser().pipe(
      map(() => true),
      catchError(() => {
        this.logout();
        return of(false);
      })
    );
  }

  autoLogin(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      return of(false);
    }
    return this.validateToken();
  }

  logout(): void {
    this.clearToken();
    this.userInfoSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserInfo(): UserInfo | null {
    return this.userInfoSubject.value;
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
