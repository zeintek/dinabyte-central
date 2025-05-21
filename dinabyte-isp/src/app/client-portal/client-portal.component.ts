import { Component, OnInit } from '@angular/core';
import { ClientService } from '../core/services/client.service';
import { AuthService } from '../core/services/auth.service';
import { Client } from '../shared/models/client.model';
import { MatButtonModule } from '@angular/material/button'; // Importa el módulo del botón
import { MatCardModule } from '@angular/material/card'; // Importa el módulo de la tarjeta
import { MatInputModule } from '@angular/material/input'; // Importa el módulo de input
import { MatFormFieldModule } from '@angular/material/form-field'; // Importa el módulo de form field
import { FormsModule } from '@angular/forms'; // Necesario para ngModel
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-client-portal',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,CommonModule, MatIconModule, MatProgressSpinnerModule
  ],
  templateUrl: './client-portal.component.html',
  styleUrls: ['./client-portal.component.scss']
})
export class ClientPortalComponent implements OnInit {
  client?: Client;
  isLoading = true;
  errorMessage = '';

  constructor(
    private clientService: ClientService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadClientData();
  }

  loadClientData(): void {
    // Obtenemos el usuario autenticado
    const user = this.authService.getUser();
    if (!user || !user.id) {
      this.errorMessage = 'No se pudo obtener la información del usuario';
      this.isLoading = false;
      return;
    }

    // Cargamos los datos del cliente (en una implementación real, 
    // tendríamos un endpoint específico para obtener el cliente del usuario actual)
    this.clientService.getClientByUserId(user.id).subscribe(
      client => {
        this.client = client;
        this.isLoading = false;
      },
      error => {
        console.error('Error loading client data:', error);
        this.errorMessage = 'Error al cargar los datos del cliente';
        this.isLoading = false;
      }
    );
  }
}