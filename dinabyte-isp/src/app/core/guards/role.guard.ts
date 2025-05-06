import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // Verificar si la ruta tiene roles definidos
    const requiredRoles = route.data['roles'] as Array<string>;
    
    if (!requiredRoles || requiredRoles.length === 0) {
      // Si no hay roles requeridos, permitir acceso
      return true;
    }
    
    // Verificar si el usuario tiene alguno de los roles requeridos
    for (const role of requiredRoles) {
      if (this.authService.hasRole(role)) {
        return true;
      }
    }
    
    // Usuario no tiene los roles necesarios, redirigir según el rol actual
    if (this.authService.hasRole('ROLE_ADMIN')) {
      this.router.navigate(['/admin/dashboard']);
    } else if (this.authService.hasRole('ROLE_CLIENT')) {
      this.router.navigate(['/client']);
    } else {
      this.router.navigate(['/login']);
    }
    
    return false;
  }
}