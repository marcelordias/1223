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

  private readonly biasSubject = new BehaviorSubject<string | null>(null);
  public readonly bias$ = this.biasSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  setBias(newBias: string | null): void {
    this.biasSubject.next(newBias);
  }

  // getGrid(): Observable<string[][]> {
  //   return this.http.get<string[][]>('/api/grid');
  // }

  getGrid(): Observable<GridResponse> {
    const bias = this.biasSubject.value;
    const rows = 10;
    const cols = 10;

    let grid: string[][] = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () =>
        String.fromCharCode(97 + Math.floor(Math.random() * 26)),
      ),
    );
    console.log('getGrid with: ', bias);
    const code = Math.floor(Math.random() * 100);
    this.codeSubject.next(code);
    this.liveStatusSubject.next(true);
    return of({ grid, code });
  }
}
