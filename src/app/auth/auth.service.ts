import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginRequest {
  email: string;
  contrasena: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  contrasena: string;
  role: string;
}

export interface UsuarioResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(`${this.apiUrl}/login`, data);
  }

  register(data: RegisterRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(`${this.apiUrl}/register`, data);
  }

  // Métodos para guardar y obtener el usuario logueado
  setUser(user: UsuarioResponse) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): UsuarioResponse | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  logout() {
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }

  getRole(): string | null {
    const user = this.getUser();
    return user ? user.role : null;
  }
}
