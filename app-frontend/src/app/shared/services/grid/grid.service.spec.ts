import { TestBed } from '@angular/core/testing';
import { GridService } from './grid.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('GridService', () => {
  let service: GridService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [GridService, provideHttpClientTesting()]
    });
    service = TestBed.inject(GridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});