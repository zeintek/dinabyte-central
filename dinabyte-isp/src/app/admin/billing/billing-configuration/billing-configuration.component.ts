// src/app/admin/billing/billing-configuration/billing-configuration.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BillingConfigurationService } from '../../../core/services/billing-configuration.service';
import { ClientService } from '../../../core/services/client.service';
import { BillingConfiguration } from '../../../shared/models/billing-configuration.model';
import { Client } from '../../../shared/models/client.model';
import { PaymentMethod } from '../../../shared/models/payment.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-billing-configuration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './billing-configuration.component.html',
  styleUrls: ['./billing-configuration.component.scss']
})
export class BillingConfigurationComponent implements OnInit {
  configForm: FormGroup;
  selectedClientId: number | null = null;
  clients: Client[] = [];
  configurations: BillingConfiguration[] = [];
  paymentMethods = Object.values(PaymentMethod);
  loading = false;

  constructor(
    private fb: FormBuilder,
    private billingConfigService: BillingConfigurationService,
    private clientService: ClientService,
    private snackBar: MatSnackBar
  ) {
    this.configForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadClients();
    this.loadAllConfigurations();
  }

  createForm(): FormGroup {
    return this.fb.group({
      clientId: ['', Validators.required],
      billingDay: [1, [Validators.required, Validators.min(1), Validators.max(28)]],
      dueDays: [10, [Validators.required, Validators.min(1)]],
      autoSuspend: [true],
      daysToSuspendAfterDue: [5, [Validators.required, Validators.min(1)]],
      preferredPaymentMethod: [PaymentMethod.CASH, Validators.required]
    });
  }

  loadClients(): void {
    this.clientService.getClients().subscribe({
      next: (clients) => {
        this.clients = clients;
      },
      error: (error) => {
        console.error('Error loading clients', error);
        this.snackBar.open('Error loading clients', 'Close', { duration: 3000 });
      }
    });
  }

  loadAllConfigurations(): void {
    this.loading = true;
    this.billingConfigService.getAllConfigurations().subscribe({
      next: (configurations) => {
        this.configurations = configurations;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading configurations', error);
        this.snackBar.open('Error loading billing configurations', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onClientSelect(event: any): void {
    const clientId = event.value;
    this.selectedClientId = clientId;
    
    const existingConfig = this.configurations.find(config => config.clientId === clientId);
    
    if (existingConfig) {
      this.configForm.patchValue({
        clientId: existingConfig.clientId,
        billingDay: existingConfig.billingDay,
        dueDays: existingConfig.dueDays,
        autoSuspend: existingConfig.autoSuspend,
        daysToSuspendAfterDue: existingConfig.daysToSuspendAfterDue,
        preferredPaymentMethod: existingConfig.preferredPaymentMethod
      });
    } else {
      this.configForm.patchValue({
        clientId: clientId,
        billingDay: 1,
        dueDays: 10,
        autoSuspend: true,
        daysToSuspendAfterDue: 5,
        preferredPaymentMethod: PaymentMethod.CASH
      });
    }
  }

  onSubmit(): void {
    if (this.configForm.valid) {
      this.loading = true;
      const formValue = this.configForm.value;
      
      const existingConfig = this.configurations.find(config => config.clientId === formValue.clientId);
      
      if (existingConfig) {
        this.billingConfigService.updateConfigurationByClientId(formValue.clientId, formValue).subscribe({
          next: () => {
            this.snackBar.open('Billing configuration updated successfully', 'Close', { duration: 3000 });
            this.loadAllConfigurations();
          },
          error: (error) => {
            console.error('Error updating billing configuration', error);
            this.snackBar.open('Error updating billing configuration', 'Close', { duration: 3000 });
            this.loading = false;
          }
        });
      } else {
        this.billingConfigService.createConfiguration(formValue).subscribe({
          next: () => {
            this.snackBar.open('Billing configuration created successfully', 'Close', { duration: 3000 });
            this.loadAllConfigurations();
          },
          error: (error) => {
            console.error('Error creating billing configuration', error);
            this.snackBar.open('Error creating billing configuration', 'Close', { duration: 3000 });
            this.loading = false;
          }
        });
      }
    } else {
      this.markFormGroupTouched(this.configForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  resetForm(): void {
    this.configForm.reset();
    this.selectedClientId = null;
  }
}