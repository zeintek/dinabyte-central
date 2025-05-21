// src/app/shared/main-layout/sidebar/sidebar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class SidebarComponent {
  menuItems = [
    {
      icon: 'dashboard',
      title: 'Dashboard',
      route: '/admin/dashboard',
      expanded: false
    },
    {
      icon: 'people',
      title: 'Clientes',
      expanded: false,
      children: [
        { title: 'Lista Clientes', route: '/admin/clients' },
        { title: 'Buscar Clientes', route: '/admin/clients/search' },
        { title: 'Instalaciones', route: '/admin/clients/installations' },
        { title: 'Avisos en Pantalla', route: '/admin/clients/notices' },
        { title: 'Trafico', route: '/admin/clients/traffic' },
        { title: 'Mapa de Clientes', route: '/admin/clients/map' },
        { title: 'Estadísticas', route: '/admin/clients/stats' },
        { title: 'Notificaciones Push', route: '/admin/clients/push' },
        { title: 'Servicios Adicionales', route: '/admin/clients/services' }
      ]
    },
    {
      icon: 'attach_money',
      title: 'Finanzas',
      expanded: false,
      children: [
        { title: 'Dashboard', route: '/admin/billing/dashboard' },
        { title: 'Pagos pendientes', route: '/admin/billing/pending-payments' },
        { title: 'Facturas', route: '/admin/billing/invoices' },
        { title: 'Reporte de Pagos', route: '/admin/billing/payment-reports' },
        { title: 'Buscar Facturas', route: '/admin/billing/search-invoices' },
        { title: 'Promesas de Pago', route: '/admin/billing/payment-promises' },
        { title: 'Otros Ingresos', route: '/admin/billing/other-income' },
        { title: 'Gastos', route: '/admin/billing/expenses' },
        { title: 'Estadísticas', route: '/admin/billing/stats' },
        { title: 'Tarjetas Cobranza', route: '/admin/billing/payment-cards' },
        { title: 'Contabilidad', route: '/admin/billing/accounting' },
        { title: 'Formas de Pagos', route: '/admin/billing/payment-methods' },
        { title: 'Suscripciones Pasarelas', route: '/admin/billing/payment-gateways' },
        { title: 'Facturas Electrónicas', route: '/admin/billing/electronic-invoices' },
        { title: 'Registrar Pagos desde Excel', route: '/admin/billing/register-excel-payments' }
      ]
    },
    {
      icon: 'settings',
      title: 'Sistema',
      expanded: false,
      children: [
        { title: 'Router', route: '/admin/system/routers' },
        { title: 'Plan de Internet', route: '/admin/system/internet-plans' },
        { title: 'Plan de Telefonía y Televisión', route: '/admin/system/phone-tv-plans' },
        { title: 'Zonas', route: '/admin/system/zones' },
        { title: 'Sectorial/Nodo/NAP', route: '/admin/system/nodes' },
        { title: 'Tareas Periódicas', route: '/admin/system/periodic-tasks' },
        { title: 'Plantillas', route: '/admin/system/templates' },
        { title: 'Acceso remoto VPN', route: '/admin/system/vpn' },
        { title: 'AdminOLT', route: '/admin/system/admin-olt' },
        { title: 'Subdominios', route: '/admin/system/subdomains' },
        { title: 'DirectorioISP', route: '/admin/system/directory-isp', badge: 'New' }
      ]
    }
  ];

  toggleExpand(item: any): void {
    item.expanded = !item.expanded;
  }
}