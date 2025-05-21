// src/app/core/services/billing-configuration.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BillingConfiguration } from '../../shared/models/billing-configuration.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillingConfigurationService {
  private apiUrl = `${environment.apiUrl}/billing-configurations`;

  constructor(private http: HttpClient) { }

  getAllConfigurations(): Observable<BillingConfiguration[]> {
    return this.http.get<BillingConfiguration[]>(this.apiUrl);
  }

  getConfigurationById(id: number): Observable<BillingConfiguration> {
    return this.http.get<BillingConfiguration>(`${this.apiUrl}/${id}`);
  }

  getConfigurationByClientId(clientId: number): Observable<BillingConfiguration> {
    return this.http.get<BillingConfiguration>(`${this.apiUrl}/client/${clientId}`);
  }

  createConfiguration(configuration: BillingConfiguration): Observable<BillingConfiguration> {
    return this.http.post<BillingConfiguration>(this.apiUrl, configuration);
  }

  updateConfiguration(id: number, configuration: BillingConfiguration): Observable<BillingConfiguration> {
    return this.http.put<BillingConfiguration>(`${this.apiUrl}/${id}`, configuration);
  }

  updateConfigurationByClientId(clientId: number, configuration: BillingConfiguration): Observable<BillingConfiguration> {
    return this.http.put<BillingConfiguration>(`${this.apiUrl}/client/${clientId}`, configuration);
  }
}