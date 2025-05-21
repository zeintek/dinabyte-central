import { ServicePlan } from './service-plan.model';
import { MikrotikRouter } from './mikrotik-router.model';
import { User } from './user.model'; // Necesitarás crear esta interfaz si no existe

export interface Client {
  id: number;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  servicePlan: ServicePlan;
  router: MikrotikRouter;
  ipAddress: string;
  connectionType: string;
  status: string;
  user: User; // Añadido
  createdAt: string;
  lastPaymentDate?: string;
}