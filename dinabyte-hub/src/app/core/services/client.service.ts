import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../../shared/models/client.model';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

const API_URL = 'http://localhost:8080/api/clients';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  
  constructor(private http: HttpClient, private authService: AuthService) { }
  
  getClients(): Observable<Client[]> {
    const token = this.authService.getToken();
    console.log('Enviando solicitud con token:', token);
    if (!token) {
        console.error('No hay token disponible, redirigiendo al login');
        throw new Error('No hay token de autenticación');
    }
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    });
    return this.http.get<Client[]>(API_URL, { headers });
  }
  
  getClient(id: number): Observable<Client> {
    return this.http.get<Client>(`${API_URL}/${id}`);
  }
  
  createClient(client: any): Observable<Client> {
    const token = this.authService.getToken();
    console.log('Enviando solicitud con token:', token);
    if (!token) {
        console.error('No hay token disponible, redirigiendo al login');
        throw new Error('No hay token de autenticación');
    }
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    });
    return this.http.post<Client>(API_URL, client, { headers });
}
  
  updateClient(id: number, client: any): Observable<Client> {
    return this.http.put<Client>(`${API_URL}/${id}`, client);
  }
  
  deleteClient(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`);
  }
  
  suspendClient(id: number): Observable<Client> {
    return this.http.put<Client>(`${API_URL}/${id}/suspend`, {});
  }
  
  activateClient(id: number): Observable<Client> {
    return this.http.put<Client>(`${API_URL}/${id}/activate`, {});
  }
  
  getClientByUserId(userId: number): Observable<Client> {
    // Esta es una solución temporal para desarrollo
    // En un escenario real, deberías tener un endpoint específico para esto
    return this.getClients().pipe(
      map(clients => {
        const client = clients.find(c => c.user && c.user.id === userId);
        if (!client) {
          throw new Error('Cliente no encontrado');
        }
        return client;
      })
    );
  }
}