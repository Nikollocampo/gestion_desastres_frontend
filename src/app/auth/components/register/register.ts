import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
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

  register(registerForm?: NgForm) {
    this.error = '';
    if (registerForm && registerForm.invalid) {
      Object.values(registerForm.controls).forEach(control => control.markAsTouched());
      return;
    }
    this.authService
      .register({ nombre: this.nombre, email: this.email, contrasena: this.password, rol: this.rol })
      .subscribe({
        next: (user) => {
          this.authService.setUser(user);
          this.router.navigate(['/navigation']);
        },
        error: (err) => {
          this.error = err?.error?.error || err?.error?.message || 'No se pudo registrar. Verifica los datos.';
        }
      });
  }
}
