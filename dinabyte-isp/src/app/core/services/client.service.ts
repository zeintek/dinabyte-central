import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../../shared/models/client.model';
import { map } from 'rxjs/operators';

const API_URL = 'http://localhost:8080/api/clients';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  
  constructor(private http: HttpClient) { }
  
  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(API_URL);
  }
  
  getClient(id: number): Observable<Client> {
    return this.http.get<Client>(`${API_URL}/${id}`);
  }
  
  createClient(client: any): Observable<Client> {
    return this.http.post<Client>(API_URL, client);
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