import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserInfo } from '../auth/auth.service';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private readonly http: HttpClient) {}

  getUsers(): Observable<UserInfo[]> {
    return this.http.get(`${environment.apiUrl}/user/users`).pipe(
      map((response: any) => {
        if (response.status !== 'success') {
          throw response;
        }
        return response.data.users as UserInfo[];
      }),
      catchError((error: any) => throwError(() => error))
    );
  }
}
