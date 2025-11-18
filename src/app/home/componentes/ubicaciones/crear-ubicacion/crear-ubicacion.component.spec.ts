import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearUbicacionComponent } from './crear-ubicacion.component';

describe('CrearUbicacionComponent', () => {
  let component: CrearUbicacionComponent;
  let fixture: ComponentFixture<CrearUbicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearUbicacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearUbicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
