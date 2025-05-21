import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MikrotikService } from '../../../core/services/mikrotik.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button'; // Importa el módulo del botón
import { MatCardModule } from '@angular/material/card'; // Importa el módulo de la tarjeta
import { MatInputModule } from '@angular/material/input'; // Importa el módulo de input
import { MatFormFieldModule } from '@angular/material/form-field'; // Importa el módulo de form field
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Necesario para ngModel
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-router-form',
  standalone: true,
        imports: [
          MatButtonModule,
          MatCardModule,
          MatFormFieldModule,
          MatInputModule,
          FormsModule,CommonModule, MatIconModule, MatProgressSpinnerModule,
          RouterModule, // Agrega RouterModule para routerLink
          MatTableModule,ReactiveFormsModule, // Para formControlName
          MatSlideToggleModule, MatSelectModule
        ],
  templateUrl: './router-form.component.html',
  styleUrls: ['./router-form.component.scss']
})
export class RouterFormComponent implements OnInit {
  routerForm!: FormGroup;
  isEdit = false;
  routerId?: number;
  isLoading = false;
  
  routerStatuses = [
    { value: 'ACTIVE', viewValue: 'Activo' },
    { value: 'INACTIVE', viewValue: 'Inactivo' },
    { value: 'MAINTENANCE', viewValue: 'Mantenimiento' }
  ];
  
  constructor(
    private fb: FormBuilder,
    private mikrotikService: MikrotikService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }
  
  ngOnInit(): void {
    this.createForm();
    
    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.routerId = +params['id'];
        this.loadRouterData(this.routerId);
      }
    });
  }
  
  createForm(): void {
    this.routerForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      ipAddress: ['', [Validators.required, Validators.pattern('^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$')]],
      apiPort: [8728, [Validators.required, Validators.min(1), Validators.max(65535)]],
      username: ['', [Validators.required]],
      password: ['', this.isEdit ? [] : [Validators.required]],
      status: ['ACTIVE', [Validators.required]],
      location: [''],
      latitude: [null],
      longitude: [null]
    });
  }
  
  loadRouterData(id: number): void {
    this.isLoading = true;
    this.mikrotikService.getRouter(id).subscribe(
      router => {
        this.routerForm.patchValue({
          name: router.name,
          description: router.description,
          ipAddress: router.ipAddress,
          apiPort: router.apiPort,
          username: router.username,
          // No se carga la contraseña por seguridad
          status: router.status,
          location: router.location,
          latitude: router.latitude,
          longitude: router.longitude
        });
        
        // Eliminar la validación requerida para la contraseña en modo edición
        this.routerForm.get('password')!.setValidators([]);
        this.routerForm.get('password')!.updateValueAndValidity();
        
        this.isLoading = false;
      },
      error => {
        console.error('Error loading router data:', error);
        this.snackBar.open('Error al cargar los datos del router', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    );
  }
  
  onSubmit(): void {
    if (this.routerForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    
    if (this.isEdit && this.routerId) {
      this.mikrotikService.updateRouter(this.routerId, this.routerForm.value).subscribe(
        response => {
          this.snackBar.open('Router actualizado correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/admin/mikrotik/routers']);
        },
        error => {
          console.error('Error updating router:', error);
          this.snackBar.open('Error al actualizar el router', 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.isLoading = false;
        }
      );
    } else {
      this.mikrotikService.createRouter(this.routerForm.value).subscribe(
        response => {
          this.snackBar.open('Router creado correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/admin/mikrotik/routers']);
        },
        error => {
          console.error('Error creating router:', error);
          this.snackBar.open('Error al crear el router', 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.isLoading = false;
        }
      );
    }
  }
  
  cancel(): void {
    this.router.navigate(['/admin/mikrotik/routers']);
  }
}