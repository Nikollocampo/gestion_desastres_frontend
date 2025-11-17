import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursosDisponibles } from './recursos-disponibles';

describe('RecursosDisponibles', () => {
  let component: RecursosDisponibles;
  let fixture: ComponentFixture<RecursosDisponibles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecursosDisponibles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecursosDisponibles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
