import { Task, User, KPIData, Phase, Client, Subscription, PaymentHistory, TaskTemplate, EmailTemplate } from '@/types';

// Multiple clients for team management
export const mockClients: Client[] = [
  { 
    id: 'client-1', 
    name: 'John Martinez', 
    email: 'john@acmeplumbing.com', 
    company: 'Acme Plumbing Co.',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Los Angeles, CA 90001',
    createdAt: new Date('2024-01-01'),
    isActive: true
  },
  { 
    id: 'client-2', 
    name: 'Emily Chen', 
    email: 'emily@greenscapelandscaping.com', 
    company: 'GreenScape Landscaping',
    phone: '+1 (555) 234-5678',
    address: '456 Oak Ave, San Diego, CA 92101',
    createdAt: new Date('2024-01-15'),
    isActive: true
  },
  { 
    id: 'client-3', 
    name: 'Michael Brown', 
    email: 'michael@eliteautorepair.com', 
    company: 'Elite Auto Repair',
    phone: '+1 (555) 345-6789',
    address: '789 Industrial Blvd, Phoenix, AZ 85001',
    createdAt: new Date('2024-02-01'),
    isActive: true
  },
  { 
    id: 'client-4', 
    name: 'Sarah Williams', 
    email: 'sarah@homecleanpro.com', 
    company: 'HomeClean Pro Services',
    phone: '+1 (555) 456-7890',
    address: '321 Service Rd, Denver, CO 80202',
    createdAt: new Date('2024-02-15'),
    isActive: false
  },
];

// Subscriptions for each client
export const mockSubscriptions: Subscription[] = [
  {
    id: 'sub-1',
    clientId: 'client-1',
    tier: 'growth',
    status: 'active',
    startDate: new Date('2024-01-01'),
    nextBillingDate: new Date('2025-02-01'),
    monthlyPrice: 599
  },
  {
    id: 'sub-2',
    clientId: 'client-2',
    tier: 'starter',
    status: 'active',
    startDate: new Date('2024-01-15'),
    nextBillingDate: new Date('2025-02-15'),
    monthlyPrice: 299
  },
  {
    id: 'sub-3',
    clientId: 'client-3',
    tier: 'enterprise',
    status: 'active',
    startDate: new Date('2024-02-01'),
    nextBillingDate: new Date('2025-03-01'),
    monthlyPrice: 999
  },
  {
    id: 'sub-4',
    clientId: 'client-4',
    tier: 'starter',
    status: 'cancelled',
    startDate: new Date('2024-02-15'),
    endDate: new Date('2024-06-15'),
    monthlyPrice: 299
  },
];

// Payment history
export const mockPaymentHistory: PaymentHistory[] = [
  {
    id: 'pay-1',
    clientId: 'client-1',
    subscriptionId: 'sub-1',
    amount: 599,
    status: 'paid',
    paymentDate: new Date('2025-01-01'),
    paymentMethod: 'Visa ****4242',
    invoiceNumber: 'INV-2025-001'
  },
  {
    id: 'pay-2',
    clientId: 'client-1',
    subscriptionId: 'sub-1',
    amount: 599,
    status: 'paid',
    paymentDate: new Date('2024-12-01'),
    paymentMethod: 'Visa ****4242',
    invoiceNumber: 'INV-2024-012'
  },
  {
    id: 'pay-3',
    clientId: 'client-2',
    subscriptionId: 'sub-2',
    amount: 299,
    status: 'paid',
    paymentDate: new Date('2025-01-15'),
    paymentMethod: 'Mastercard ****5678',
    invoiceNumber: 'INV-2025-002'
  },
  {
    id: 'pay-4',
    clientId: 'client-3',
    subscriptionId: 'sub-3',
    amount: 999,
    status: 'pending',
    paymentDate: new Date('2025-01-28'),
    paymentMethod: 'ACH Transfer',
    invoiceNumber: 'INV-2025-003'
  },
  {
    id: 'pay-5',
    clientId: 'client-4',
    subscriptionId: 'sub-4',
    amount: 299,
    status: 'failed',
    paymentDate: new Date('2024-06-15'),
    paymentMethod: 'Visa ****9999',
    invoiceNumber: 'INV-2024-006'
  },
];

