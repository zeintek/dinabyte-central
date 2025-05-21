import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PlanService } from '../../../core/services/plan.service';
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

@Component({
  selector: 'app-plan-form',
  standalone: true,
    imports: [
      MatButtonModule,
      MatCardModule,
      MatFormFieldModule,
      MatInputModule,
      FormsModule,CommonModule, MatIconModule, MatProgressSpinnerModule,
      RouterModule, // Agrega RouterModule para routerLink
      MatTableModule,ReactiveFormsModule, // Para formControlName
      MatSlideToggleModule
    ],
  templateUrl: './plan-form.component.html',
  styleUrls: ['./plan-form.component.scss']
})
export class PlanFormComponent implements OnInit {
  planForm!: FormGroup;
  isEdit = false;
  planId?: number;
  isLoading = false;
  
  constructor(
    private fb: FormBuilder,
    private planService: PlanService,
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
        this.planId = +params['id'];
        this.loadPlanData(this.planId);
      }
    });
  }
  
  createForm(): void {
    this.planForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      downloadSpeed: ['', [Validators.required]],
      uploadSpeed: ['', [Validators.required]],
      dataCapGB: [null],
      isActive: [true]
    });
  }
  
  loadPlanData(id: number): void {
    this.isLoading = true;
    this.planService.getPlan(id).subscribe(
      plan => {
        this.planForm.patchValue({
          name: plan.name,
          description: plan.description,
          price: plan.price,
          downloadSpeed: plan.downloadSpeed,
          uploadSpeed: plan.uploadSpeed,
          dataCapGB: plan.dataCapGB,
          isActive: plan.isActive
        });
        this.isLoading = false;
      },
      error => {
        console.error('Error loading plan data:', error);
        this.snackBar.open('Error al cargar los datos del plan', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    );
  }
  
  onSubmit(): void {
    if (this.planForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    
    if (this.isEdit && this.planId) {
      this.planService.updatePlan(this.planId, this.planForm.value).subscribe(
        response => {
          this.snackBar.open('Plan actualizado correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/admin/service-plans']);
        },
        error => {
          console.error('Error updating plan:', error);
          this.snackBar.open('Error al actualizar el plan', 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.isLoading = false;
        }
      );
    } else {
      this.planService.createPlan(this.planForm.value).subscribe(
        response => {
          this.snackBar.open('Plan creado correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/admin/service-plans']);
        },
        error => {
          console.error('Error creating plan:', error);
          this.snackBar.open('Error al crear el plan', 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.isLoading = false;
        }
      );
    }
  }
  
  cancel(): void {
    this.router.navigate(['/admin/service-plans']);
  }
}