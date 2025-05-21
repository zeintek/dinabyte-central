import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class LoggedInGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      console.log('LoggedInGuard: User is already logged in, redirecting to /admin/dashboard');
      this.router.navigate(['/admin/dashboard']);
      return false;
    }
    console.log('LoggedInGuard: User is not logged in, allowing access to login');
    return true;
  }
}