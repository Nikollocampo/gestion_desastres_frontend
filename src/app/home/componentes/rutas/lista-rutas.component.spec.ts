import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ListaRutasComponent } from './lista-rutas.component';
import { RutaService } from '../../services/ruta.service';

describe('ListaRutasComponent', () => {
  let component: ListaRutasComponent;
  let fixture: ComponentFixture<ListaRutasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ListaRutasComponent],
      providers: [RutaService]
    }).compileComponents();

    fixture = TestBed.createComponent(ListaRutasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });
});

