import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  role: string = 'ADMINISTRATOR';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.error = '';
    this.authService
      .register({ name: this.name, email: this.email, contrasena: this.password, role: this.role })
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
