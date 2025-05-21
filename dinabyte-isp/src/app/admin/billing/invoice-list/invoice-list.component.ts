// src/app/admin/billing/invoice-list/invoice-list.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Invoice, InvoiceStatus } from '../../../shared/models/invoice.model';
import { InvoiceService } from '../../../core/services/invoice.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PaymentFormComponent } from '../payment-form/payment-form.component';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit {
  dataSource = new MatTableDataSource<Invoice>([]);
  displayedColumns: string[] = ['invoiceNumber', 'clientName', 'issueDate', 'dueDate', 'total', 'status', 'actions'];
  InvoiceStatus = InvoiceStatus;
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private invoiceService: InvoiceService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadInvoices(): void {
    this.loading = true;
    this.invoiceService.getAllInvoices().subscribe({
      next: (invoices) => {
        this.dataSource.data = invoices;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading invoices', error);
        this.loading = false;
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

  viewInvoice(invoice: Invoice): void {
    this.router.navigate(['/admin/billing/invoices', invoice.id]);
  }

  createPayment(invoice: Invoice): void {
    const dialogRef = this.dialog.open(PaymentFormComponent, {
      width: '500px',
      data: {
        clientId: invoice.clientId,
        clientName: invoice.clientName,
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        amount: invoice.total
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadInvoices();
      }
    });
  }

  cancelInvoice(invoice: Invoice): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Cancel Invoice',
        message: `Are you sure you want to cancel invoice ${invoice.invoiceNumber}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updatedInvoice = {
          ...invoice,
          status: InvoiceStatus.CANCELLED
        };
        this.invoiceService.updateInvoice(invoice.id!, updatedInvoice).subscribe({
          next: () => {
            this.loadInvoices();
          },
          error: (error) => {
            console.error('Error cancelling invoice', error);
          }
        });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}