import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ClientListComponent } from './admin/clients/client-list/client-list.component';
import { ClientFormComponent } from './admin/clients/client-form/client-form.component';
import { ClientDetailComponent } from './admin/clients/client-detail/client-detail.component';
import { PlanListComponent } from './admin/plans/plan-list/plan-list.component';
import { PlanFormComponent } from './admin/plans/plan-form/plan-form.component';
import { RouterListComponent } from './admin/mikrotik/router-list/router-list.component';
import { RouterFormComponent } from './admin/mikrotik/router-form/router-form.component';
import { ClientPortalComponent } from './client-portal/client-portal.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { InvoiceListComponent } from './admin/billing/invoice-list/invoice-list.component';
import { InvoiceFormComponent } from './admin/billing/invoice-form/invoice-form.component';
import { InvoiceDetailComponent } from './admin/billing/invoice-detail/invoice-detail.component';
import { PaymentListComponent } from './admin/billing/payment-list/payment-list.component';
import { BillingConfigurationComponent } from './admin/billing/billing-configuration/billing-configuration.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { 
      path: 'admin', 
      canActivate: [AuthGuard, RoleGuard], 
      data: { roles: ['ROLE_ADMIN'] },
      children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', component: DashboardComponent },
        { path: 'clients', component: ClientListComponent },
        { path: 'clients/new', component: ClientFormComponent },
        { path: 'clients/edit/:id', component: ClientFormComponent },
        { path: 'clients/view/:id', component: ClientDetailComponent },
        { path: 'service-plans', component: PlanListComponent },
        { path: 'service-plans/new', component: PlanFormComponent },
        { path: 'service-plans/edit/:id', component: PlanFormComponent },
        { path: 'mikrotik/routers', component: RouterListComponent },
        { path: 'mikrotik/routers/new', component: RouterFormComponent },
        { path: 'mikrotik/routers/edit/:id', component: RouterFormComponent },
        // Nuevas rutas del sistema de facturación
        { path: 'billing/invoices', component: InvoiceListComponent },
        { path: 'billing/invoices/new', component: InvoiceFormComponent },
        { path: 'billing/invoices/edit/:id', component: InvoiceFormComponent },
        { path: 'billing/invoices/view/:id', component: InvoiceDetailComponent },
        { path: 'billing/payments', component: PaymentListComponent },
        { path: 'billing/configuration', component: BillingConfigurationComponent }
        
      ]
    },
    { 
      path: 'client', 
      canActivate: [AuthGuard, RoleGuard],
      data: { roles: ['ROLE_CLIENT'] },
      component: ClientPortalComponent 
    },
    { path: '**', redirectTo: '/login' }
  ];
