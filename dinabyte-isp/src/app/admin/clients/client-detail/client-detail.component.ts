import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../shared/models/client.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.scss']
})
export class ClientDetailComponent implements OnInit {
  client?: Client;
  isLoading = true;
  errorMessage = '';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    private dialog: MatDialog
  ) { }
  
  ngOnInit(): void {
    this.loadClientData();
  }
  
  loadClientData(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.errorMessage = 'ID de cliente inválido';
      this.isLoading = false;
      return;
    }
    
    this.clientService.getClient(id).subscribe(
      client => {
        this.client = client;
        this.isLoading = false;
      },
      error => {
        console.error('Error loading client:', error);
        this.errorMessage = 'Error al cargar los datos del cliente';
        this.isLoading = false;
      }
    );
  }
  
  editClient(): void {
    if (this.client) {
      this.router.navigate(['/admin/clients/edit', this.client.id]);
    }
  }
  
  deleteClient(): void {
    if (!this.client) return;
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { 
        title: 'Confirmar eliminación', 
        message: '¿Está seguro que desea eliminar este cliente? Esta acción no se puede deshacer.' 
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result && this.client) {
        this.clientService.deleteClient(this.client.id).subscribe(
          () => {
            this.router.navigate(['/admin/clients']);
          },
          error => {
            console.error('Error deleting client:', error);
            this.errorMessage = 'Error al eliminar el cliente';
          }
        );
      }
    });
  }
  
  suspendClient(): void {
    if (!this.client) return;
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { 
        title: 'Confirmar suspensión', 
        message: '¿Está seguro que desea suspender este cliente?' 
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result && this.client) {
        this.clientService.suspendClient(this.client.id).subscribe(
          updatedClient => {
            this.client = updatedClient;
          },
          error => {
            console.error('Error suspending client:', error);
            this.errorMessage = 'Error al suspender el cliente';
          }
        );
      }
    });
  }
  
  activateClient(): void {
    if (!this.client) return;
    
    this.clientService.activateClient(this.client.id).subscribe(
      updatedClient => {
        this.client = updatedClient;
      },
      error => {
        console.error('Error activating client:', error);
        this.errorMessage = 'Error al activar el cliente';
      }
    );
  }
  
  goBack(): void {
    this.router.navigate(['/admin/clients']);
  }
}