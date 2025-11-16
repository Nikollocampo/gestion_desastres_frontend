import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    const expectedRoles = route.data['roles'] as string[];
    const userRole = this.authService.getRole();
    if (expectedRoles && (!userRole || !expectedRoles.includes(userRole))) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
