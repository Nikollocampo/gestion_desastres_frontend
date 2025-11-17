import { Routes, Router } from '@angular/router';
import { LoginComponent } from './auth/components/login/login';
import { RegisterComponent } from './auth/components/register/register';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [

  // Redirección raíz
  { path: '', redirectTo: 'login', pathMatch: 'full' },


  // Rutas públicas primero
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },


  // Rutas protegidas después
  {
    path: 'navigation',
    loadComponent: () => import('./navigation/pages/navigation-page').then(m => m.NavigationPage),
    canActivate: [AuthGuard],
    data: { roles: ['ADMINISTRADOR', 'OPERADOR_EMERGENCIA'] },
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', loadComponent: () => import('./home/pages/inicio-page').then(m => m.InicioPage) }
    ]
  },

  // Wildcard al final
  { path: '**', redirectTo: 'login' }
];
