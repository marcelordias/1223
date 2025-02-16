import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratorComponent } from './generator.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('GeneratorComponent', () => {
  let component: GeneratorComponent;
  let fixture: ComponentFixture<GeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneratorComponent],
      providers: [...provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(GeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
