import { UserRole, Phase, SubscriptionTier } from './index';

// Work Phase Management
export interface WorkPhase {
  id: string;
  name: string;
  description: string;
  order: number;
  isActive: boolean;
  dependsOnPhase?: string; // Phase ID that must complete before this one starts
  autoTriggerOnComplete: boolean; // Auto-add tasks when previous phase completes
  createdAt: Date;
  updatedAt: Date;
}

// Task Template with enhanced fields
export interface AdminTaskTemplate {
  id: string;
  taskId: string;
  title: string;
  description?: string;
  phaseId: string;
  owner: UserRole | 'system';
  approver?: UserRole;
  cadence: 'once' | 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'bi-monthly' | 'quarterly' | 'ongoing';
  autoCreateDay?: number; // Day of month/week for auto-creation (1-31 for monthly, 1-7 for weekly)
  isActive: boolean;
  order: number;
  tiers: SubscriptionTier[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Admin/Backoffice User Management
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: 'backoffice' | 'seo-team' | 'admin';
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

// Coupon/Discount Management
export interface DiscountCoupon {
  id: string;
  code: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number; // percentage (0-100) or fixed amount
  applicationType: 'one-time' | 'recurring' | 'both';
  validFrom: Date;
  validUntil?: Date;
  maxUses?: number;
  usedCount: number;
  applicableTiers: SubscriptionTier[];
  isActive: boolean;
  createdAt: Date;
}

// Refund Management
export interface Refund {
  id: string;
  clientId: string;
  subscriptionId: string;
  paymentId: string;
  type: 'full' | 'partial';
  originalAmount: number;
  refundAmount: number;
  reason: string;
  status: 'pending' | 'approved' | 'processed' | 'rejected';
  processedBy?: string;
  processedAt?: Date;
  createdAt: Date;
}

// Login Activity Tracking
export interface LoginActivity {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  ipAddress: string;
  sessionDuration?: number; // in minutes
  loginAt: Date;
  logoutAt?: Date;
  status: 'active' | 'expired' | 'logged_out';
}

// Email Blast
export interface EmailBlast {
  id: string;
  subject: string;
  body: string;
  recipientType: 'all-clients' | 'active-clients' | 'specific-tier';
  targetTier?: SubscriptionTier;
  sentBy: string;
  sentAt?: Date;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  recipientCount?: number;
  openCount?: number;
  createdAt: Date;
}

// Extended Subscription with trial & coupon support
export interface ExtendedSubscription {
  id: string;
  clientId: string;
  tier: SubscriptionTier;
  status: 'active' | 'cancelled' | 'pending' | 'expired' | 'trial';
  startDate: Date;
  endDate?: Date;
  trialEndDate?: Date;
  nextBillingDate?: Date;
  monthlyPrice: number;
  appliedCouponId?: string;
  discountAmount?: number;
  cancellationReason?: string;
  cancelledAt?: Date;
  cancelledBy?: string;
}

// Email Template Types (expanded)
export type EmailTriggerType = 
  | 'task_assigned' 
  | 'task_completed' 
  | 'subscription_reminder' 
  | 'welcome' 
  | 'new_user_credentials'
  | 'client_onboarding'
  | 'custom';

export interface AdminEmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  trigger: EmailTriggerType;
  category: 'task' | 'subscription' | 'user' | 'system';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Admin View Types
export type AdminView = 
  | 'dashboard'
  | 'clients'
  | 'subscriptions'
  | 'trials'
  | 'coupons'
  | 'refunds'
  | 'work-phases'
  | 'task-templates'
  | 'users'
  | 'email-templates'
  | 'email-blast'
  | 'login-activity'
  | 'security';

// Admin Menu Section
export interface AdminMenuSection {
  id: string;
  title: string;
  icon: string;
  items: {
    view: AdminView;
    label: string;
    badge?: number;
  }[];
}
