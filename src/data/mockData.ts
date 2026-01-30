import { Task, User, KPIData, Phase, Client, Subscription, PaymentHistory, TaskTemplate, EmailTemplate, LoginHistory, SubscriptionPlan, Discount, PhaseConfig, Package } from '@/types';

// Multiple clients for team management
export const mockClients: Client[] = [
  {
    id: 'client-1',
    name: 'John Martinez',
    email: 'john@acmeplumbing.com',
    company: 'Acme Plumbing Co.',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Los Angeles, CA 90001',
    billingAddress: {
      line1: '123 Main St',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001',
      country: 'USA'
    },
    createdAt: new Date('2024-01-01'),
    isActive: true,
    associatedTeam: {
      usStrategyId: 'us-1',
      seoHeadId: 'seo-head-1',
      seoJuniorId: 'seo-junior-1'
    },
    currentPhase: 'onboarding'
  },
  {
    id: 'client-2',
    name: 'Emily Chen',
    email: 'emily@greenscapelandscaping.com',
    company: 'GreenScape Landscaping',
    phone: '+1 (555) 234-5678',
    address: '456 Oak Ave, San Diego, CA 92101',
    billingAddress: {
      line1: '456 Oak Ave',
      city: 'San Diego',
      state: 'CA',
      zip: '92101',
      country: 'USA'
    },
    createdAt: new Date('2024-01-15'),
    isActive: true,
    associatedTeam: {
      usStrategyId: 'us-1',
      seoHeadId: 'seo-head-1',
      seoJuniorId: 'seo-junior-1'
    },
    currentPhase: 'onboarding'
  },
  {
    id: 'client-3',
    name: 'Michael Brown',
    email: 'michael@eliteautorepair.com',
    company: 'Elite Auto Repair',
    phone: '+1 (555) 345-6789',
    address: '789 Industrial Blvd, Phoenix, AZ 85001',
    billingAddress: {
      line1: '789 Industrial Blvd',
      city: 'Phoenix',
      state: 'AZ',
      zip: '85001',
      country: 'USA'
    },
    createdAt: new Date('2024-02-01'),
    isActive: true,
    associatedTeam: {
      usStrategyId: 'us-1',
      seoHeadId: 'seo-head-1',
      seoJuniorId: 'seo-junior-1'
    },
    currentPhase: 'onboarding'
  },
  {
    id: 'client-4',
    name: 'Sarah Williams',
    email: 'sarah@homecleanpro.com',
    company: 'HomeClean Pro Services',
    phone: '+1 (555) 456-7890',
    address: '321 Service Rd, Denver, CO 80202',
    billingAddress: {
      line1: '321 Service Rd',
      city: 'Denver',
      state: 'CO',
      zip: '80202',
      country: 'USA'
    },
    createdAt: new Date('2024-02-15'),
    isActive: false,
    associatedTeam: {
      usStrategyId: 'us-1',
      seoHeadId: 'seo-head-1',
      seoJuniorId: 'seo-junior-1'
    },
    currentPhase: 'onboarding'
  },
  {
    id: 'client-5',
    name: 'David Kim',
    email: 'david@techstart.io',
    company: 'TechStart Inc.',
    phone: '+1 (555) 567-8901',
    address: '101 Tech Blvd, Austin, TX 78701',
    billingAddress: {
      line1: '101 Tech Blvd',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
      country: 'USA'
    },
    createdAt: new Date('2026-01-10'),
    isActive: true,
    associatedTeam: {
      usStrategyId: 'us-1',
      seoHeadId: 'seo-head-1',
      seoJuniorId: 'seo-junior-1'
    },
    currentPhase: 'onboarding'
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
    monthlyPrice: 599,
    purchaseType: 'auto',
    track: 'local'
  },
  {
    id: 'sub-2',
    clientId: 'client-2',
    tier: 'starter',
    status: 'active',
    startDate: new Date('2024-01-15'),
    nextBillingDate: new Date('2025-02-15'),
    monthlyPrice: 299,
    purchaseType: 'auto',
    track: 'local'
  },
  {
    id: 'sub-3',
    clientId: 'client-3',
    tier: 'enterprise',
    status: 'active',
    startDate: new Date('2024-02-01'),
    nextBillingDate: new Date('2025-03-01'),
    monthlyPrice: 999,
    purchaseType: 'auto',
    track: 'local'
  },
  {
    id: 'sub-4',
    clientId: 'client-4',
    tier: 'starter',
    status: 'cancelled',
    startDate: new Date('2024-02-15'),
    endDate: new Date('2024-06-15'),
    monthlyPrice: 299,
    purchaseType: 'auto',
    track: 'local'
  },
  {
    id: 'sub-5',
    clientId: 'client-5',
    tier: 'growth',
    status: 'trial',
    startDate: new Date('2026-01-10'),
    nextBillingDate: new Date('2026-01-24'),
    trialEndDate: new Date('2026-01-24'),
    monthlyPrice: 599,
    purchaseType: 'auto',
    track: 'local'
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

// Task templates for phase configuration - organized by tier with proper inheritance
// Starter tasks available in: starter, growth, enterprise
// Growth tasks available in: growth, enterprise  
// Pro/Enterprise tasks available in: enterprise only
export const mockTaskTemplates: TaskTemplate[] = [
  // ========== ONBOARDING & INTAKE ==========
  // Starter Tier (available in all tiers)
  { id: 'tpl-onb-st-1', taskId: 'ST-ONB-01', title: 'Provide GBP access', description: 'Client submits GBP access → India SEO verifies → US Strategy approves', phase: 'onboarding', owner: 'client', cadence: 'once', isActive: true, order: 1, tiers: ['starter', 'growth', 'enterprise'], tracks: ['local', 'national', 'hybrid'] },
  { id: 'tpl-onb-st-2', taskId: 'ST-ONB-02', title: 'Upload 20+ business photos', description: 'Client uploads photos → India checks → US approves', phase: 'onboarding', owner: 'client', cadence: 'once', isActive: true, order: 2, tiers: ['starter', 'growth', 'enterprise'], tracks: ['local', 'national', 'hybrid'] },
  { id: 'tpl-onb-st-3', taskId: 'ST-ONB-03', title: 'Submit service descriptions', description: 'Client submits → US reviews → India validates', phase: 'onboarding', owner: 'client', cadence: 'once', isActive: true, order: 3, tiers: ['starter', 'growth', 'enterprise'], tracks: ['local', 'national', 'hybrid'] },
  { id: 'tpl-onb-st-4', taskId: 'ST-ONB-04', title: 'Onboarding call (1 hour)', description: 'Schedule → Conduct → Lock scope', phase: 'onboarding', owner: 'us-strategy', cadence: 'once', isActive: true, order: 4, tiers: ['starter', 'growth', 'enterprise'], tracks: ['local', 'national', 'hybrid'] },

  // Growth Tier Additions (available in growth, enterprise)
  { id: 'tpl-onb-gr-1', taskId: 'GR-ONB-01', title: 'GBP & GSC access collection', description: 'Client submits → India verifies → US approves', phase: 'onboarding', owner: 'client', cadence: 'once', isActive: true, order: 5, tiers: ['growth', 'enterprise'], tracks: ['local', 'national', 'hybrid'] },
  { id: 'tpl-onb-gr-2', taskId: 'GR-ONB-02', title: 'Competitor & keyword intake', description: 'US Strategy analyzes → Approves → Locks', phase: 'onboarding', owner: 'us-strategy', cadence: 'once', isActive: true, order: 6, tiers: ['growth', 'enterprise'], tracks: ['local', 'national', 'hybrid'] },

  // Pro Tier Additions (available in enterprise)
  { id: 'tpl-onb-pr-1', taskId: 'PR-ONB-01', title: 'Conversion funnel review', description: 'US Strategy reviews → Approves → Locks', phase: 'onboarding', owner: 'us-strategy', cadence: 'once', isActive: true, order: 7, tiers: ['enterprise'], tracks: ['local', 'national', 'hybrid'] },
  { id: 'tpl-onb-pr-2', taskId: 'PR-ONB-02', title: 'Brand positioning analysis', description: 'US Strategy analyzes → Approves → Shares', phase: 'onboarding', owner: 'us-strategy', cadence: 'once', isActive: true, order: 8, tiers: ['enterprise'], tracks: ['local', 'national', 'hybrid'] },

  // Enterprise Tier Additions
  { id: 'tpl-onb-en-1', taskId: 'EN-ONB-01', title: 'Multi-location & brand intake', description: 'US Strategy analyzes → Approves → Locks', phase: 'onboarding', owner: 'us-strategy', cadence: 'once', isActive: true, order: 9, tiers: ['enterprise'], tracks: ['local', 'national', 'hybrid'] },
  { id: 'tpl-onb-en-2', taskId: 'EN-ONB-02', title: 'Executive kickoff workshop', description: 'US Strategy schedules → Conducts → Signs off', phase: 'onboarding', owner: 'us-strategy', cadence: 'once', isActive: true, order: 10, tiers: ['enterprise'], tracks: ['local', 'national', 'hybrid'] },

  // ========== FOUNDATION SETUP ==========
  // Starter Tier (available in all tiers)
  { id: 'tpl-fnd-st-1', taskId: 'ST-FND-01', title: 'GBP audit & baseline snapshot', description: 'India SEO audits → US reviews → Approves', phase: 'foundation', owner: 'seo-head', cadence: 'once', isActive: true, order: 1, tiers: ['starter', 'growth', 'enterprise'], tracks: ['local', 'national', 'hybrid'] },
  { id: 'tpl-fnd-st-2', taskId: 'ST-FND-02', title: 'Initial GBP optimization', description: 'India SEO optimizes → US reviews → Publishes', phase: 'foundation', owner: 'seo-head', cadence: 'once', isActive: true, order: 2, tiers: ['starter', 'growth', 'enterprise'], tracks: ['local', 'national', 'hybrid'] },
  { id: 'tpl-fnd-st-3', taskId: 'ST-FND-03', title: 'LocalBusiness + FAQ schema', description: 'India SEO implements → Validates → US approves', phase: 'foundation', owner: 'seo-head', cadence: 'once', isActive: true, order: 3, tiers: ['starter', 'growth', 'enterprise'], tracks: ['local', 'national', 'hybrid'] },

  // Growth Tier Additions (available in growth, enterprise)
  { id: 'tpl-fnd-gr-1', taskId: 'GR-FND-01', title: 'Deep GBP audit', description: 'India SEO audits → US reviews → Approves', phase: 'foundation', owner: 'seo-head', cadence: 'once', isActive: true, order: 4, tiers: ['growth', 'enterprise'], tracks: ['local', 'national', 'hybrid'] },
  { id: 'tpl-fnd-gr-2', taskId: 'GR-FND-02', title: 'Tier 1-2 citations submission', description: 'India SEO submits → Verifies → Closes', phase: 'foundation', owner: 'seo-head', cadence: 'once', isActive: true, order: 5, tiers: ['growth', 'enterprise'], tracks: ['local', 'national', 'hybrid'] },

  // Pro Tier Additions (available in enterprise)
  { id: 'tpl-fnd-pr-1', taskId: 'PR-FND-01', title: 'Service page optimization', description: 'India SEO optimizes → US approves → Publishes', phase: 'foundation', owner: 'seo-head', cadence: 'once', isActive: true, order: 6, tiers: ['enterprise'], tracks: ['local', 'national', 'hybrid'] },
  { id: 'tpl-fnd-pr-2', taskId: 'PR-FND-02', title: 'Internal linking strategy', description: 'India SEO designs → US approves → Implements', phase: 'foundation', owner: 'seo-head', cadence: 'once', isActive: true, order: 7, tiers: ['enterprise'], tracks: ['local', 'national', 'hybrid'] },

  // Enterprise Tier Additions
  { id: 'tpl-fnd-en-1', taskId: 'EN-FND-01', title: 'Entity & brand schema', description: 'US Strategy designs → Approves → Implements', phase: 'foundation', owner: 'us-strategy', cadence: 'once', isActive: true, order: 8, tiers: ['enterprise'], tracks: ['local', 'national', 'hybrid'] },
  { id: 'tpl-fnd-en-2', taskId: 'EN-FND-02', title: 'Multi-location schema build', description: 'India SEO builds → US approves → Publishes', phase: 'foundation', owner: 'seo-head', cadence: 'once', isActive: true, order: 9, tiers: ['enterprise'], tracks: ['local', 'national', 'hybrid'] },

  // ========== MONTHLY EXECUTION CYCLE ==========
  // Starter Tier (available in all tiers)
  { id: 'tpl-exe-st-1', taskId: 'ST-EXE-01', title: 'Publish 2 Google Posts', description: 'India SEO drafts → US approves → Publishes', phase: 'execution', owner: 'seo-head', cadence: 'monthly', isActive: true, order: 1, tiers: ['starter', 'growth', 'enterprise'], tracks: ['local', 'national', 'hybrid'] },
  { id: 'tpl-exe-st-2', taskId: 'ST-EXE-02', title: 'Seed 3 GBP Q&As', description: 'India SEO drafts → US approves → Publishes', phase: 'execution', owner: 'seo-head', cadence: 'monthly', isActive: true, order: 2, tiers: ['starter', 'growth', 'enterprise'], tracks: ['local', 'national', 'hybrid'] },
  { id: 'tpl-exe-st-3', taskId: 'ST-EXE-03', title: 'Publish 1 AI blog post', description: 'India SEO writes → US approves → Publishes', phase: 'execution', owner: 'seo-head', cadence: 'monthly', isActive: true, order: 3, tiers: ['starter', 'growth', 'enterprise'], tracks: ['local', 'national', 'hybrid'] },
  { id: 'tpl-exe-st-4', taskId: 'ST-EXE-04', title: 'Monitor reviews & alerts', description: 'India SEO monitors → Responds → Logs', phase: 'execution', owner: 'seo-head', cadence: 'ongoing', isActive: true, order: 4, tiers: ['starter', 'growth', 'enterprise'], tracks: ['local', 'national', 'hybrid'] },

  // Growth Tier Additions (available in growth, enterprise)
  { id: 'tpl-exe-gr-1', taskId: 'GR-EXE-01', title: 'Publish 4 Google Posts', description: 'India SEO drafts → US approves → Publishes', phase: 'execution', owner: 'seo-head', cadence: 'monthly', isActive: true, order: 5, tiers: ['growth', 'enterprise'], tracks: ['local', 'national', 'hybrid'] },
  { id: 'tpl-exe-gr-2', taskId: 'GR-EXE-02', title: 'Publish 2 AI blog posts', description: 'India SEO writes → US approves → Publishes', phase: 'execution', owner: 'seo-head', cadence: 'monthly', isActive: true, order: 6, tiers: ['growth', 'enterprise'], tracks: ['local', 'national', 'hybrid'] },
  { id: 'tpl-exe-gr-3', taskId: 'GR-EXE-03', title: 'Technical SEO audit', description: 'India SEO audits → US reviews → Logs', phase: 'execution', owner: 'seo-head', cadence: 'monthly', isActive: true, order: 7, tiers: ['growth', 'enterprise'], tracks: ['local', 'national', 'hybrid'] },
  { id: 'tpl-exe-gr-4', taskId: 'GR-EXE-04', title: 'FAQ expansion (8 questions)', description: 'India SEO expands → US approves → Publishes', phase: 'execution', owner: 'seo-head', cadence: 'monthly', isActive: true, order: 8, tiers: ['growth', 'enterprise'], tracks: ['local', 'national', 'hybrid'] },

  // Pro Tier Additions (available in enterprise)
  { id: 'tpl-exe-pr-1', taskId: 'PR-EXE-01', title: 'Publish 6-8 Google Posts', description: 'India SEO drafts → US approves → Publishes', phase: 'execution', owner: 'seo-head', cadence: 'monthly', isActive: true, order: 9, tiers: ['enterprise'], tracks: ['local', 'national', 'hybrid'] },
  { id: 'tpl-exe-pr-2', taskId: 'PR-EXE-02', title: 'CRO review & recommendations', description: 'US Strategy analyzes → Approves → Shares', phase: 'execution', owner: 'us-strategy', cadence: 'monthly', isActive: true, order: 10, tiers: ['enterprise'], tracks: ['local', 'national', 'hybrid'] },

  // Enterprise Tier Additions
  { id: 'tpl-exe-en-1', taskId: 'EN-EXE-01', title: 'Weekly content & GBP cadence', description: 'India SEO drafts → US approves → Publishes', phase: 'execution', owner: 'seo-head', cadence: 'weekly', isActive: true, order: 11, tiers: ['enterprise'], tracks: ['local', 'national', 'hybrid'] },
  { id: 'tpl-exe-en-2', taskId: 'EN-EXE-02', title: 'Reputation response playbooks', description: 'US Strategy defines → Approves → Deploys', phase: 'execution', owner: 'us-strategy', cadence: 'once', isActive: true, order: 12, tiers: ['enterprise'], tracks: ['local', 'national', 'hybrid'] },

  // ========== AI / AEO OPTIMIZATION ==========
  // Starter Tier (available in all tiers)
  { id: 'tpl-aeo-st-1', taskId: 'ST-AEO-01', title: 'AI visibility testing (10 prompts)', description: 'India SEO tests → US reviews → Logs', phase: 'ai', owner: 'seo-head', cadence: 'monthly', isActive: true, order: 1, tiers: ['starter', 'growth', 'enterprise'], tracks: ['local', 'national', 'hybrid'] },
  { id: 'tpl-aeo-st-2', taskId: 'ST-AEO-02', title: 'AI mention score logging', description: 'India SEO logs → Stores → Reviews', phase: 'ai', owner: 'seo-head', cadence: 'monthly', isActive: true, order: 2, tiers: ['starter', 'growth', 'enterprise'], tracks: ['local', 'national', 'hybrid'] },

  // Growth Tier Additions (available in growth, enterprise)
  { id: 'tpl-aeo-gr-1', taskId: 'GR-AEO-01', title: 'AI visibility testing (20 prompts)', description: 'India SEO tests → US reviews → Logs', phase: 'ai', owner: 'seo-head', cadence: 'monthly', isActive: true, order: 3, tiers: ['growth', 'enterprise'], tracks: ['local', 'national', 'hybrid'] },
  { id: 'tpl-aeo-gr-2', taskId: 'GR-AEO-02', title: 'AI gap analysis', description: 'US Strategy analyzes → Documents → Shares', phase: 'ai', owner: 'us-strategy', cadence: 'monthly', isActive: true, order: 4, tiers: ['growth', 'enterprise'], tracks: ['local', 'national', 'hybrid'] },

  // Pro Tier Additions (available in enterprise)
  { id: 'tpl-aeo-pr-1', taskId: 'PR-AEO-01', title: 'AI answer remediation', description: 'India SEO rewrites → US approves → Publishes', phase: 'ai', owner: 'seo-head', cadence: 'monthly', isActive: true, order: 5, tiers: ['enterprise'], tracks: ['local', 'national', 'hybrid'] },
  { id: 'tpl-aeo-pr-2', taskId: 'PR-AEO-02', title: 'AI prompt tuning', description: 'US Strategy tunes → Validates → Deploys', phase: 'ai', owner: 'us-strategy', cadence: 'monthly', isActive: true, order: 6, tiers: ['enterprise'], tracks: ['local', 'national', 'hybrid'] },

  // Enterprise Tier Additions
  { id: 'tpl-aeo-en-1', taskId: 'EN-AEO-01', title: 'AI brand-defense monitoring', description: 'US Strategy monitors → Detects → Acts', phase: 'ai', owner: 'us-strategy', cadence: 'ongoing', isActive: true, order: 7, tiers: ['enterprise'], tracks: ['local', 'national', 'hybrid'] },
  { id: 'tpl-aeo-en-2', taskId: 'EN-AEO-02', title: 'Generative search ownership testing', description: 'US Strategy tests → Analyzes → Adjusts', phase: 'ai', owner: 'us-strategy', cadence: 'monthly', isActive: true, order: 8, tiers: ['enterprise'], tracks: ['local', 'national', 'hybrid'] },

  // ========== REPORTING & STRATEGY ==========
  // Starter Tier (available in all tiers)
  { id: 'tpl-rpt-st-1', taskId: 'ST-RPT-01', title: 'Dashboard update', description: 'System generates → Validates → Displays', phase: 'reporting', owner: 'system', cadence: 'monthly', isActive: true, order: 1, tiers: ['starter', 'growth', 'enterprise'], tracks: ['local', 'national', 'hybrid'] },
  { id: 'tpl-rpt-st-2', taskId: 'ST-RPT-02', title: 'Monthly summary email', description: 'India SEO drafts → US approves → Sends', phase: 'reporting', owner: 'seo-head', cadence: 'monthly', isActive: true, order: 2, tiers: ['starter', 'growth', 'enterprise'], tracks: ['local', 'national', 'hybrid'] },

  // Growth Tier Additions (available in growth, enterprise)
  { id: 'tpl-rpt-gr-1', taskId: 'GR-RPT-01', title: 'Bi-monthly strategy memo', description: 'US Strategy drafts → Approves → Shares', phase: 'reporting', owner: 'us-strategy', cadence: 'bi-monthly', isActive: true, order: 3, tiers: ['growth', 'enterprise'], tracks: ['local', 'national', 'hybrid'] },

  // Pro Tier Additions (available in enterprise)
  { id: 'tpl-rpt-pr-1', taskId: 'PR-RPT-01', title: 'Monthly strategy call', description: 'US Strategy prepares → Conducts → Shares notes', phase: 'reporting', owner: 'us-strategy', cadence: 'monthly', isActive: true, order: 4, tiers: ['enterprise'], tracks: ['local', 'national', 'hybrid'] },
  { id: 'tpl-rpt-pr-2', taskId: 'PR-RPT-02', title: 'Conversion impact report', description: 'System generates → US reviews → Displays', phase: 'reporting', owner: 'system', cadence: 'monthly', isActive: true, order: 5, tiers: ['enterprise'], tracks: ['local', 'national', 'hybrid'] },

  // Enterprise Tier Additions
  { id: 'tpl-rpt-en-1', taskId: 'EN-RPT-01', title: 'Executive KPI dashboard', description: 'System generates → Validates → Displays', phase: 'reporting', owner: 'system', cadence: 'monthly', isActive: true, order: 6, tiers: ['enterprise'], tracks: ['local', 'national', 'hybrid'] },
  { id: 'tpl-rpt-en-2', taskId: 'EN-RPT-02', title: 'Quarterly executive review', description: 'US Strategy drafts → Reviews → Presents', phase: 'reporting', owner: 'us-strategy', cadence: 'quarterly', isActive: true, order: 7, tiers: ['enterprise'], tracks: ['local', 'national', 'hybrid'] },

  // ========== FAILURE MONITORING & RECOVERY ==========
  // Starter Tier (available in all tiers)
  { id: 'tpl-fmr-st-1', taskId: 'ST-FMR-01', title: 'GBP suspension alert', description: 'System detects → Notifies → Escalates', phase: 'monitoring', owner: 'system', cadence: 'ongoing', isActive: true, order: 1, tiers: ['starter', 'growth', 'enterprise'], tracks: ['local', 'national', 'hybrid'] },
  { id: 'tpl-fmr-st-2', taskId: 'ST-FMR-02', title: 'Issue diagnosis & recovery', description: 'India SEO diagnoses → US approves → Closes', phase: 'monitoring', owner: 'seo-head', cadence: 'ongoing', isActive: true, order: 2, tiers: ['starter', 'growth', 'enterprise'], tracks: ['local', 'national', 'hybrid'] },

  // Growth Tier Additions (available in growth, enterprise)
  { id: 'tpl-fmr-gr-1', taskId: 'GR-FMR-01', title: 'Ranking anomaly detection', description: 'System detects → Alerts → Escalates', phase: 'monitoring', owner: 'system', cadence: 'ongoing', isActive: true, order: 3, tiers: ['growth', 'enterprise'], tracks: ['local', 'national', 'hybrid'] },
  { id: 'tpl-fmr-gr-2', taskId: 'GR-FMR-02', title: 'Controlled remediation', description: 'India SEO fixes → US approves → Closes', phase: 'monitoring', owner: 'seo-head', cadence: 'ongoing', isActive: true, order: 4, tiers: ['growth', 'enterprise'], tracks: ['local', 'national', 'hybrid'] },

  // Pro Tier Additions (available in enterprise)
  { id: 'tpl-fmr-pr-1', taskId: 'PR-FMR-01', title: 'Active GBP recovery', description: 'India SEO recovers → US approves → Closes', phase: 'monitoring', owner: 'seo-head', cadence: 'ongoing', isActive: true, order: 5, tiers: ['enterprise'], tracks: ['local', 'national', 'hybrid'] },

  // Enterprise Tier Additions
  { id: 'tpl-fmr-en-1', taskId: 'EN-FMR-01', title: 'SLA-based emergency recovery', description: 'US Strategy detects → Leads → Resolves', phase: 'monitoring', owner: 'us-strategy', cadence: 'ongoing', isActive: true, order: 6, tiers: ['enterprise'], tracks: ['local', 'national', 'hybrid'] },
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
  { id: 'admin-1', name: 'Alex Thompson', email: 'alex@seosuite.com', password: 'password123', role: 'admin' },
  { id: 'us-1', name: 'Sarah Mitchell', email: 'sarah@seosuite.com', password: 'password123', role: 'us-strategy', isDefaultAssociate: true, emailNotificationsEnabled: true },
  { id: 'us-2', name: 'Marcus Bloom', email: 'marcus@seosuite.com', password: 'password123', role: 'us-strategy', emailNotificationsEnabled: false },
  { id: 'seo-head-1', name: 'Robert Harrison', email: 'robert@seosuite.com', password: 'password123', role: 'seo-head', isDefaultAssociate: true, emailNotificationsEnabled: true },
  { id: 'seo-head-2', name: 'Vikram Singh', email: 'vikram@seosuite.com', password: 'password123', role: 'seo-head', emailNotificationsEnabled: true },
  { id: 'seo-junior-1', name: 'Jennifer Davis', email: 'jennifer@seosuite.com', password: 'password123', role: 'seo-junior', isDefaultAssociate: true, emailNotificationsEnabled: true },
  { id: 'seo-junior-2', name: 'Amit Patel', email: 'amit@seosuite.com', password: 'password123', role: 'seo-junior', emailNotificationsEnabled: true },
  // Client users (linked to clients)
  { id: 'client-1', name: 'John Martinez', email: 'john@acmeplumbing.com', password: 'password123', role: 'client', emailNotificationsEnabled: true },
  { id: 'client-2', name: 'Emily Chen', email: 'emily@greenscapelandscaping.com', password: 'password123', role: 'client', emailNotificationsEnabled: true },
  { id: 'client-3', name: 'Michael Brown', email: 'michael@eliteautorepair.com', password: 'password123', role: 'client', emailNotificationsEnabled: false },
  { id: 'client-4', name: 'Sarah Williams', email: 'sarah@homecleanpro.com', password: 'password123', role: 'client', emailNotificationsEnabled: true },
  { id: 'client-5', name: 'David Kim', email: 'david@techstart.io', password: 'password123', role: 'client', emailNotificationsEnabled: true },
];

// Tasks now include clientId for multi-client support
export interface TaskWithClient extends Task {
  clientId: string;
}

export const mockTasks: TaskWithClient[] = [
  // Client 1 - Acme Plumbing (Growth tier)
  {
    id: '1',
    taskId: 'ST-ONB-01',
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
    taskId: 'ST-ONB-02',
    title: 'Upload 20+ business photos',
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
    taskId: 'ST-ONB-03',
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
    taskId: 'ST-ONB-04',
    title: 'Onboarding call (1 hour)',
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
    taskId: 'GR-ONB-01',
    title: 'GBP & GSC access collection',
    description: 'Collect Google Business Profile and Google Search Console access.',
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
    id: '6',
    taskId: 'GR-ONB-02',
    title: 'Competitor & keyword intake',
    description: 'Analyze competitors and collect keyword targets.',
    phase: 'onboarding',
    owner: 'us-strategy',
    status: 'in-progress',
    comments: [],
    documents: [],
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-18'),
    clientId: 'client-1'
  },
  {
    id: '7',
    taskId: 'ST-FND-01',
    title: 'GBP audit & baseline snapshot',
    description: 'Complete comprehensive audit of current GBP status.',
    phase: 'foundation',
    owner: 'us-strategy',
    assignedTo: 'seo-junior-1',
    status: 'submitted',
    comments: [
      { id: 'c2', userId: 'seo-junior-1', userName: 'Jennifer Davis', userRole: 'seo-junior', content: 'Comprehensive GBP audit completed. Found several keyword placement opportunities in the service descriptions.', createdAt: new Date('2024-01-22') }
    ],
    documents: [],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-22'),
    clientId: 'client-1'
  },
  {
    id: '8',
    taskId: 'ST-FND-02',
    title: 'Initial GBP optimization',
    description: 'Optimize GBP profile based on audit findings.',
    phase: 'foundation',
    owner: 'seo-head',
    status: 'pending',
    comments: [
      { id: 'c3', userId: 'client-1', userName: 'John Doe', userRole: 'client', content: 'When can we expect this to be finished?', createdAt: new Date() }
    ],
    documents: [],
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
    clientId: 'client-1'
  },
  {
    id: '9',
    taskId: 'GR-FND-01',
    title: 'Deep GBP audit',
    description: 'In-depth audit of GBP for Growth tier clients.',
    phase: 'foundation',
    owner: 'seo-head',
    status: 'pending',
    comments: [],
    documents: [],
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
    clientId: 'client-1'
  },

  {
    id: '11',
    taskId: 'GR-EXE-01',
    title: 'Publish 4 Google Posts',
    description: 'Create and publish 4 monthly Google Business posts for Growth tier.',
    phase: 'execution',
    owner: 'seo-head',
    status: 'pending',
    cadence: 'monthly',
    comments: [],
    documents: [],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    clientId: 'client-1'
  },
  {
    id: '11-w',
    taskId: 'ST-EXE-01-W',
    title: 'Weekly Performance Audit',
    description: 'Weekly review of Google Business Profile insights and ranking positions.',
    phase: 'execution',
    owner: 'seo-head',
    status: 'in-progress',
    cadence: 'weekly',
    comments: [],
    documents: [],
    createdAt: new Date('2026-01-08'),
    updatedAt: new Date('2026-01-08'),
    clientId: 'client-1'
  },
  {
    id: '12',
    taskId: 'ST-AEO-01',
    title: 'AI visibility testing (10 prompts)',
    description: 'Test AI visibility with 10 prompts monthly.',
    phase: 'ai',
    owner: 'seo-head',
    status: 'pending',
    cadence: 'monthly',
    comments: [],
    documents: [],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    clientId: 'client-1'
  },
  {
    id: '13',
    taskId: 'GR-AEO-01',
    title: 'AI visibility testing (20 prompts)',
    description: 'Test AI visibility with 20 prompts for Growth tier.',
    phase: 'ai',
    owner: 'seo-head',
    status: 'pending',
    cadence: 'monthly',
    comments: [],
    documents: [],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    clientId: 'client-1'
  },
  {
    id: '14',
    taskId: 'ST-RPT-01',
    title: 'Dashboard update',
    description: 'Monthly dashboard update with latest metrics.',
    phase: 'reporting',
    owner: 'system',
    status: 'approved',
    cadence: 'monthly',
    comments: [],
    documents: [],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    clientId: 'client-1'
  },
  {
    id: '15',
    taskId: 'ST-FMR-01',
    title: 'GBP suspension alert',
    description: 'Monitor for GBP suspension and alert if detected.',
    phase: 'monitoring',
    owner: 'system',
    status: 'approved',
    cadence: 'ongoing',
    comments: [],
    documents: [],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    clientId: 'client-1'
  },

  // Client 2 - GreenScape Landscaping (Starter tier)
  {
    id: '16',
    taskId: 'ST-ONB-01',
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
    id: '17',
    taskId: 'ST-ONB-02',
    title: 'Upload 20+ business photos',
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
    id: '18',
    taskId: 'ST-ONB-03',
    title: 'Submit service descriptions',
    description: 'Provide detailed descriptions of all services offered.',
    phase: 'onboarding',
    owner: 'client',
    status: 'in-progress',
    comments: [],
    documents: [],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-23'),
    clientId: 'client-2'
  },
  {
    id: '19',
    taskId: 'ST-ONB-04',
    title: 'Onboarding call (1 hour)',
    description: 'Schedule and conduct initial strategy call with client.',
    phase: 'onboarding',
    owner: 'us-strategy',
    status: 'approved',
    comments: [],
    documents: [],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-24'),
    clientId: 'client-2'
  },
  {
    id: '20',
    taskId: 'ST-FND-01',
    title: 'GBP audit & baseline snapshot',
    description: 'Complete comprehensive audit of current GBP status.',
    phase: 'foundation',
    owner: 'seo-head',
    status: 'in-progress',
    comments: [],
    documents: [],
    createdAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26'),
    clientId: 'client-2'
  },
  {
    id: '21',
    taskId: 'ST-FND-02',
    title: 'Initial GBP optimization',
    description: 'Optimize GBP profile based on audit findings.',
    phase: 'foundation',
    owner: 'seo-head',
    status: 'pending',
    comments: [],
    documents: [],
    createdAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26'),
    clientId: 'client-2'
  },
  {
    id: '22',
    taskId: 'ST-FND-03',
    title: 'LocalBusiness + FAQ schema',
    description: 'Implement LocalBusiness and FAQ structured data.',
    phase: 'foundation',
    owner: 'seo-head',
    status: 'pending',
    comments: [],
    documents: [],
    createdAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26'),
    clientId: 'client-2'
  },
  {
    id: '23',
    taskId: 'ST-EXE-01',
    title: 'Publish 2 Google Posts',
    description: 'Create and publish monthly Google Business posts.',
    phase: 'execution',
    owner: 'seo-head',
    status: 'pending',
    cadence: 'monthly',
    comments: [],
    documents: [],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    clientId: 'client-2'
  },
  {
    id: '24',
    taskId: 'ST-EXE-02',
    title: 'Seed 3 GBP Q&As',
    description: 'Create and seed 3 Q&A pairs on GBP.',
    phase: 'execution',
    owner: 'seo-head',
    status: 'pending',
    cadence: 'monthly',
    comments: [],
    documents: [],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    clientId: 'client-2'
  },
  {
    id: '25',
    taskId: 'ST-AEO-01',
    title: 'AI visibility testing (10 prompts)',
    description: 'Test AI visibility with 10 prompts monthly.',
    phase: 'ai',
    owner: 'seo-head',
    status: 'pending',
    cadence: 'monthly',
    comments: [],
    documents: [],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    clientId: 'client-2'
  },
  {
    id: '26',
    taskId: 'ST-AEO-02',
    title: 'AI mention score logging',
    description: 'Log and track AI mention scores.',
    phase: 'ai',
    owner: 'seo-head',
    status: 'pending',
    cadence: 'monthly',
    comments: [],
    documents: [],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    clientId: 'client-2'
  },
  {
    id: '27',
    taskId: 'ST-RPT-01',
    title: 'Dashboard update',
    description: 'Monthly dashboard update with latest metrics.',
    phase: 'reporting',
    owner: 'system',
    status: 'pending',
    cadence: 'monthly',
    comments: [],
    documents: [],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    clientId: 'client-2'
  },
  {
    id: '28',
    taskId: 'ST-RPT-02',
    title: 'Monthly summary email',
    description: 'Send monthly summary email to client.',
    phase: 'reporting',
    owner: 'seo-head',
    status: 'pending',
    cadence: 'monthly',
    comments: [],
    documents: [],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    clientId: 'client-2'
  },
  {
    id: '29',
    taskId: 'ST-FMR-01',
    title: 'GBP suspension alert',
    description: 'Monitor for GBP suspension and alert if detected.',
    phase: 'monitoring',
    owner: 'system',
    status: 'approved',
    cadence: 'ongoing',
    comments: [],
    documents: [],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    clientId: 'client-2'
  },
  {
    id: '30',
    taskId: 'ST-FMR-02',
    title: 'Issue diagnosis & recovery',
    description: 'Diagnose and recover from any GBP issues.',
    phase: 'monitoring',
    owner: 'seo-head',
    status: 'pending',
    cadence: 'ongoing',
    comments: [],
    documents: [],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    clientId: 'client-2'
  },

  // Client 3 - Elite Auto Repair (Enterprise tier)
  {
    id: '31',
    taskId: 'ST-ONB-01',
    title: 'Provide GBP access',
    description: 'Share Google Business Profile access credentials with the team.',
    phase: 'onboarding',
    owner: 'client',
    status: 'approved',
    comments: [],
    documents: [],
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-06'),
    clientId: 'client-3'
  },
  {
    id: '32',
    taskId: 'ST-ONB-02',
    title: 'Upload 20+ business photos',
    description: 'Upload high-quality photos of your business, team, and services.',
    phase: 'onboarding',
    owner: 'client',
    status: 'in-progress',
    comments: [],
    documents: [],
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-07'),
    clientId: 'client-3'
  },
  {
    id: '33',
    taskId: 'ST-ONB-03',
    title: 'Submit service descriptions',
    description: 'Provide detailed descriptions of all services offered.',
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
    id: '34',
    taskId: 'ST-ONB-04',
    title: 'Onboarding call (1 hour)',
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
  {
    id: '35',
    taskId: 'GR-ONB-01',
    title: 'GBP & GSC access collection',
    description: 'Collect Google Business Profile and Google Search Console access.',
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
    id: '36',
    taskId: 'GR-ONB-02',
    title: 'Competitor & keyword intake',
    description: 'Analyze competitors and collect keyword targets.',
    phase: 'onboarding',
    owner: 'us-strategy',
    status: 'pending',
    comments: [],
    documents: [],
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
    clientId: 'client-3'
  },
  {
    id: '37',
    taskId: 'PR-ONB-01',
    title: 'Conversion funnel review',
    description: 'Review and analyze conversion funnel for Enterprise tier.',
    phase: 'onboarding',
    owner: 'us-strategy',
    status: 'pending',
    comments: [],
    documents: [],
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
    clientId: 'client-3'
  },
  {
    id: '38',
    taskId: 'PR-ONB-02',
    title: 'Brand positioning analysis',
    description: 'Analyze brand positioning for Enterprise tier.',
    phase: 'onboarding',
    owner: 'us-strategy',
    status: 'pending',
    comments: [],
    documents: [],
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
    clientId: 'client-3'
  },
  {
    id: '39',
    taskId: 'EN-ONB-01',
    title: 'Multi-location & brand intake',
    description: 'Multi-location and brand intake for Enterprise tier.',
    phase: 'onboarding',
    owner: 'us-strategy',
    status: 'pending',
    comments: [],
    documents: [],
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
    clientId: 'client-3'
  },
  {
    id: '40',
    taskId: 'EN-ONB-02',
    title: 'Executive kickoff workshop',
    description: 'Conduct executive kickoff workshop for Enterprise tier.',
    phase: 'onboarding',
    owner: 'us-strategy',
    status: 'pending',
    comments: [],
    documents: [],
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
    clientId: 'client-3'
  },
  {
    id: '41',
    taskId: 'ST-FND-01',
    title: 'GBP audit & baseline snapshot',
    description: 'Complete comprehensive audit of current GBP status.',
    phase: 'foundation',
    owner: 'seo-head',
    status: 'pending',
    comments: [],
    documents: [],
    createdAt: new Date('2024-02-08'),
    updatedAt: new Date('2024-02-08'),
    clientId: 'client-3'
  },
  {
    id: '42',
    taskId: 'EN-FND-01',
    title: 'Entity & brand schema',
    description: 'Design and implement entity and brand schema for Enterprise.',
    phase: 'foundation',
    owner: 'us-strategy',
    status: 'pending',
    comments: [],
    documents: [],
    createdAt: new Date('2024-02-08'),
    updatedAt: new Date('2024-02-08'),
    clientId: 'client-3'
  },
  {
    id: '43',
    taskId: 'EN-FND-02',
    title: 'Multi-location schema build',
    description: 'Build multi-location schema for Enterprise tier.',
    phase: 'foundation',
    owner: 'seo-head',
    status: 'pending',
    comments: [],
    documents: [],
    createdAt: new Date('2024-02-08'),
    updatedAt: new Date('2024-02-08'),
    clientId: 'client-3'
  },
  {
    id: '44',
    taskId: 'EN-EXE-01',
    title: 'Weekly content & GBP cadence',
    description: 'Weekly content publishing for Enterprise tier.',
    phase: 'execution',
    owner: 'seo-head',
    status: 'pending',
    cadence: 'weekly',
    comments: [],
    documents: [],
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
    clientId: 'client-3'
  },
  {
    id: '45',
    taskId: 'EN-AEO-01',
    title: 'AI brand-defense monitoring',
    description: 'Monitor AI brand mentions for Enterprise tier.',
    phase: 'ai',
    owner: 'us-strategy',
    status: 'pending',
    cadence: 'ongoing',
    comments: [],
    documents: [],
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
    clientId: 'client-3'
  },
  {
    id: '46',
    taskId: 'EN-RPT-01',
    title: 'Executive KPI dashboard',
    description: 'Generate executive KPI dashboard for Enterprise tier.',
    phase: 'reporting',
    owner: 'system',
    status: 'pending',
    cadence: 'monthly',
    comments: [],
    documents: [],
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
    clientId: 'client-3'
  },
  {
    id: '47',
    taskId: 'EN-RPT-02',
    title: 'Quarterly executive review',
    description: 'Quarterly executive review for Enterprise tier.',
    phase: 'reporting',
    owner: 'us-strategy',
    status: 'pending',
    cadence: 'quarterly',
    comments: [],
    documents: [],
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
    clientId: 'client-3'
  },
  {
    id: '48',
    taskId: 'EN-FMR-01',
    title: 'SLA-based emergency recovery',
    description: 'SLA-based emergency recovery for Enterprise tier.',
    phase: 'monitoring',
    owner: 'us-strategy',
    status: 'pending',
    cadence: 'ongoing',
    comments: [],
    documents: [],
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
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
  'client-5': {
    localPackVisibility: 15,
    gbpViews: 340,
    aiMentionScore: 1.2,
    tasksCompleted: 1,
    totalTasks: 5,
  },
};

export const mockLoginHistory: LoginHistory[] = [
  { id: 'log-1', userId: 'client-1', userName: 'John Martinez', ipAddress: '192.168.1.1', sessionTime: '45m', loginTime: new Date('2024-03-10T10:00:00') },
  { id: 'log-2', userId: 'client-1', userName: 'John Martinez', ipAddress: '192.168.1.1', sessionTime: '1h 20m', loginTime: new Date('2024-03-09T14:30:00') },
  { id: 'log-3', userId: 'client-2', userName: 'Emily Chen', ipAddress: '10.0.0.5', sessionTime: '25m', loginTime: new Date('2024-03-10T09:15:00') },
  { id: 'log-4', userId: 'client-5', userName: 'David Kim', ipAddress: '172.16.0.22', sessionTime: '5m', loginTime: new Date('2026-01-11T16:20:00') },
];

export const mockPlans: SubscriptionPlan[] = [
  {
    id: 'plan-starter-monthly',
    name: 'Starter Monthly',
    tier: 'starter',
    track: 'local',
    price: 299,
    billingCycle: 'monthly',
    isActive: true,
    isArchived: false,
    isSetupFeeApplicable: true,
    features: ['Basic GBP Audit', '2 Google Posts/mo', 'Monthly Reporting']
  },
  {
    id: 'plan-growth-monthly',
    name: 'Growth Monthly',
    tier: 'growth',
    track: 'local',
    price: 599,
    billingCycle: 'monthly',
    isActive: true,
    isArchived: false,
    isSetupFeeApplicable: true,
    features: ['Deep GBP Audit', '4 Google Posts/mo', 'Bi-monthly Strategy']
  },
  {
    id: 'plan-enterprise-monthly',
    name: 'Enterprise Monthly',
    tier: 'enterprise',
    track: 'local',
    price: 999,
    billingCycle: 'monthly',
    isActive: true,
    isArchived: false,
    features: ['Multi-location schema', 'Weekly Posts', 'Executive Review']
  },
  {
    id: 'plan-nat-starter-monthly',
    name: 'National Starter',
    tier: 'starter',
    track: 'national',
    price: 499,
    billingCycle: 'monthly',
    isActive: true,
    isArchived: false,
    isSetupFeeApplicable: true,
    features: ['National Keyword Research', 'Competitor Analysis', 'Monthly Reporting']
  },
  {
    id: 'plan-nat-growth-monthly',
    name: 'National Growth',
    tier: 'growth',
    track: 'national',
    price: 999,
    billingCycle: 'monthly',
    isActive: true,
    isArchived: false,
    isSetupFeeApplicable: true,
    features: ['Content Strategy', 'Backlink Building', 'BI Dashboards']
  },
  {
    id: 'plan-hyb-growth-monthly',
    name: 'Hybrid Growth',
    tier: 'growth',
    track: 'hybrid',
    price: 1299,
    billingCycle: 'monthly',
    isActive: true,
    isArchived: false,
    isSetupFeeApplicable: true,
    features: ['Local & National SEO', 'Hybrid Search Strategy', 'Custom Workflows']
  }
];

export const mockDiscounts: Discount[] = [
  {
    id: 'disc-1',
    code: 'WELCOME20',
    type: 'percentage',
    value: 20,
    appliesTo: 'one-time',
    usedCount: 5,
    isActive: true,
    validUpto: new Date('2026-12-31')
  },
  {
    id: 'disc-2',
    code: 'STARTUP50',
    type: 'fixed',
    value: 50,
    appliesTo: 'recurring',
    recurringDuration: 3,
    usedCount: 12,
    isActive: true,
    validUpto: new Date('2026-06-30')
  }
];

export const mockPhaseConfigs: PhaseConfig[] = [
  { id: 'ph-1', name: 'Onboarding & Intake', slug: 'onboarding', order: 1, successor: 'foundation', isActive: true },
  { id: 'ph-2', name: 'Foundation Setup', slug: 'foundation', order: 2, predecessor: 'onboarding', successor: 'execution', isActive: true },
  { id: 'ph-3', name: 'Monthly Execution', slug: 'execution', order: 3, predecessor: 'foundation', successor: 'ai', isActive: true },
  { id: 'ph-4', name: 'AI / AEO Optimization', slug: 'ai', order: 4, predecessor: 'execution', successor: 'reporting', isActive: true },
  { id: 'ph-5', name: 'Reporting & Strategy', slug: 'reporting', order: 5, predecessor: 'ai', successor: 'monitoring', isActive: true },
  { id: 'ph-6', name: 'Failure Monitoring', slug: 'monitoring', order: 6, predecessor: 'reporting', isActive: true }
];

export const mockPackages: Package[] = [
  { id: 'pkg-1', tier: 'starter', track: 'local', setupCost: 499 },
  { id: 'pkg-2', tier: 'growth', track: 'local', setupCost: 999 },
  { id: 'pkg-3', tier: 'enterprise', track: 'local', setupCost: 1999 },
  { id: 'pkg-4', tier: 'starter', track: 'national', setupCost: 799 },
  { id: 'pkg-5', tier: 'growth', track: 'national', setupCost: 1499 },
  { id: 'pkg-6', tier: 'enterprise', track: 'national', setupCost: 2999 },
  { id: 'pkg-7', tier: 'starter', track: 'hybrid', setupCost: 999 },
  { id: 'pkg-8', tier: 'growth', track: 'hybrid', setupCost: 1999 },
  { id: 'pkg-9', tier: 'enterprise', track: 'hybrid', setupCost: 3999 }
];

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
