
import { Routes, Router } from '@angular/router';
import { LoginComponent } from './auth/components/login/login';
import { RegisterComponent } from './auth/components/register/register';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  // Rutas públicas primero
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Redirección raíz
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Rutas protegidas después
  {
    path: 'navigation',
    loadComponent: () => import('./navigation/pages/navigation-page').then(m => m.NavigationPage),
    canActivate: [AuthGuard],
    data: { roles: ['ADMINISTRATOR', 'OPERADOR_EMERGENCIA'] }
  },

  // Wildcard al final
  { path: '**', redirectTo: 'login' }
];
