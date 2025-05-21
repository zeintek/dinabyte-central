// src/app/admin/billing/payment-list/payment-list.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogActions } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentService } from '../../../core/services/payment.service';
import { Payment, PaymentStatus } from '../../../shared/models/payment.model';
import { PaymentFormComponent } from '../payment-form/payment-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
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
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-payment-list',
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
      NgChartsModule // Agrega NgChartsModule para baseChart
    ],
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})
export class PaymentListComponent implements OnInit {
  public PaymentStatus = PaymentStatus; // Agrega esta línea
  dataSource = new MatTableDataSource<Payment>([]);
  displayedColumns: string[] = ['paymentDate', 'clientName', 'invoiceNumber', 'amount', 'paymentMethod', 'status', 'actions'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  loading = true;
  
  constructor(
    private paymentService: PaymentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadPayments();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadPayments(): void {
    this.loading = true;
    this.paymentService.getAllPayments().subscribe(
      (payments) => {
        this.dataSource.data = payments;
        this.loading = false;
      },
      (error) => {
        console.error('Error loading payments', error);
        this.snackBar.open('Error loading payments', 'Close', { duration: 3000 });
        this.loading = false;
      }
    );
  }

  addPayment(): void {
    const dialogRef = this.dialog.open(PaymentFormComponent, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPayments();
      }
    });
  }

  updatePaymentStatus(payment: Payment, newStatus: PaymentStatus): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Update Payment Status',
        message: `Are you sure you want to change the status to ${newStatus}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updatedPayment = {
          ...payment,
          status: newStatus
        };
        
        this.paymentService.updatePayment(payment.id!, updatedPayment).subscribe(
          () => {
            this.snackBar.open('Payment status updated successfully', 'Close', { duration: 3000 });
            this.loadPayments();
          },
          (error) => {
            console.error('Error updating payment status', error);
            this.snackBar.open('Error updating payment status', 'Close', { duration: 3000 });
          }
        );
      }
    });
  }

  deletePayment(payment: Payment): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete Payment',
        message: 'Are you sure you want to delete this payment? This action cannot be undone.'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.paymentService.deletePayment(payment.id!).subscribe(
          () => {
            this.snackBar.open('Payment deleted successfully', 'Close', { duration: 3000 });
            this.loadPayments();
          },
          (error) => {
            console.error('Error deleting payment', error);
            this.snackBar.open('Error deleting payment', 'Close', { duration: 3000 });
          }
        );
      }
    });
  }

  viewInvoice(invoiceId: number): void {
    if (invoiceId) {
      window.open(`/admin/billing/invoices/view/${invoiceId}`, '_blank');
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getStatusClass(status: PaymentStatus): string {
    switch (status) {
      case PaymentStatus.COMPLETED:
        return 'status-completed';
      case PaymentStatus.PENDING:
        return 'status-pending';
      case PaymentStatus.FAILED:
        return 'status-failed';
      case PaymentStatus.REFUNDED:
        return 'status-refunded';
      default:
        return '';
    }
  }
}