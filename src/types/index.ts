export type UserRole = 'admin' | 'us-strategy' | 'india-head' | 'india-junior' | 'client';

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'submitted' | 'approved' | 'resubmit';

export type Phase = 'onboarding' | 'foundation' | 'execution' | 'ai' | 'reporting' | 'monitoring';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
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
  cadence?: 'once' | 'monthly' | 'weekly' | 'ongoing';
  comments: Comment[];
  documents: Document[];
  attachments?: Attachment[];
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
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

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  address?: string;
  avatar?: string;
  createdAt: Date;
  isActive: boolean;
}

export interface Subscription {
  id: string;
  clientId: string;
  tier: SubscriptionTier;
  status: 'active' | 'cancelled' | 'pending' | 'expired';
  startDate: Date;
  endDate?: Date;
  nextBillingDate?: Date;
  monthlyPrice: number;
}

export interface PaymentHistory {
  id: string;
  clientId: string;
  subscriptionId: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  paymentDate: Date;
  paymentMethod: string;
  invoiceNumber: string;
}

export interface TaskTemplate {
  id: string;
  taskId: string;
  title: string;
  description?: string;
  phase: Phase;
  owner: UserRole | 'system';
  cadence?: 'once' | 'monthly' | 'weekly' | 'ongoing';
  isActive: boolean;
  order: number;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  trigger: 'task_assigned' | 'task_completed' | 'subscription_reminder' | 'welcome' | 'custom';
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
  'us-strategy': 'US Strategy Team',
  'india-head': 'India SEO Head',
  'india-junior': 'India SEO Junior',
  'client': 'Client'
};

export const PHASE_LABELS: Record<Phase, string> = {
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
  'submitted': 'Submitted for Review',
  'approved': 'Approved',
  'resubmit': 'Needs Revision'
};
