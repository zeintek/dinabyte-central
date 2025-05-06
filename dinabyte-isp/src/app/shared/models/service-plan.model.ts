export interface ServicePlan {
    id: number;
    name: string;
    description?: string;
    price: number;
    downloadSpeed: string;
    uploadSpeed: string;
    dataCapGB?: number;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
  }