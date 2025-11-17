import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonasAfectadas } from './zonas-afectadas';

describe('ZonasAfectadas', () => {
  let component: ZonasAfectadas;
  let fixture: ComponentFixture<ZonasAfectadas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZonasAfectadas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZonasAfectadas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
