import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('RoleGuard: Checking roles for route:', state.url);

    if (!this.authService.isLoggedIn()) {
      console.log('RoleGuard: User not authenticated, redirecting to /login');
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    const requiredRoles = route.data['roles'] as Array<string>;

    if (!requiredRoles || requiredRoles.length === 0) {
      console.log('RoleGuard: No roles required, allowing access');
      return true;
    }

    for (const role of requiredRoles) {
      if (this.authService.hasRole(role)) {
        console.log(`RoleGuard: User has required role (${role}), allowing access`);
        return true;
      }
    }

    console.log('RoleGuard: User does not have required roles, redirecting...');
    if (this.authService.hasRole('ROLE_ADMIN')) {
      console.log('RoleGuard: Redirecting to /dashboard');
      this.router.navigate(['/dashboard']); // Cambiado a /dashboard
    } else if (this.authService.hasRole('ROLE_CLIENT')) {
      console.log('RoleGuard: Redirecting to /client');
      this.router.navigate(['/client']);
    } else {
      console.log('RoleGuard: Redirecting to /login');
      this.router.navigate(['/login']);
    }

    return false;
  }
}