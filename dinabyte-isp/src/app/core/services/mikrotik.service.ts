import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MikrotikRouter } from '../../shared/models/mikrotik-router.model';

const API_URL = 'http://localhost:8080/api/mikrotik';

@Injectable({
  providedIn: 'root'
})
export class MikrotikService {
  
  constructor(private http: HttpClient) { }
  
  getRouters(): Observable<MikrotikRouter[]> {
    return this.http.get<MikrotikRouter[]>(`${API_URL}/routers`);
  }
  
  getRouter(id: number): Observable<MikrotikRouter> {
    return this.http.get<MikrotikRouter>(`${API_URL}/routers/${id}`);
  }
  
  createRouter(router: any): Observable<MikrotikRouter> {
    return this.http.post<MikrotikRouter>(`${API_URL}/routers`, router);
  }
  
  updateRouter(id: number, router: any): Observable<MikrotikRouter> {
    return this.http.put<MikrotikRouter>(`${API_URL}/routers/${id}`, router);
  }
  
  deleteRouter(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/routers/${id}`);
  }
  
  testConnection(id: number): Observable<{ connected: boolean }> {
    return this.http.get<{ connected: boolean }>(`${API_URL}/routers/${id}/test-connection`);
  }
  
  getSimpleQueues(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/routers/${id}/simple-queues`);
  }
  
  getPPPoEClients(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/routers/${id}/pppoe-clients`);
  }
}