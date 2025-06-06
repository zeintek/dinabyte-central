import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { LoggedInGuard } from './core/guards/logged-in.guard';

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard', // Redirige a /dashboard
    pathMatch: 'full'
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard], // Proteger rutas de admin
    children: [
      {
        path: 'dashboard',
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_ADMIN'] },
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(x => x.DashboardModule)
      },
      {
        path: 'components',
        loadChildren: () => import('./pages/components/components.module').then(x => x.ComponentsPageModule)
      },
      {
        path: 'forms',
        loadChildren: () => import('./pages/forms/forms.module').then(x => x.Forms)
      },
      {
        path: 'tables',
        loadChildren: () => import('./pages/tables/tables.module').then(x => x.TablesModule)
      },
      {
        path: 'maps',
        loadChildren: () => import('./pages/maps/maps.module').then(x => x.MapsModule)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./pages/widgets/widgets.module').then(x => x.WidgetsModule)
      },
      {
        path: 'charts',
        loadChildren: () => import('./pages/charts/charts.module').then(x => x.ChartsModule)
      },
      {
        path: 'calendar',
        loadChildren: () => import('./pages/calendar/calendar.module').then(x => x.CalendarModulee)
      },
      {
        path: '',
        loadChildren: () => import('./pages/pages/user-profile/user-profile.module').then(x => x.UserModule)
      },
      {
        path: '',
        loadChildren: () => import('./pages/pages/timeline/timeline.module').then(x => x.TimelineModule)
      },
      {
        path: 'client',
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_CLIENT'] },
        loadChildren: () => import('./pages/pages/user-profile/user-profile.module').then(x => x.UserModule)
      }
    ]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/pages/pages.module').then(x => x.PagesModule),
        canActivate: [LoggedInGuard]
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard' // Redirige a /dashboard
  }
];