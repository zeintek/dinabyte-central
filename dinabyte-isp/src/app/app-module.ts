import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Modulos de Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';

// Componentes de la aplicación
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { MainLayoutComponent } from './shared/main-layout/main-layout.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ClientListComponent } from './admin/clients/client-list/client-list.component';
import { ClientFormComponent } from './admin/clients/client-form/client-form.component';
import { ClientDetailComponent } from './admin/clients/client-detail/client-detail.component';
import { PlanListComponent } from './admin/plans/plan-list/plan-list.component';
import { PlanFormComponent } from './admin/plans/plan-form/plan-form.component';
import { RouterListComponent } from './admin/mikrotik/router-list/router-list.component';
import { RouterFormComponent } from './admin/mikrotik/router-form/router-form.component';
import { ClientPortalComponent } from './client-portal/client-portal.component';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';

// Servicios e interceptores
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

// Módulos de gráficos
import { NgChartsModule } from 'ng2-charts';
import { BillingModule } from './admin/billing/billing.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainLayoutComponent,
    DashboardComponent,
    ClientListComponent,
    ClientFormComponent,
    ClientDetailComponent,
    PlanListComponent,
    PlanFormComponent,
    RouterListComponent,
    RouterFormComponent,
    ClientPortalComponent,
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatTabsModule,
    NgChartsModule,
    BillingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }