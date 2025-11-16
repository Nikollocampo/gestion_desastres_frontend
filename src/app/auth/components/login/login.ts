import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [FormsModule, NgIf]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.error = '';
    this.authService.login({ email: this.email, contrasena: this.password }).subscribe({
      next: (user) => {
        this.authService.setUser(user);
        this.router.navigate(['/navigation']);
      },
      error: (err) => {
        this.error = 'Credenciales inválidas o error de conexión.';
      }
    });
  }
}
