import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MikrotikService } from '../../../core/services/mikrotik.service';
import { MikrotikRouter } from '../../../shared/models/mikrotik-router.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-router-list',
  templateUrl: './router-list.component.html',
  styleUrls: ['./router-list.component.scss']
})
export class RouterListComponent implements OnInit {
  routers: MikrotikRouter[] = [];
  isLoading = true;
  displayedColumns: string[] = ['name', 'ipAddress', 'status', 'lastConnection', 'actions'];
  
  constructor(
    private mikrotikService: MikrotikService,
    private router: Router,
    private dialog: MatDialog
  ) { }
  
  ngOnInit(): void {
    this.loadRouters();
  }
  
  loadRouters(): void {
    this.isLoading = true;
    this.mikrotikService.getRouters().subscribe(
      routers => {
        this.routers = routers;
        this.isLoading = false;
      },
      error => {
        console.error('Error loading routers:', error);
        this.isLoading = false;
      }
    );
  }
  
  editRouter(id: number): void {
    this.router.navigate(['/admin/mikrotik/routers/edit', id]);
  }
  
  deleteRouter(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { 
        title: 'Confirmar eliminación', 
        message: '¿Está seguro que desea eliminar este router? Esta acción no se puede deshacer.' 
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.mikrotikService.deleteRouter(id).subscribe(
          () => {
            this.loadRouters();
          },
          error => {
            console.error('Error deleting router:', error);
          }
        );
      }
    });
  }
  
  testConnection(id: number): void {
    this.isLoading = true;
    this.mikrotikService.testConnection(id).subscribe(
      result => {
        const message = result ? 'Conexión exitosa' : 'Falló la conexión';
        const panelClass = result ? ['success-snackbar'] : ['error-snackbar'];
        
        // Aquí podrías mostrar un snackbar con el resultado
        // Por ahora solo recargamos la lista para ver el último estado
        this.loadRouters();
      },
      error => {
        console.error('Error testing connection:', error);
        this.isLoading = false;
      }
    );
  }
}