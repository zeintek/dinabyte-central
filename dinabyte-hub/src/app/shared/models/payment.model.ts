// src/app/shared/models/payment.model.ts
export interface Payment {
    id?: number;
    clientId: number;
    clientName: string;
    invoiceId?: number;
    invoiceNumber?: string;
    amount: number;
    paymentDate: string;
    paymentMethod: PaymentMethod;
    transactionReference?: string;
    status: PaymentStatus;
  }
  
  export enum PaymentMethod {
    CASH = 'CASH',
    BANK_TRANSFER = 'BANK_TRANSFER',
    CREDIT_CARD = 'CREDIT_CARD',
    PAYPAL = 'PAYPAL',
    MERCADO_PAGO = 'MERCADO_PAGO',
    OTHER = 'OTHER'
  }
  
  export enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED'
  }