import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles = route.data['roles'] as string[];
    const userRol = this.authService.getRol();
    if (!this.authService.isLoggedIn()) {
      console.log('AuthGuard: usuario no logueado, redirigiendo a /login');
      this.router.navigate(['/login']);
      return false;
    }
    if (expectedRoles && (!userRol || !expectedRoles.includes(userRol))) {
      console.log('AuthGuard: rol no permitido, redirigiendo a /login');
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
