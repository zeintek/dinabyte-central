import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PlanService } from '../../../core/services/plan.service';
import { ServicePlan } from '../../../shared/models/service-plan.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-plan-list',
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