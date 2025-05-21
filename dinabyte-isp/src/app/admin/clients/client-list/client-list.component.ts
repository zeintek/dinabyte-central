import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../shared/models/client.model';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts'; // Importa ng2-charts para baseChart
@Component({
  selector: 'app-client-list',
  standalone: true,
    imports: [
      CommonModule,
      RouterModule,
      MatButtonModule,
      MatCardModule,
      MatFormFieldModule,
      MatInputModule,
      FormsModule,
      ReactiveFormsModule,
      MatIconModule,
      MatProgressSpinnerModule,
      MatTableModule,
      MatSlideToggleModule,
      MatSelectModule,
      NgChartsModule // Agrega NgChartsModule para baseChart
    ],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
  dataSource = new MatTableDataSource<Client>([]);
  displayedColumns: string[] = ['id', 'name', 'email', 'phone', 'plan', 'status', 'actions'];
  isLoading = true;
  
  constructor(
    private clientService: ClientService,
    private router: Router,
    private dialog: MatDialog
  ) { }
  
  ngOnInit(): void {
    this.loadClients();
  }
  
  loadClients(): void {
    this.isLoading = true;
    this.clientService.getClients().subscribe(
      (clients) => {
        this.dataSource.data = clients;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error cargando clientes:', error);
        this.isLoading = false;
      }
    );
  }
  
  editClient(id: number): void {
    this.router.navigate(['/admin/clients/edit', id]);
  }
  
  viewClient(id: number): void {
    this.router.navigate(['/admin/clients/view', id]);
  }
  
  deleteClient(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { 
        title: 'Confirmar eliminación', 
        message: '¿Está seguro que desea eliminar este cliente? Esta acción no se puede deshacer.' 
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clientService.deleteClient(id).subscribe(
          () => {
            this.loadClients();
          },
          (error) => {
            console.error('Error eliminando cliente:', error);
          }
        );
      }
    });
  }
  
  suspendClient(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { 
        title: 'Confirmar suspensión', 
        message: '¿Está seguro que desea suspender este cliente?' 
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clientService.suspendClient(id).subscribe(
          () => {
            this.loadClients();
          },
          (error) => {
            console.error('Error suspendiendo cliente:', error);
          }
        );
      }
    });
  }
  
  activateClient(id: number): void {
    this.clientService.activateClient(id).subscribe(
      () => {
        this.loadClients();
      },
      (error) => {
        console.error('Error activando cliente:', error);
      }
    );
  }
  
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}