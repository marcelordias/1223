import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  delay,
  Observable,
  of,
  BehaviorSubject,
  Subscription,
  interval,
  switchMap,
} from 'rxjs';

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

  private readonly gridSubject = new BehaviorSubject<string[][]>(
    Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => '')),
  );
  public readonly grid$ = this.gridSubject.asObservable();

  private readonly biasSubject = new BehaviorSubject<string | null>(null);
  public readonly bias$ = this.biasSubject.asObservable();

  private generationSub: Subscription | null = null;

  constructor(private readonly http: HttpClient) {}

  getCode(): number {
    return this.codeSubject.value;
  }

  getBias(): string | null {
    return this.biasSubject.value;
  }
  
  getGridData(): string[][] {
    return this.gridSubject.value;
  }

  setBias(newBias: string | null): void {
    this.biasSubject.next(newBias);
  }

  // getGrid(): Observable<string[][]> {
  //   return this.http.get<string[][]>('/api/grid');
  // }

  private getGrid(): Observable<GridResponse> {
    const bias = this.biasSubject.value;
    const rows = 10;
    const cols = 10;
    let grid: string[][] = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () =>
        String.fromCharCode(97 + Math.floor(Math.random() * 26)),
      ),
    );
    console.log(bias);
    const code = Math.floor(Math.random() * 100);
    return of({ grid, code }).pipe(delay(100));
  }

  startGlobalGeneration(): void {
    if (this.generationSub) return;
    this.generationSub = interval(2000)
      .pipe(switchMap(() => this.getGrid()))
      .subscribe((response) => {
        this.gridSubject.next(response.grid);
        this.codeSubject.next(response.code);
        this.liveStatusSubject.next(true);
      });
  }

  stopGlobalGeneration(): void {
    if (this.generationSub) {
      this.generationSub.unsubscribe();
      this.generationSub = null;
      this.liveStatusSubject.next(false);
    }
  }
}
