export type UserRole = 'admin' | 'us-strategy' | 'seo-head' | 'seo-junior' | 'client';

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'submitted' | 'approved' | 'resubmit';

export type Phase = 'onboarding' | 'foundation' | 'execution' | 'ai' | 'reporting' | 'monitoring' | string;

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  isActive?: boolean;
  phone?: string;
  lastLogin?: Date;
  isDefaultAssociate?: boolean;
}

export interface LoginHistory {
  id: string;
  userId: string;
  userName: string;
  ipAddress: string;
  sessionTime: string; // e.g. "1h 20m"
  loginTime: Date;
}

export interface Task {
  id: string;
  taskId: string; // e.g., ST-ONB-001
  title: string;
  description?: string;
  phase: Phase;
  owner: UserRole | 'system';
  assignedTo?: string;
  approver?: UserRole; // us-strategy or client
  status: TaskStatus;
  cadence?: 'once' | 'monthly' | 'weekly' | 'ongoing' | 'bi-weekly' | 'bi-monthly' | 'quarterly';
  comments: Comment[];
  documents: Document[];
  attachments?: Attachment[];
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  lastEditedBy?: {
    userId: string;
    userName: string;
    at: Date;
  };
  order?: number; // For task ordering within phase
  duration?: number; // Duration in days
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  content: string;
  attachments?: CommentAttachment[];
  createdAt: Date;
}

export interface CommentAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export type SubscriptionTier = 'starter' | 'growth' | 'enterprise';

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier; // Mapping to code tier
  price: number;
  billingCycle: 'monthly' | 'yearly' | 'one-time';
  isActive: boolean;
  isArchived: boolean;
  features?: string[];
}

export interface Discount {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  appliesTo: 'one-time' | 'recurring';
  maxUses?: number;
  usedCount: number;
  isActive: boolean;
  recurringDuration?: number; // Number of billing cycles
  validUpto?: Date;
}

export interface BillingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  address?: string;
  billingAddress?: BillingAddress;
  avatar?: string;
  createdAt: Date;
  isActive: boolean;
  website?: string;
  industry?: string;
  associatedTeam?: {
    usStrategyId?: string;
    seoHeadId?: string;
    seoJuniorId?: string;
  };
}

export interface Subscription {
  id: string;
  clientId: string;
  tier: SubscriptionTier;
  status: 'active' | 'cancelled' | 'pending' | 'expired' | 'paused' | 'trial';
  startDate: Date;
  endDate?: Date;
  nextBillingDate?: Date;
  monthlyPrice: number;
  trialEndDate?: Date;
  billingCycle?: 'monthly' | 'yearly' | 'one-time';
}

export interface PaymentHistory {
  id: string;
  clientId: string;
  subscriptionId: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed' | 'refunded' | 'partially-refunded';
  paymentDate: Date;
  paymentMethod: string;
  invoiceNumber: string;
  refundAmount?: number;
  transactionId?: string;
}

export interface PhaseConfig {
  id: string;
  name: string; // readable name
  slug: Phase; // matching the Phase type
  description?: string;
  order: number;
  predecessor?: Phase;
  successor?: Phase;
  isActive: boolean;
}

export interface TaskTemplate {
  id: string;
  taskId: string;
  title: string;
  description?: string;
  phase: Phase;
  owner: UserRole | 'system';
  cadence?: 'once' | 'monthly' | 'weekly' | 'ongoing' | 'bi-weekly' | 'bi-monthly' | 'quarterly';
  isActive: boolean;
  order: number;
  tiers: SubscriptionTier[]; // Which subscription tiers include this task
  notes?: string; // Additional notes about the task
  duration?: number; // Duration in days
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  trigger: 'task_assigned' | 'task_completed' | 'subscription_reminder' | 'welcome' | 'custom' | 'new_user' | 'backend_user_added';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface KPIData {
  localPackVisibility: number;
  gbpViews: number;
  aiMentionScore: number;
  tasksCompleted: number;
  totalTasks: number;
}

export const SUBSCRIPTION_TIER_LABELS: Record<SubscriptionTier, string> = {
  'starter': 'Starter',
  'growth': 'Growth',
  'enterprise': 'Enterprise'
};

export const SUBSCRIPTION_TIER_PRICES: Record<SubscriptionTier, number> = {
  'starter': 299,
  'growth': 599,
  'enterprise': 999
};

export const ROLE_LABELS: Record<UserRole, string> = {
  'admin': 'Portal Admin',
  'us-strategy': 'US Strategy',
  'seo-head': 'SEO Head',
  'seo-junior': 'SEO Junior',
  'client': 'Client'
};

export const PHASE_LABELS: Record<string, string> = {
  'onboarding': 'Onboarding & Intake',
  'foundation': 'Foundation Setup',
  'execution': 'Monthly Execution',
  'ai': 'AI / AEO Optimization',
  'reporting': 'Reporting & Strategy',
  'monitoring': 'Failure Monitoring'
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  'pending': 'Pending',
  'in-progress': 'In Progress',
  'completed': 'Completed',
  'submitted': 'Awaiting for Review',
  'approved': 'Approved',
  'resubmit': 'Needs Revision'
};
