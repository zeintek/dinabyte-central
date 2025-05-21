import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MikrotikRouter } from '../../shared/models/mikrotik-router.model';
import { AuthService } from './auth.service';

const API_URL = 'http://localhost:8080/api/mikrotik';

@Injectable({
  providedIn: 'root'
})
export class MikrotikService {
  
  
  constructor(private http: HttpClient, private authService: AuthService) {}
  
  getRouters(): Observable<MikrotikRouter[]> {
    const token = this.authService.getToken();
    console.log('Enviando solicitud con token:', token);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<MikrotikRouter[]>(API_URL + '/routers', { headers });
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