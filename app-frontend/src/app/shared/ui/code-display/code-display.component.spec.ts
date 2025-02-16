import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeDisplayComponent } from './code-display.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('CodeDisplayComponent', () => {
  let component: CodeDisplayComponent;
  let fixture: ComponentFixture<CodeDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CodeDisplayComponent],
      providers: [...provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CodeDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
