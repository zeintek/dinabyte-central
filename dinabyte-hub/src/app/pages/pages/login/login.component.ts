import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  errorMessage: string = '';
  focus: boolean = false;
  focus2: boolean = false;
  isLoading: boolean = false;
  private pageElement: HTMLElement | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private renderer: Renderer2
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.pageElement = document.getElementsByClassName('full-page')[0] as HTMLElement;

    if (this.pageElement) {
      this.renderer.addClass(this.pageElement, 'login-page');
      const imageContainer = this.renderer.createElement('div');
      this.renderer.addClass(imageContainer, 'full-page-background');
      this.renderer.setStyle(imageContainer, 'backgroundImage', 'url(assets/img/bg14.jpg)');
      this.renderer.appendChild(this.pageElement, imageContainer);
    } else {
      console.warn('Elemento con clase "full-page" no encontrado');
    }
  }

  ngOnDestroy() {
    if (this.pageElement) {
      this.renderer.removeClass(this.pageElement, 'login-page');
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos requeridos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.value;
    this.authService.login(username, password).subscribe({
      next: (response) => {
        console.log('Inicio de sesión exitoso:', response);
        // Redirigir según el rol del usuario
        if (this.authService.hasRole('ROLE_ADMIN')) {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard'; // Cambiado a /dashboard
          this.router.navigate([returnUrl]);
        } else if (this.authService.hasRole('ROLE_CLIENT')) {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/client';
          this.router.navigate([returnUrl]);
        } else {
          this.errorMessage = 'No tienes permisos para acceder a esta aplicación.';
          this.authService.logout();
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error al iniciar sesión:', err);
        this.errorMessage = err.error?.message || 'Usuario o contraseña inválidos';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  get f() {
    return this.loginForm.controls;
  }
}