import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PlanService } from '../../../core/services/plan.service';
import { ServicePlan } from '../../../shared/models/service-plan.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
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
  selector: 'app-plan-list',
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
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.scss']
})
export class PlanListComponent implements OnInit {
  plans: ServicePlan[] = [];
  isLoading = true;
  displayedColumns: string[] = ['id', 'name', 'price', 'speed', 'isActive', 'actions'];
  
  constructor(
    private planService: PlanService,
    private router: Router,
    private dialog: MatDialog
  ) { }
  
  ngOnInit(): void {
    this.loadPlans();
  }
  
  loadPlans(): void {
    this.isLoading = true;
    this.planService.getPlans().subscribe(
      plans => {
        this.plans = plans;
        this.isLoading = false;
      },
      error => {
        console.error('Error loading plans:', error);
        this.isLoading = false;
      }
    );
  }
  
  editPlan(id: number): void {
    this.router.navigate(['/admin/service-plans/edit', id]);
  }
  
  deletePlan(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { 
        title: 'Confirmar eliminación', 
        message: '¿Está seguro que desea eliminar este plan? Esta acción no se puede deshacer.' 
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.planService.deletePlan(id).subscribe(
          () => {
            this.loadPlans();
          },
          error => {
            console.error('Error deleting plan:', error);
          }
        );
      }
    });
  }
}