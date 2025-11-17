import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  nombre: string = '';
  email: string = '';
  password: string = '';
  rol: string = 'ADMINISTRADOR';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  register() {
    this.error = '';
    this.authService
      .register({ nombre: this.nombre, email: this.email, contrasena: this.password, rol: this.rol })
      .subscribe({
        next: (user) => {
          this.authService.setUser(user);
          this.router.navigate(['/navigation']);
        },
        error: () => {
          this.error = 'No se pudo registrar. Verifica los datos.';
        }
      });
  }
}
