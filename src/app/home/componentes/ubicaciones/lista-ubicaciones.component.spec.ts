import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ListaUbicacionesComponent } from './lista-ubicaciones.component';
import { UbicacionService } from '../../services/ubicacion.service';

describe('ListaUbicacionesComponent', () => {
  let component: ListaUbicacionesComponent;
  let fixture: ComponentFixture<ListaUbicacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ListaUbicacionesComponent],
      providers: [UbicacionService]
    }).compileComponents();

    fixture = TestBed.createComponent(ListaUbicacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });
});

