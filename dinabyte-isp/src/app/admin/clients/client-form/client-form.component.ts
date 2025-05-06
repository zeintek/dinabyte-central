import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';
import { PlanService } from '../../../core/services/plan.service';
import { MikrotikService } from '../../../core/services/mikrotik.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServicePlan } from '../../../shared/models/service-plan.model';
import { MikrotikRouter } from '../../../shared/models/mikrotik-router.model';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']
})
export class ClientFormComponent implements OnInit {
  clientForm: FormGroup;
  plans: ServicePlan[] = [];
  routers: MikrotikRouter[] = [];
  isLoading = false;
  isEdit = false;
  clientId: number;
  
  connectionTypes = [
    { value: 'SIMPLE_QUEUE', viewValue: 'Simple Queue' },
    { value: 'PCQ', viewValue: 'PCQ' },
    { value: 'HOTSPOT', viewValue: 'Hotspot' },
    { value: 'PPPOE', viewValue: 'PPPoE' }
  ];
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    private planService: PlanService,
    private mikrotikService: MikrotikService,
    private snackBar: MatSnackBar
  ) { }
  
  ngOnInit(): void {
    this.createForm();
    this.loadServicePlans();
    this.loadRouters();
    
    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.clientId = +params['id'];
        this.loadClientData(this.clientId);
      }
    });
  }
  
  createForm(): void {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: [''],
      latitude: [null],
      longitude: [null],
      servicePlanId: ['', [Validators.required]],
      routerId: ['', [Validators.required]],
      ipAddress: ['', [Validators.required, Validators.pattern('^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$')]],
      connectionType: ['SIMPLE_QUEUE', [Validators.required]],
      password: ['', this.isEdit ? [] : [Validators.required, Validators.minLength(6)]]
    });
  }
  
  loadServicePlans(): void {
    this.planService.getPlans().subscribe(
      data => {
        this.plans = data;
      },
      error => {
        console.error('Error loading service plans:', error);
        this.snackBar.open('Error cargando planes de servicio', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    );
  }
  
  loadRouters(): void {
    this.mikrotikService.getRouters().subscribe(
      data => {
        this.routers = data;
      },
      error => {
        console.error('Error loading routers:', error);
        this.snackBar.open('Error cargando routers', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    );
  }
  
  loadClientData(id: number): void {
    this.isLoading = true;
    this.clientService.getClient(id).subscribe(
      client => {
        this.clientForm.patchValue({
          name: client.name,
          lastName: client.lastName,
          email: client.email,
          phone: client.phone,
          address: client.address,
          latitude: client.latitude,
          longitude: client.longitude,
          servicePlanId: client.servicePlan.id,
          routerId: client.router.id,
          ipAddress: client.ipAddress,
          connectionType: client.connectionType
        });
        
        // Remove password validation for edit mode
        this.clientForm?.get('password')?.setValidators([]);
        this.clientForm?.get('password')?.updateValueAndValidity();
        
        this.isLoading = false;
      },
      error => {
        console.error('Error loading client:', error);
        this.snackBar.open('Error cargando datos del cliente', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    );
  }
  
  onSubmit(): void {
    if (this.clientForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.clientForm.controls).forEach(key => {
        this.clientForm?.get(key)?.markAsTouched();
      });
      return;
    }
    
    this.isLoading = true;
    
    if (this.isEdit) {
      this.clientService.updateClient(this.clientId, this.clientForm.value).subscribe(
        response => {
          this.snackBar.open('Cliente actualizado correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/admin/clients']);
          this.isLoading = false;
        },
        error => {
          console.error('Error updating client:', error);
          this.snackBar.open('Error actualizando cliente', 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.isLoading = false;
        }
      );
    } else {
      this.clientService.createClient(this.clientForm.value).subscribe(
        response => {
          this.snackBar.open('Cliente creado correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/admin/clients']);
          this.isLoading = false;
        },
        error => {
          console.error('Error creating client:', error);
          this.snackBar.open('Error creando cliente', 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.isLoading = false;
        }
      );
    }
  }
  
  cancel(): void {
    this.router.navigate(['/admin/clients']);
  }
}