import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginRequest {
  email: string;
  contrasena: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  contrasena: string;
  rol: string;
}

export interface UsuarioResponse {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  //ok
  login(data: LoginRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(`${this.apiUrl}/login`, data);
  }

  register(data: RegisterRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(`${this.apiUrl}/register`, data);
  }

  //ok
  // Métodos para guardar y obtener el usuario logueado
  setUser(user: UsuarioResponse) {
    console.log('AuthService.setUser:', user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): UsuarioResponse | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  logout() {
    localStorage.removeItem('user');
  }

  //
  isLoggedIn(): boolean {
    return !!this.getUser();
  }

  getRol(): string | null {
    const user = this.getUser();
    console.log('AuthService.getRol: user =', user);
    return user ? user.rol : null;
  }
}
