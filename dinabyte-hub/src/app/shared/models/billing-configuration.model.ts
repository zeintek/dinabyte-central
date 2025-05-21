// src/app/shared/models/billing-configuration.model.ts
import { PaymentMethod } from './payment.model';

export interface BillingConfiguration {
  id?: number;
  clientId: number;
  clientName?: string;
  billingDay: number;
  dueDays: number;
  autoSuspend: boolean;
  daysToSuspendAfterDue: number;
  preferredPaymentMethod: PaymentMethod;
}