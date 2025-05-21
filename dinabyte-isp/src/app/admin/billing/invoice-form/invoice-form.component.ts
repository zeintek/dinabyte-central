// src/app/admin/billing/invoice-form/invoice-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InvoiceService } from '../../../core/services/invoice.service';
import { ClientService } from '../../../core/services/client.service';
import { PlanService } from '../../../core/services/plan.service';
import { Client } from '../../../shared/models/client.model';
import { ServicePlan } from '../../../shared/models/service-plan.model';
import { Invoice, InvoiceStatus } from '../../../shared/models/invoice.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';

// Definir la estructura del FormGroup para los ítems
interface ItemFormGroup {
  id?: number;
  description: string;
  quantity: number;
  unitPrice: number;
  servicePlanId?: number | null;
  periodStart?: Date | null;
  periodEnd?: Date | null;
}

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    MatSnackBarModule,
  ],
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss']
})
export class InvoiceFormComponent implements OnInit {
  invoiceForm: FormGroup;
  clients: Client[] = [];
  servicePlans: ServicePlan[] = [];
  isEditMode = false;
  invoiceId: number | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private invoiceService: InvoiceService,
    private clientService: ClientService,
    private servicePlanService: PlanService,
    private snackBar: MatSnackBar
  ) {
    this.invoiceForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadClients();
    this.loadServicePlans();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.invoiceId = +params['id'];
        this.isEditMode = true;
        this.loadInvoice(this.invoiceId);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      clientId: ['', Validators.required],
      issueDate: [new Date(), Validators.required],
      dueDate: ['', Validators.required],
      items: this.fb.array<FormGroup>([this.createItemFormGroup()])
    });
  }

  createItemFormGroup(): FormGroup {
    return this.fb.group({
      id: [null],
      description: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(0.01)]],
      unitPrice: [0, [Validators.required, Validators.min(0.01)]],
      servicePlanId: [null],
      periodStart: [null],
      periodEnd: [null]
    });
  }

  get itemsFormArray(): FormArray<FormGroup> {
    return this.invoiceForm.get('items') as FormArray<FormGroup>;
  }

  addItem(): void {
    this.itemsFormArray.push(this.createItemFormGroup());
  }

  removeItem(index: number): void {
    if (this.itemsFormArray.length > 1) {
      this.itemsFormArray.removeAt(index);
    }
  }

  calculateItemTotal(item: AbstractControl): number {
    const formGroup = item as FormGroup;
    const quantity = formGroup.get('quantity')?.value || 0;
    const unitPrice = formGroup.get('unitPrice')?.value || 0;
    return quantity * unitPrice;
  }

  calculateSubtotal(): number {
    return this.itemsFormArray.controls.reduce((sum, item) => sum + this.calculateItemTotal(item), 0);
  }

  calculateTax(): number {
    return this.calculateSubtotal() * 0.16; // 16% IVA
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.calculateTax();
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

  loadServicePlans(): void {
    this.servicePlanService.getPlans().subscribe({
      next: (plans) => {
        this.servicePlans = plans;
      },
      error: (error) => {
        console.error('Error loading service plans', error);
        this.snackBar.open('Error loading service plans', 'Close', { duration: 3000 });
      }
    });
  }

  loadInvoice(id: number): void {
    this.loading = true;
    this.invoiceService.getInvoiceById(id).subscribe({
      next: (invoice) => {
        this.patchFormWithInvoice(invoice);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading invoice', error);
        this.snackBar.open('Error loading invoice', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  patchFormWithInvoice(invoice: Invoice): void {
    if (invoice.status !== InvoiceStatus.PENDING && invoice.status !== InvoiceStatus.DRAFT) {
      this.invoiceForm.disable();
      this.snackBar.open('This invoice cannot be edited due to its status', 'Close', { duration: 5000 });
    }

    const itemsFormArray = this.fb.array<FormGroup>([]);
    if (invoice.items && invoice.items.length > 0) {
      invoice.items.forEach(item => {
        const itemGroup = this.fb.group({
          id: [item.id],
          description: [item.description, Validators.required],
          quantity: [item.quantity, [Validators.required, Validators.min(0.01)]],
          unitPrice: [item.unitPrice, [Validators.required, Validators.min(0.01)]],
          servicePlanId: [item.servicePlanId],
          periodStart: [item.periodStart ? new Date(item.periodStart) : null],
          periodEnd: [item.periodEnd ? new Date(item.periodEnd) : null]
        });
        itemsFormArray.push(itemGroup);
      });
    } else {
      itemsFormArray.push(this.createItemFormGroup());
    }

    this.invoiceForm.setControl('items', itemsFormArray);

    this.invoiceForm.patchValue({
      clientId: invoice.clientId,
      issueDate: new Date(invoice.issueDate),
      dueDate: new Date(invoice.dueDate)
    });
  }

  onServicePlanChange(index: number, event: any): void {
    const planId = event.value;
    if (planId) {
      const plan = this.servicePlans.find(p => p.id === planId);
      if (plan) {
        const itemGroup = this.itemsFormArray.at(index);
        itemGroup.patchValue({
          description: `Internet Service - ${plan.name}`,
          unitPrice: plan.price
        });

        if (!itemGroup.get('periodStart')?.value) {
          const today = new Date();
          const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

          itemGroup.patchValue({
            periodStart: firstDayOfMonth,
            periodEnd: lastDayOfMonth
          });
        }
      }
    }
  }

  onSubmit(): void {
    if (this.invoiceForm.valid) {
      this.loading = true;

      const formValue = this.invoiceForm.value;

      const invoice: any = {
        ...formValue,
        issueDate: formValue.issueDate.toISOString().split('T')[0],
        dueDate: formValue.dueDate.toISOString().split('T')[0],
        items: formValue.items.map((item: any) => ({
          ...item,
          periodStart: item.periodStart ? item.periodStart.toISOString().split('T')[0] : null,
          periodEnd: item.periodEnd ? item.periodEnd.toISOString().split('T')[0] : null,
          total: item.quantity * item.unitPrice
        }))
      };

      if (this.isEditMode && this.invoiceId) {
        this.invoiceService.updateInvoice(this.invoiceId, invoice).subscribe({
          next: () => {
            this.snackBar.open('Invoice updated successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/admin/billing/invoices']);
            this.loading = false;
          },
          error: (error) => {
            console.error('Error updating invoice', error);
            this.snackBar.open('Error updating invoice', 'Close', { duration: 3000 });
            this.loading = false;
          }
        });
      } else {
        this.invoiceService.createInvoice(invoice).subscribe({
          next: () => {
            this.snackBar.open('Invoice created successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/admin/billing/invoices']);
            this.loading = false;
          },
          error: (error) => {
            console.error('Error creating invoice', error);
            this.snackBar.open('Error creating invoice', 'Close', { duration: 3000 });
            this.loading = false;
          }
        });
      }
    } else {
      this.markFormGroupTouched(this.invoiceForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key) as AbstractControl;
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach((arrayControl: AbstractControl) => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched(arrayControl);
          } else {
            arrayControl.markAsTouched();
          }
        });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/billing/invoices']);
  }
}