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
      { path: 'inicio', loadComponent: () => import('./home/pages/inicio-page').then(m => m.InicioPage) },
      { path: 'administracion', loadComponent: () => import('./home/pages/administracion-page').then(m => m.AdministracionPage) },
      { path: 'rutas-estadisticas', loadComponent: () => import('./home/pages/rutas-estadisticas-page').then(m => m.RutasEstadisticasPage) },
      { path: 'estadisticas', loadComponent: () => import('./home/pages/estadisticas-page').then(m => m.EstadisticasPage) },
      { path: 'mapa-interactivo', loadComponent: () => import('./home/pages/mapa-interactivo-page').then(m => m.MapaInteractivoPage) }
    ]
  },

  // Wildcard al final
  { path: '**', redirectTo: 'login' }
];