// Task templates for phase configuration
export const mockTaskTemplates: TaskTemplate[] = [
  // Onboarding templates
  { id: 'tpl-1', taskId: 'TPL-ONB-001', title: 'Provide GBP access', description: 'Share Google Business Profile access credentials with the team.', phase: 'onboarding', owner: 'client', cadence: 'once', isActive: true, order: 1 },
  { id: 'tpl-2', taskId: 'TPL-ONB-002', title: 'Upload 20+ photos', description: 'Upload high-quality photos of your business, team, and services.', phase: 'onboarding', owner: 'client', cadence: 'once', isActive: true, order: 2 },
  { id: 'tpl-3', taskId: 'TPL-ONB-003', title: 'Submit service descriptions', description: 'Provide detailed descriptions of all services offered.', phase: 'onboarding', owner: 'client', cadence: 'once', isActive: true, order: 3 },
  { id: 'tpl-4', taskId: 'TPL-ONB-004', title: 'Conduct onboarding call', description: 'Schedule and conduct initial strategy call with client.', phase: 'onboarding', owner: 'us-strategy', cadence: 'once', isActive: true, order: 4 },
  { id: 'tpl-5', taskId: 'TPL-ONB-005', title: 'Verify access & completeness', description: 'Confirm all client-provided access and materials are complete.', phase: 'onboarding', owner: 'india-head', cadence: 'once', isActive: true, order: 5 },
  
  // Foundation templates
  { id: 'tpl-6', taskId: 'TPL-FND-001', title: 'GBP audit & baseline snapshot', description: 'Complete comprehensive audit of current GBP status.', phase: 'foundation', owner: 'india-head', cadence: 'once', isActive: true, order: 1 },
  { id: 'tpl-7', taskId: 'TPL-FND-002', title: 'Initial GBP optimization', description: 'Implement baseline optimization for GBP profile.', phase: 'foundation', owner: 'india-head', cadence: 'once', isActive: true, order: 2 },
  { id: 'tpl-8', taskId: 'TPL-FND-003', title: 'Location page audit', description: 'Audit client website location pages for local SEO.', phase: 'foundation', owner: 'india-head', cadence: 'once', isActive: true, order: 3 },
  
  // Execution templates
  { id: 'tpl-9', taskId: 'TPL-EXE-001', title: 'Publish 2 Google Posts', description: 'Create and publish monthly Google Business posts.', phase: 'execution', owner: 'india-head', cadence: 'monthly', isActive: true, order: 1 },
  { id: 'tpl-10', taskId: 'TPL-EXE-002', title: 'Seed 3 GBP Q&As', description: 'Add relevant Q&A content to GBP.', phase: 'execution', owner: 'india-head', cadence: 'monthly', isActive: true, order: 2 },
  
  // Reporting templates
  { id: 'tpl-11', taskId: 'TPL-RPT-001', title: 'Update dashboard', description: 'Refresh KPI dashboard with latest metrics.', phase: 'reporting', owner: 'india-head', cadence: 'monthly', isActive: true, order: 1 },
  { id: 'tpl-12', taskId: 'TPL-RPT-002', title: 'Monthly email summary', description: 'Send monthly progress report to client.', phase: 'reporting', owner: 'india-head', cadence: 'monthly', isActive: true, order: 2 },
];

