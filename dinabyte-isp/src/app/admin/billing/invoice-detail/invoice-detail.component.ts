// src/app/admin/billing/invoice-detail/invoice-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { InvoiceService } from '../../../core/services/invoice.service';
import { PaymentService } from '../../../core/services/payment.service';
import { Invoice, InvoiceStatus } from '../../../shared/models/invoice.model';
import { Payment } from '../../../shared/models/payment.model';
import { PaymentFormComponent } from '../payment-form/payment-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss']
})
export class InvoiceDetailComponent implements OnInit {
  invoice: Invoice | null = null;
  payments: Payment[] = [];
  loading = true;
  
  InvoiceStatus = InvoiceStatus;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private invoiceService: InvoiceService,
    private paymentService: PaymentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        const invoiceId = +params['id'];
        this.loadInvoice(invoiceId);
        this.loadPayments(invoiceId);
      } else {
        this.router.navigate(['/admin/billing/invoices']);
      }
    });
  }

  loadInvoice(id: number): void {
    this.loading = true;
    this.invoiceService.getInvoiceById(id).subscribe({
      next: (invoice) => {
        this.invoice = invoice;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading invoice', error);
        this.snackBar.open('Error loading invoice', 'Close', { duration: 3000 });
        this.loading = false;
        this.router.navigate(['/admin/billing/invoices']);
      }
    });
  }

  loadPayments(invoiceId: number): void {
    this.paymentService.getPaymentsByInvoice(invoiceId).subscribe({
      next: (payments) => {
        this.payments = payments;
      },
      error: (error) => {
        console.error('Error loading payments', error);
      }
    });
  }

  getStatusClass(status: InvoiceStatus): string {
    switch (status) {
      case InvoiceStatus.PAID:
        return 'status-paid';
      case InvoiceStatus.PENDING:
        return 'status-pending';
      case InvoiceStatus.OVERDUE:
        return 'status-overdue';
      case InvoiceStatus.CANCELLED:
        return 'status-cancelled';
      default:
        return '';
    }
  }

  createPayment(): void {
    if (!this.invoice) return;
    
    const dialogRef = this.dialog.open(PaymentFormComponent, {
      width: '500px',
      data: {
        clientId: this.invoice.clientId,
        clientName: this.invoice.clientName,
        invoiceId: this.invoice.id,
        invoiceNumber: this.invoice.invoiceNumber,
        amount: this.invoice.total
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.invoice?.id) {
        this.loadInvoice(this.invoice.id);
        this.loadPayments(this.invoice.id);
      }
    });
  }

  editInvoice(): void {
    if (!this.invoice?.id) return;
    this.router.navigate(['/admin/billing/invoices/edit', this.invoice.id]);
  }

  cancelInvoice(): void {
    if (!this.invoice?.id) return;
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Cancel Invoice',
        message: `Are you sure you want to cancel invoice ${this.invoice.invoiceNumber}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.invoice?.id) {
        const updatedInvoice = {
          ...this.invoice,
          status: InvoiceStatus.CANCELLED
        };
        this.invoiceService.updateInvoice(this.invoice.id, updatedInvoice).subscribe({
          next: () => {
            this.snackBar.open('Invoice cancelled successfully', 'Close', { duration: 3000 });
            this.loadInvoice(this.invoice!.id!);
          },
          error: (error) => {
            console.error('Error cancelling invoice', error);
            this.snackBar.open('Error cancelling invoice', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  printInvoice(): void {
    window.print();
  }

  backToList(): void {
    this.router.navigate(['/admin/billing/invoices']);
  }
}