// src/app/core/services/invoice.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../../shared/models/invoice.model';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = `${environment.apiUrl}/invoices`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllInvoices(): Observable<Invoice[]> {
    const token = this.authService.getToken();
    console.log('Enviando solicitud con token:', token);
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
    return this.http.get<Invoice[]>(this.apiUrl, { headers });
  }
  
      

  getInvoiceById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/${id}`);
  }

  createInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(this.apiUrl, invoice);
  }

  updateInvoice(id: number, invoice: Invoice): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.apiUrl}/${id}`, invoice);
  }

  deleteInvoice(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getInvoicesByClient(clientId: number): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/client/${clientId}`);
  }

  getPendingInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/pending`);
  }

  getOverdueInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/overdue`);
  }

  generateInvoices(billingDay: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/generate/${billingDay}`, {});
  }
}