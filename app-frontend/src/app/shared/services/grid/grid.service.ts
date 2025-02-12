import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';

export interface GridResponse {
  grid: string[][];
  code: number;
}

@Injectable({ providedIn: 'root' })
export class GridService {
  private readonly codeSubject = new BehaviorSubject<number>(0);
  public readonly code$ = this.codeSubject.asObservable();

  private readonly liveStatusSubject = new BehaviorSubject<boolean>(false);
  public readonly liveStatus$ = this.liveStatusSubject.asObservable();


  constructor(private readonly http: HttpClient) {}

   // getGrid(): Observable<string[][]> {
  //   return this.http.get<string[][]>('/api/grid');
  // }

  getGrid(): Observable<GridResponse> {
    const rows = 10;
    const cols = 10;
    const grid: string[][] = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () =>
        String.fromCharCode(97 + Math.floor(Math.random() * 26))
      )
    );
    const code = Math.floor(Math.random() * 100);
    this.codeSubject.next(code);
    this.liveStatusSubject.next(true);
    return of({ grid, code });
  }
}