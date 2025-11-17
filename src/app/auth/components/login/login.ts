import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [FormsModule, RouterLink]
})
export class LoginComponent {
  email: string = '';
  contrasena: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  login(loginForm?: NgForm) {
    this.error = '';
    if (loginForm && loginForm.invalid) {
      Object.values(loginForm.controls).forEach(control => control.markAsTouched());
      return;
    }
    this.authService.login({ email: this.email, contrasena: this.contrasena }).subscribe({
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
