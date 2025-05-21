import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('AuthGuard: Checking authentication for route:', state.url);
    if (state.url === '/login') {
      console.log('AuthGuard: Already on /login, allowing access to avoid loop');
      return true;
    }

    if (this.authService.isLoggedIn()) {
      console.log('AuthGuard: User is authenticated, allowing access');
      return true;
    }

    console.log('AuthGuard: User not authenticated, redirecting to /login');
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}