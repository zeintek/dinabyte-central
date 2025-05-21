import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  snackBar: any;
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Error de autenticación - cerrar sesión y redirigir a login
          this.authService.logout();
          this.router.navigate(['/login']);
          this.snackBar.open('Sesión expirada. Por favor, inicie sesión de nuevo.', 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        } else if (error.status === 403) {
          // Error de autorización - mostrar mensaje
          this.snackBar.open('No tiene permisos para realizar esta acción.', 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        } else if (error.status === 404) {
          // Recurso no encontrado
          this.snackBar.open('El recurso solicitado no existe.', 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        } else {
          // Otros errores
          let errorMessage = 'Ha ocurrido un error.';
          
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          
          this.snackBar.open(errorMessage, 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
        
        return throwError(error);
      })
    );
  }
}