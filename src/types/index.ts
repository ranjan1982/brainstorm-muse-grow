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
  status: TaskStatus;
  cadence?: 'once' | 'monthly' | 'weekly' | 'ongoing';
  comments: Comment[];
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  content: string;
  createdAt: Date;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface Subscription {
  id: string;
  tier: 'starter' | 'growth' | 'enterprise';
  status: 'active' | 'cancelled' | 'pending';
  startDate: Date;
  clientId: string;
}

export interface KPIData {
  localPackVisibility: number;
  gbpViews: number;
  aiMentionScore: number;
  tasksCompleted: number;
  totalTasks: number;
}

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
