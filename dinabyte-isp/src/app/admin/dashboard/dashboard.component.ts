import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../core/services/invoice.service';
import { ClientService } from '../../core/services/client.service';
import { InvoiceStatus } from '../../shared/models/invoice.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { NgChartsModule } from 'ng2-charts';

import {
  ChartData
} from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    NgChartsModule
  ],
  providers: [CurrencyPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalClients = 0;
  activeClients = 0;
  totalInvoices = 0;
  pendingInvoices = 0;
  totalRevenue = 0;
  loading = true;

  invoiceChartData: ChartData<'doughnut', number[], string> = {
    labels: [],
    datasets: []
  };

  invoiceChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  revenueChartData: ChartData<'line', (number | null)[], string> = {
    labels: [],
    datasets: []
  };

  revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  invoiceChartLabels = ['Pagadas', 'Pendientes', 'Vencidas', 'Canceladas'];
  revenueChartLabels: string[] = [];

  constructor(
    private invoiceService: InvoiceService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    this.clientService.getClients().subscribe(clients => {
      this.totalClients = clients.length;
      this.activeClients = clients.filter(c => c.status === 'ACTIVE').length;
    });

    this.invoiceService.getAllInvoices().subscribe(invoices => {
      this.totalInvoices = invoices.length;
      this.pendingInvoices = invoices.filter(i => i.status === InvoiceStatus.PENDING).length;

      this.totalRevenue = invoices
        .filter(i => i.status === InvoiceStatus.PAID)
        .reduce((sum, invoice) => sum + invoice.total, 0);

      const paidCount = invoices.filter(i => i.status === InvoiceStatus.PAID).length;
      const pendingCount = invoices.filter(i => i.status === InvoiceStatus.PENDING).length;
      const overdueCount = invoices.filter(i => i.status === InvoiceStatus.OVERDUE).length;
      const cancelledCount = invoices.filter(i => i.status === InvoiceStatus.CANCELLED).length;

      this.invoiceChartData = {
        labels: this.invoiceChartLabels,
        datasets: [{
          data: [paidCount, pendingCount, overdueCount, cancelledCount],
          label: 'Facturas por Estado',
          backgroundColor: ['#4CAF50', '#FFC107', '#F44336', '#9E9E9E']
        }]
      };

      const revenueByMonth = new Map<string, number>();

      invoices
        .filter(i => i.status === InvoiceStatus.PAID)
        .forEach(invoice => {
          const date = new Date(invoice.issueDate);
          const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

          if (revenueByMonth.has(monthYear)) {
            revenueByMonth.set(monthYear, revenueByMonth.get(monthYear)! + invoice.total);
          } else {
            revenueByMonth.set(monthYear, invoice.total);
          }
        });

      this.revenueChartLabels = Array.from(revenueByMonth.keys());
      this.revenueChartData = {
        labels: this.revenueChartLabels,
        datasets: [{
          data: Array.from(revenueByMonth.values()),
          label: 'Ingresos Mensuales',
          borderColor: '#3F51B5',
          backgroundColor: 'rgba(63, 81, 181, 0.2)',
          fill: true,
          tension: 0.4
        }]
      };

      this.loading = false;
    });
  }
}
