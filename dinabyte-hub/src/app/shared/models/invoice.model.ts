// src/app/shared/models/invoice.model.ts
export interface Invoice {
    id?: number;
    invoiceNumber: string;
    clientId: number;
    clientName: string;
    issueDate: string;
    dueDate: string;
    items: InvoiceItem[];
    subtotal: number;
    taxAmount: number;
    total: number;
    status: InvoiceStatus;
  }
  
  export interface InvoiceItem {
    id?: number;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
    servicePlanId?: number;
    servicePlanName?: string;
    periodStart?: string;
    periodEnd?: string;
  }
  
  export enum InvoiceStatus {
    DRAFT = 'DRAFT',
    PENDING = 'PENDING',
    PAID = 'PAID',
    OVERDUE = 'OVERDUE',
    CANCELLED = 'CANCELLED'
  }