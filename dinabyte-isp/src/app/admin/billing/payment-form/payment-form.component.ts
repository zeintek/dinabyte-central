// src/app/admin/billing/payment-form/payment-form.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { PaymentService } from '../../../core/services/payment.service';
import { Payment, PaymentMethod, PaymentStatus } from '../../../shared/models/payment.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenu } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog, MatDialogActions } from '@angular/material/dialog';
import { MatDatepicker, MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';

@Component({
  selector: 'app-payment-form',
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
        MatPaginatorModule,
        MatMenu,
        MatDialogActions,
        MatMenuTrigger,
        MatDatepicker,
        MatDatepickerToggle,
        MatDialogContent,
        MatDatepickerModule,
        NgChartsModule // Agrega NgChartsModule para baseChart
      ],
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss']
})
export class PaymentFormComponent implements OnInit {
  paymentForm: FormGroup;
  paymentMethods = Object.values(PaymentMethod);
  
  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    public dialogRef: MatDialogRef<PaymentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.paymentForm = this.fb.group({
      clientId: [data.clientId, Validators.required],
      invoiceId: [data.invoiceId],
      amount: [data.amount, [Validators.required, Validators.min(0.01)]],
      paymentDate: [new Date(), Validators.required],
      paymentMethod: [PaymentMethod.CASH, Validators.required],
      transactionReference: [''],
      status: [PaymentStatus.COMPLETED]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      const payment: Payment = {
        ...this.paymentForm.value,
        clientName: this.data.clientName,
        invoiceNumber: this.data.invoiceNumber,
        paymentDate: this.paymentForm.value.paymentDate.toISOString()
      };
      
      this.paymentService.createPayment(payment).subscribe(
        (result) => {
          this.dialogRef.close(result);
        },
        (error) => {
          console.error('Error creating payment', error);
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}