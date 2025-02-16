import { TestBed } from '@angular/core/testing';
import { SocketService } from './socket.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('SocketService', () => {
  let service: SocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ...provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(SocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
