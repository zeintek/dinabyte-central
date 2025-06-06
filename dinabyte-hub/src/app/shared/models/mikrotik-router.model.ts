export interface MikrotikRouter {
    id: number;
    name: string;
    description?: string;
    ipAddress: string;
    apiPort?: number;
    username: string; // Añadido
    status: 'ACTIVE' | 'INACTIVE';
    location?: string;
    latitude?: number;
    longitude?: number;
    lastConnectionAt?: string;
    createdAt?: string;
    updatedAt?: string;
  }