// Email templates
export const mockEmailTemplates: EmailTemplate[] = [
  {
    id: 'email-1',
    name: 'Welcome Email',
    subject: 'Welcome to SEO Suite - Let\'s Get Started!',
    body: 'Dear {{client_name}},\n\nWelcome to SEO Suite! We\'re excited to have you on board.\n\nYour subscription: {{subscription_tier}}\n\nBest regards,\nThe SEO Suite Team',
    trigger: 'welcome',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'email-2',
    name: 'Task Assignment',
    subject: 'New Task Assigned: {{task_title}}',
    body: 'Hi {{client_name}},\n\nA new task has been assigned to you:\n\nTask: {{task_title}}\nPhase: {{task_phase}}\nDue: {{due_date}}\n\nPlease log in to your dashboard to view details.',
    trigger: 'task_assigned',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'email-3',
    name: 'Task Completed',
    subject: 'Task Completed: {{task_title}}',
    body: 'Hi {{client_name}},\n\nGreat news! The following task has been completed:\n\nTask: {{task_title}}\nCompleted by: {{completed_by}}\n\nView your dashboard for more details.',
    trigger: 'task_completed',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'email-4',
    name: 'Subscription Reminder',
    subject: 'Upcoming Renewal: Your SEO Suite Subscription',
    body: 'Dear {{client_name}},\n\nYour {{subscription_tier}} subscription will renew on {{renewal_date}}.\n\nAmount: ${{amount}}\n\nThank you for your continued trust!',
    trigger: 'subscription_reminder',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
];

export const mockUsers: User[] = [
  { id: 'admin-1', name: 'Alex Thompson', email: 'alex@seosuite.com', role: 'admin' },
  { id: 'us-1', name: 'Sarah Mitchell', email: 'sarah@seosuite.com', role: 'us-strategy' },
  { id: 'india-head-1', name: 'Raj Patel', email: 'raj@seosuite.com', role: 'india-head' },
  { id: 'india-junior-1', name: 'Priya Sharma', email: 'priya@seosuite.com', role: 'india-junior' },
  // Client users (linked to clients)
  { id: 'client-1', name: 'John Martinez', email: 'john@acmeplumbing.com', role: 'client' },
  { id: 'client-2', name: 'Emily Chen', email: 'emily@greenscapelandscaping.com', role: 'client' },
  { id: 'client-3', name: 'Michael Brown', email: 'michael@eliteautorepair.com', role: 'client' },
  { id: 'client-4', name: 'Sarah Williams', email: 'sarah@homecleanpro.com', role: 'client' },
];

// Tasks now include clientId for multi-client support
export interface TaskWithClient extends Task {
  clientId: string;
}

export const mockTasks: TaskWithClient[] = [
  // Client 1 - Acme Plumbing Tasks
  {
    id: '1',
    taskId: 'ST-ONB-001',
    title: 'Provide GBP access',
    description: 'Share Google Business Profile access credentials with the team.',
    phase: 'onboarding',
    owner: 'client',
    status: 'approved',
    comments: [],
    documents: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-18'),
    clientId: 'client-1'
  },
  {
    id: '2',
    taskId: 'ST-ONB-002',
    title: 'Upload 20+ photos',
    description: 'Upload high-quality photos of your business, team, and services.',
    phase: 'onboarding',
    owner: 'client',
    status: 'in-progress',
    comments: [
      { id: 'c1', userId: 'client-1', userName: 'John Martinez', userRole: 'client', content: 'Uploaded 12 photos so far, will add more this week.', createdAt: new Date('2024-01-20') }
    ],
    documents: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    clientId: 'client-1'
  },
  {
    id: '3',
    taskId: 'ST-ONB-003',
    title: 'Submit service descriptions',
    description: 'Provide detailed descriptions of all services offered.',
    phase: 'onboarding',
    owner: 'client',
    status: 'pending',
    comments: [],
    documents: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    clientId: 'client-1'
  },
  {
    id: '4',
    taskId: 'ST-ONB-004',
    title: 'Conduct onboarding call',
    description: 'Schedule and conduct initial strategy call with client.',
    phase: 'onboarding',
    owner: 'us-strategy',
    status: 'approved',
    comments: [],
    documents: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-17'),
    clientId: 'client-1'
  },
  {
    id: '5',
    taskId: 'ST-ONB-005',
    title: 'Verify access & completeness',
    description: 'Confirm all client-provided access and materials are complete.',
    phase: 'onboarding',
    owner: 'india-head',
    status: 'pending',
    comments: [],
    documents: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    clientId: 'client-1'
  },
  {
    id: '6',
    taskId: 'ST-FND-001',
    title: 'GBP audit & baseline snapshot',
    description: 'Complete comprehensive audit of current GBP status.',
    phase: 'foundation',
    owner: 'india-head',
    assignedTo: 'india-junior-1',
    status: 'submitted',
    comments: [
      { id: 'c2', userId: 'india-junior-1', userName: 'Priya Sharma', userRole: 'india-junior', content: 'Audit complete, found 15 optimization opportunities.', createdAt: new Date('2024-01-22') }
    ],
    documents: [],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-22'),
    clientId: 'client-1'
  },

  // Client 2 - GreenScape Landscaping Tasks
  {
    id: '7',
    taskId: 'ST-ONB-001',
    title: 'Provide GBP access',
    description: 'Share Google Business Profile access credentials with the team.',
    phase: 'onboarding',
    owner: 'client',
    status: 'approved',
    comments: [],
    documents: [],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-22'),
    clientId: 'client-2'
  },
  {
    id: '8',
    taskId: 'ST-ONB-002',
    title: 'Upload 20+ photos',
    description: 'Upload high-quality photos of your business, team, and services.',
    phase: 'onboarding',
    owner: 'client',
    status: 'approved',
    comments: [],
    documents: [],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-25'),
    clientId: 'client-2'
  },
  {
    id: '9',
    taskId: 'ST-FND-001',
    title: 'GBP audit & baseline snapshot',
    description: 'Complete comprehensive audit of current GBP status.',
    phase: 'foundation',
    owner: 'india-head',
    status: 'in-progress',
    comments: [],
    documents: [],
    createdAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26'),
    clientId: 'client-2'
  },
  {
    id: '10',
    taskId: 'ST-EXE-001',
    title: 'Publish 2 Google Posts',
    description: 'Create and publish monthly Google Business posts.',
    phase: 'execution',
    owner: 'india-head',
    status: 'pending',
    cadence: 'monthly',
    comments: [],
    documents: [],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    clientId: 'client-2'
  },

  // Client 3 - Elite Auto Repair Tasks
  {
    id: '11',
    taskId: 'ST-ONB-001',
    title: 'Provide GBP access',
    description: 'Share Google Business Profile access credentials with the team.',
    phase: 'onboarding',
    owner: 'client',
    status: 'pending',
    comments: [],
    documents: [],
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
    clientId: 'client-3'
  },
  {
    id: '12',
    taskId: 'ST-ONB-002',
    title: 'Conduct onboarding call',
    description: 'Schedule and conduct initial strategy call with client.',
    phase: 'onboarding',
    owner: 'us-strategy',
    status: 'in-progress',
    comments: [
      { id: 'c3', userId: 'us-1', userName: 'Sarah Mitchell', userRole: 'us-strategy', content: 'Call scheduled for next Tuesday at 2pm PST.', createdAt: new Date('2024-02-06') }
    ],
    documents: [],
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-06'),
    clientId: 'client-3'
  },
];

export const mockKPIData: Record<string, KPIData> = {
  'client-1': {
    localPackVisibility: 67,
    gbpViews: 2100,
    aiMentionScore: 3.2,
    tasksCompleted: 4,
    totalTasks: 6,
  },
  'client-2': {
    localPackVisibility: 45,
    gbpViews: 1200,
    aiMentionScore: 2.1,
    tasksCompleted: 2,
    totalTasks: 4,
  },
  'client-3': {
    localPackVisibility: 0,
    gbpViews: 0,
    aiMentionScore: 0,
    tasksCompleted: 0,
    totalTasks: 2,
  },
};

export const kpiHistory = [
  { month: 'Jan', visibility: 45, views: 1200, aiScore: 2.1 },
  { month: 'Feb', visibility: 52, views: 1450, aiScore: 2.4 },
  { month: 'Mar', visibility: 58, views: 1680, aiScore: 2.8 },
  { month: 'Apr', visibility: 61, views: 1890, aiScore: 3.0 },
  { month: 'May', visibility: 67, views: 2100, aiScore: 3.2 },
];

export const getPhaseProgress = (tasks: Task[]): Record<Phase, { completed: number; total: number }> => {
  const phases: Phase[] = ['onboarding', 'foundation', 'execution', 'ai', 'reporting', 'monitoring'];
  
  return phases.reduce((acc, phase) => {
    const phaseTasks = tasks.filter(t => t.phase === phase);
    const completed = phaseTasks.filter(t => t.status === 'approved').length;
    acc[phase] = { completed, total: phaseTasks.length };
    return acc;
  }, {} as Record<Phase, { completed: number; total: number }>);
};