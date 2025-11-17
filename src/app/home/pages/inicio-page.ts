import { Component } from '@angular/core';
import { RecursosDisponibles } from '../componentes/recursos-disponibles/recursos-disponibles';
import { ZonasAfectadas } from '../componentes/zonas-afectadas/zonas-afectadas';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-inicio-page',
  standalone: true,
  imports: [ZonasAfectadas, RecursosDisponibles],
  templateUrl: './inicio-page.html',
  styleUrl: './inicio-page.css',
})

export class InicioPage {
  

}
