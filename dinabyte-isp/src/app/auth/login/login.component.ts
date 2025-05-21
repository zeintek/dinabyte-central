import { afterNextRender, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { MatDivider } from '@angular/material/divider';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-login',
  standalone: true,
      imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatSlideToggleModule,
        MatSelectModule,
        NgChartsModule, MatDivider
      ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitted = false;
  errorMessage = '';
  loggedInUser: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { 
    afterNextRender(() => {

      const storedData = localStorage.getItem('auth');
      if (storedData) {
        try {
          this.loggedInUser = JSON.parse(storedData);
        }
        catch (err) {
        }
      }
    });
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.redirectBasedOnRole();
    }
  }

  // Getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.isSubmitted = true;
    this.errorMessage = '';
  
    if (this.loginForm.invalid) {
      return;
    }
  
    this.authService.login(
      this.f['username'].value,
      this.f['password'].value
    ).subscribe(
      data => {
        console.log('Login exitoso, token:', data);
        this.redirectBasedOnRole();
      },
      err => {
        console.error('Error en login:', err);
        this.errorMessage = err.statusText || err.message || 'Error en la autenticación';
        if (err.status === 0) {
          this.errorMessage = 'Error de CORS o conexión al servidor';
        }
      }
    );
  }

  redirectBasedOnRole(): void {
    if (this.authService.hasRole('ROLE_ADMIN')) {
      this.router.navigate(['/admin/dashboard']);
    } else if (this.authService.hasRole('ROLE_CLIENT')) {
      this.router.navigate(['/client']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}