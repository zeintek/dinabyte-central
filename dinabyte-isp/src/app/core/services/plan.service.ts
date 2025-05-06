import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServicePlan } from '../../shared/models/service-plan.model';

const API_URL = 'http://localhost:8080/api/service-plans';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  
  constructor(private http: HttpClient) { }
  
  getPlans(): Observable<ServicePlan[]> {
    return this.http.get<ServicePlan[]>(API_URL);
  }
  
  getPlan(id: number): Observable<ServicePlan> {
    return this.http.get<ServicePlan>(`${API_URL}/${id}`);
  }
  
  createPlan(plan: any): Observable<ServicePlan> {
    return this.http.post<ServicePlan>(API_URL, plan);
  }
  
  updatePlan(id: number, plan: any): Observable<ServicePlan> {
    return this.http.put<ServicePlan>(`${API_URL}/${id}`, plan);
  }
  
  deletePlan(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`);
  }
}