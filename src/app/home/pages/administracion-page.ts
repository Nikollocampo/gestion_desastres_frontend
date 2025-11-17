import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-administracion-page',
  standalone: true,
  templateUrl: './administracion-page.html',
  styleUrls: ['./administracion-page.css']
})
export class AdministracionPage implements OnInit {
  rol: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.rol = this.authService.getRol();
  }
}
