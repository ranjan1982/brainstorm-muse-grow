import { 
  WorkPhase, 
  AdminUser, 
  DiscountCoupon, 
  Refund, 
  LoginActivity, 
  EmailBlast,
  ExtendedSubscription,
  AdminEmailTemplate
} from '@/types/admin';

// Work Phases
export const mockWorkPhases: WorkPhase[] = [
  {
    id: 'phase-onboarding',
    name: 'Onboarding & Intake',
    description: 'Initial client setup, access collection, and strategy alignment',
    order: 1,
    isActive: true,
    autoTriggerOnComplete: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'phase-foundation',
    name: 'Foundation Setup',
    description: 'GBP optimization, schema implementation, and baseline metrics',
    order: 2,
    isActive: true,
    dependsOnPhase: 'phase-onboarding',
    autoTriggerOnComplete: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'phase-execution',
    name: 'Monthly Execution',
    description: 'Recurring content, optimization, and maintenance tasks',
    order: 3,
    isActive: true,
    dependsOnPhase: 'phase-foundation',
    autoTriggerOnComplete: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'phase-ai',
    name: 'AI / AEO Optimization',
    description: 'AI visibility testing, mention scoring, and optimization',
    order: 4,
    isActive: true,
    dependsOnPhase: 'phase-foundation',
    autoTriggerOnComplete: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'phase-reporting',
    name: 'Reporting & Strategy',
    description: 'Performance reports, strategy memos, and client communication',
    order: 5,
    isActive: true,
    autoTriggerOnComplete: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'phase-monitoring',
    name: 'Failure Monitoring',
    description: 'Alert detection, issue diagnosis, and recovery procedures',
    order: 6,
    isActive: true,
    autoTriggerOnComplete: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Admin/Backoffice Users
export const mockAdminUsers: AdminUser[] = [
  {
    id: 'admin-1',
    name: 'Alex Thompson',
    email: 'alex@seosuite.com',
    role: 'admin',
    department: 'admin',
    isActive: true,
    createdAt: new Date('2023-06-01'),
    lastLogin: new Date('2025-01-10')
  },
  {
    id: 'us-1',
    name: 'Sarah Mitchell',
    email: 'sarah@seosuite.com',
    role: 'us-strategy',
    department: 'backoffice',
    isActive: true,
    createdAt: new Date('2023-08-15'),
    lastLogin: new Date('2025-01-10')
  },
  {
    id: 'us-2',
    name: 'James Wilson',
    email: 'james@seosuite.com',
    role: 'us-strategy',
    department: 'backoffice',
    isActive: true,
    createdAt: new Date('2024-02-01'),
    lastLogin: new Date('2025-01-09')
  },
  {
    id: 'india-head-1',
    name: 'Robert Harrison',
    email: 'robert@seosuite.com',
    role: 'india-head',
    department: 'seo-team',
    isActive: true,
    createdAt: new Date('2023-07-01'),
    lastLogin: new Date('2025-01-10')
  },
  {
    id: 'india-junior-1',
    name: 'Jennifer Davis',
    email: 'jennifer@seosuite.com',
    role: 'india-junior',
    department: 'seo-team',
    isActive: true,
    createdAt: new Date('2023-09-01'),
    lastLogin: new Date('2025-01-10')
  },
  {
    id: 'india-junior-2',
    name: 'Priya Sharma',
    email: 'priya@seosuite.com',
    role: 'india-junior',
    department: 'seo-team',
    isActive: true,
    createdAt: new Date('2024-03-15'),
    lastLogin: new Date('2025-01-08')
  },
  {
    id: 'india-junior-3',
    name: 'Rahul Patel',
    email: 'rahul@seosuite.com',
    role: 'india-junior',
    department: 'seo-team',
    isActive: false,
    createdAt: new Date('2024-01-10'),
    lastLogin: new Date('2024-11-15')
  }
];

// Discount Coupons
export const mockCoupons: DiscountCoupon[] = [
  {
    id: 'coupon-1',
    code: 'WELCOME20',
    name: 'Welcome Discount',
    type: 'percentage',
    value: 20,
    applicationType: 'one-time',
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2025-12-31'),
    maxUses: 100,
    usedCount: 23,
    applicableTiers: ['starter', 'growth', 'enterprise'],
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'coupon-2',
    code: 'GROWTH50',
    name: 'Growth Plan Special',
    type: 'fixed',
    value: 50,
    applicationType: 'recurring',
    validFrom: new Date('2024-06-01'),
    validUntil: new Date('2025-06-01'),
    maxUses: 50,
    usedCount: 12,
    applicableTiers: ['growth', 'enterprise'],
    isActive: true,
    createdAt: new Date('2024-06-01')
  },
  {
    id: 'coupon-3',
    code: 'ENTERPRISE100',
    name: 'Enterprise Upgrade',
    type: 'fixed',
    value: 100,
    applicationType: 'both',
    validFrom: new Date('2024-01-01'),
    maxUses: 25,
    usedCount: 8,
    applicableTiers: ['enterprise'],
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'coupon-4',
    code: 'SUMMER15',
    name: 'Summer Sale',
    type: 'percentage',
    value: 15,
    applicationType: 'one-time',
    validFrom: new Date('2024-06-01'),
    validUntil: new Date('2024-08-31'),
    maxUses: 200,
    usedCount: 200,
    applicableTiers: ['starter', 'growth', 'enterprise'],
    isActive: false,
    createdAt: new Date('2024-06-01')
  }
];

// Refunds
export const mockRefunds: Refund[] = [
  {
    id: 'refund-1',
    clientId: 'client-4',
    subscriptionId: 'sub-4',
    paymentId: 'pay-5',
    type: 'full',
    originalAmount: 299,
    refundAmount: 299,
    reason: 'Service cancellation request',
    status: 'processed',
    processedBy: 'admin-1',
    processedAt: new Date('2024-06-20'),
    createdAt: new Date('2024-06-16')
  },
  {
    id: 'refund-2',
    clientId: 'client-2',
    subscriptionId: 'sub-2',
    paymentId: 'pay-3',
    type: 'partial',
    originalAmount: 299,
    refundAmount: 150,
    reason: 'Service credit for delayed onboarding',
    status: 'approved',
    createdAt: new Date('2025-01-05')
  },
  {
    id: 'refund-3',
    clientId: 'client-1',
    subscriptionId: 'sub-1',
    paymentId: 'pay-1',
    type: 'partial',
    originalAmount: 599,
    refundAmount: 100,
    reason: 'Goodwill gesture for technical issues',
    status: 'pending',
    createdAt: new Date('2025-01-10')
  }
];

// Login Activity
export const mockLoginActivity: LoginActivity[] = [
  {
    id: 'login-1',
    userId: 'admin-1',
    userName: 'Alex Thompson',
    userRole: 'admin',
    ipAddress: '192.168.1.100',
    sessionDuration: 120,
    loginAt: new Date('2025-01-10T09:00:00'),
    logoutAt: new Date('2025-01-10T11:00:00'),
    status: 'logged_out'
  },
  {
    id: 'login-2',
    userId: 'us-1',
    userName: 'Sarah Mitchell',
    userRole: 'us-strategy',
    ipAddress: '10.0.0.50',
    loginAt: new Date('2025-01-10T08:30:00'),
    status: 'active'
  },
  {
    id: 'login-3',
    userId: 'india-head-1',
    userName: 'Robert Harrison',
    userRole: 'india-head',
    ipAddress: '203.45.67.89',
    sessionDuration: 480,
    loginAt: new Date('2025-01-10T06:00:00'),
    status: 'active'
  },
  {
    id: 'login-4',
    userId: 'client-1',
    userName: 'John Martinez',
    userRole: 'client',
    ipAddress: '72.134.56.78',
    sessionDuration: 45,
    loginAt: new Date('2025-01-09T14:30:00'),
    logoutAt: new Date('2025-01-09T15:15:00'),
    status: 'logged_out'
  },
  {
    id: 'login-5',
    userId: 'india-junior-1',
    userName: 'Jennifer Davis',
    userRole: 'india-junior',
    ipAddress: '203.45.67.90',
    loginAt: new Date('2025-01-10T06:15:00'),
    status: 'active'
  },
  {
    id: 'login-6',
    userId: 'india-junior-2',
    userName: 'Priya Sharma',
    userRole: 'india-junior',
    ipAddress: '203.45.67.91',
    sessionDuration: 360,
    loginAt: new Date('2025-01-08T07:00:00'),
    logoutAt: new Date('2025-01-08T13:00:00'),
    status: 'logged_out'
  },
  {
    id: 'login-7',
    userId: 'client-2',
    userName: 'Emily Chen',
    userRole: 'client',
    ipAddress: '98.76.54.32',
    sessionDuration: 30,
    loginAt: new Date('2025-01-07T10:00:00'),
    logoutAt: new Date('2025-01-07T10:30:00'),
    status: 'logged_out'
  }
];

// Email Blasts
export const mockEmailBlasts: EmailBlast[] = [
  {
    id: 'blast-1',
    subject: 'New Year 2025 - Exciting Updates Coming!',
    body: 'Dear valued client,\n\nHappy New Year! We have exciting updates planned for 2025...',
    recipientType: 'all-clients',
    sentBy: 'admin-1',
    sentAt: new Date('2025-01-01T09:00:00'),
    status: 'sent',
    recipientCount: 4,
    openCount: 3,
    createdAt: new Date('2024-12-28')
  },
  {
    id: 'blast-2',
    subject: 'Enterprise Feature Update',
    body: 'Dear Enterprise client,\n\nWe are pleased to announce new features exclusive to your plan...',
    recipientType: 'specific-tier',
    targetTier: 'enterprise',
    sentBy: 'admin-1',
    sentAt: new Date('2025-01-05T10:00:00'),
    status: 'sent',
    recipientCount: 1,
    openCount: 1,
    createdAt: new Date('2025-01-04')
  },
  {
    id: 'blast-3',
    subject: 'Monthly Newsletter - January 2025',
    body: 'Hi there,\n\nHere is your monthly SEO newsletter with tips and updates...',
    recipientType: 'active-clients',
    sentBy: 'us-1',
    status: 'draft',
    createdAt: new Date('2025-01-10')
  }
];

// Extended Subscriptions with trial support
export const mockExtendedSubscriptions: ExtendedSubscription[] = [
  {
    id: 'sub-1',
    clientId: 'client-1',
    tier: 'growth',
    status: 'active',
    startDate: new Date('2024-01-01'),
    nextBillingDate: new Date('2025-02-01'),
    monthlyPrice: 599,
    appliedCouponId: 'coupon-1',
    discountAmount: 119.80
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
    monthlyPrice: 999,
    appliedCouponId: 'coupon-3',
    discountAmount: 100
  },
  {
    id: 'sub-4',
    clientId: 'client-4',
    tier: 'starter',
    status: 'cancelled',
    startDate: new Date('2024-02-15'),
    endDate: new Date('2024-06-15'),
    monthlyPrice: 299,
    cancellationReason: 'Budget constraints',
    cancelledAt: new Date('2024-06-15'),
    cancelledBy: 'client-4'
  },
  {
    id: 'sub-5',
    clientId: 'client-5',
    tier: 'growth',
    status: 'trial',
    startDate: new Date('2025-01-05'),
    trialEndDate: new Date('2025-01-19'),
    monthlyPrice: 599
  }
];

// Admin Email Templates (expanded)
export const mockAdminEmailTemplates: AdminEmailTemplate[] = [
  {
    id: 'email-1',
    name: 'Welcome Email',
    subject: 'Welcome to SEO Suite - Let\'s Get Started!',
    body: 'Dear {{client_name}},\n\nWelcome to SEO Suite! We\'re excited to have you on board.\n\nYour subscription: {{subscription_tier}}\n\nBest regards,\nThe SEO Suite Team',
    trigger: 'welcome',
    category: 'user',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'email-2',
    name: 'Task Assignment Notification',
    subject: 'New Task Assigned: {{task_title}}',
    body: 'Hi {{client_name}},\n\nA new task has been assigned to you:\n\nTask: {{task_title}}\nPhase: {{task_phase}}\nDue: {{due_date}}\n\nPlease log in to your dashboard to view details.',
    trigger: 'task_assigned',
    category: 'task',
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
    category: 'task',
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
    category: 'subscription',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'email-5',
    name: 'Client Onboarding with Credentials',
    subject: 'Your SEO Suite Account is Ready!',
    body: 'Dear {{client_name}},\n\nYour account has been created successfully!\n\nLogin URL: {{login_url}}\nEmail: {{client_email}}\nTemporary Password: {{temp_password}}\n\nPlease change your password upon first login.\n\nWelcome aboard!',
    trigger: 'client_onboarding',
    category: 'user',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'email-6',
    name: 'New User Credentials',
    subject: 'Your SEO Suite Team Account',
    body: 'Hello {{user_name}},\n\nA new account has been created for you on SEO Suite.\n\nRole: {{user_role}}\nEmail: {{user_email}}\nTemporary Password: {{temp_password}}\n\nPlease log in and change your password immediately.',
    trigger: 'new_user_credentials',
    category: 'user',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Additional client for trial demo
export const mockTrialClient = {
  id: 'client-5',
  name: 'David Lee',
  email: 'david@techstartup.io',
  company: 'Tech Startup IO',
  phone: '+1 (555) 567-8901',
  address: '555 Innovation Way, Austin, TX 78701',
  createdAt: new Date('2025-01-05'),
  isActive: true
};
