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

// Task templates for phase configuration - organized by tier
export const mockTaskTemplates: TaskTemplate[] = [
  // ========== ONBOARDING & INTAKE - All Tiers ==========
  { id: 'tpl-onb-1', taskId: 'ST-ONB-001', title: 'Provide GBP access', description: 'Required to proceed - share Google Business Profile access credentials.', phase: 'onboarding', owner: 'client', cadence: 'once', isActive: true, order: 1, tiers: ['starter', 'growth', 'enterprise'] },
  { id: 'tpl-onb-2', taskId: 'ST-ONB-002', title: 'Upload 20+ photos', description: 'Client-assisted upload of high-quality photos of business, team, and services.', phase: 'onboarding', owner: 'client', cadence: 'once', isActive: true, order: 2, tiers: ['starter', 'growth', 'enterprise'] },
  { id: 'tpl-onb-3', taskId: 'ST-ONB-003', title: 'Submit service descriptions', description: 'Structured intake of detailed descriptions for all services offered.', phase: 'onboarding', owner: 'client', cadence: 'once', isActive: true, order: 3, tiers: ['starter', 'growth', 'enterprise'] },
  { id: 'tpl-onb-4', taskId: 'ST-ONB-004', title: 'Conduct onboarding call (1 hr)', description: 'Set expectations and lock scope with initial strategy call.', phase: 'onboarding', owner: 'us-strategy', cadence: 'once', isActive: true, order: 4, tiers: ['starter', 'growth', 'enterprise'] },
  { id: 'tpl-onb-5', taskId: 'ST-ONB-005', title: 'Verify access & completeness', description: 'Confirm all client-provided access and materials are complete. Blocker if incomplete.', phase: 'onboarding', owner: 'india-head', cadence: 'once', isActive: true, order: 5, tiers: ['starter', 'growth', 'enterprise'] },

  // ========== FOUNDATION SETUP - Starter Tier ==========
  { id: 'tpl-fnd-st-1', taskId: 'ST-FND-001', title: 'GBP audit & baseline snapshot', description: 'Complete comprehensive audit of current GBP status.', phase: 'foundation', owner: 'india-head', cadence: 'once', isActive: true, order: 1, tiers: ['starter', 'growth', 'enterprise'] },
  { id: 'tpl-fnd-st-2', taskId: 'ST-FND-002', title: 'Initial GBP optimization', description: 'One-time baseline optimization for GBP profile.', phase: 'foundation', owner: 'india-head', cadence: 'once', isActive: true, order: 2, tiers: ['starter', 'growth', 'enterprise'] },
  { id: 'tpl-fnd-st-3', taskId: 'ST-FND-003', title: 'Location page audit (no fixes)', description: 'Audit client website location pages for local SEO without implementing fixes.', phase: 'foundation', owner: 'india-head', cadence: 'once', isActive: true, order: 3, tiers: ['starter', 'growth', 'enterprise'] },
  { id: 'tpl-fnd-st-4', taskId: 'ST-FND-004', title: 'Core citation submission (5–10)', description: 'Submit basic citations to core directories.', phase: 'foundation', owner: 'india-head', cadence: 'once', isActive: true, order: 4, tiers: ['starter', 'growth', 'enterprise'] },
  { id: 'tpl-fnd-st-5', taskId: 'ST-FND-005', title: 'Local Business schema', description: 'Implement basic Local Business schema markup.', phase: 'foundation', owner: 'india-head', cadence: 'once', isActive: true, order: 5, tiers: ['starter', 'growth', 'enterprise'] },

  // ========== FOUNDATION SETUP - Growth Tier Enhancements ==========
  { id: 'tpl-fnd-gr-1', taskId: 'GR-FND-001', title: 'Monthly GBP optimization', description: 'Ongoing monthly optimization of GBP profile.', phase: 'foundation', owner: 'india-head', cadence: 'monthly', isActive: true, order: 6, tiers: ['growth', 'enterprise'] },
  { id: 'tpl-fnd-gr-2', taskId: 'GR-FND-002', title: 'Full location page optimization', description: 'Complete optimization of location pages with fixes.', phase: 'foundation', owner: 'india-head', cadence: 'once', isActive: true, order: 7, tiers: ['growth', 'enterprise'] },
  { id: 'tpl-fnd-gr-3', taskId: 'GR-FND-003', title: 'Organization schema', description: 'Implement comprehensive Organization schema markup.', phase: 'foundation', owner: 'india-head', cadence: 'once', isActive: true, order: 8, tiers: ['growth', 'enterprise'] },
  { id: 'tpl-fnd-gr-4', taskId: 'GR-FND-004', title: 'Expanded citation set (15–20)', description: 'Extended citation submission to 15-20 directories.', phase: 'foundation', owner: 'india-head', cadence: 'once', isActive: true, order: 9, tiers: ['growth', 'enterprise'] },

  // ========== FOUNDATION SETUP - Pro/Enterprise Tier ==========
  { id: 'tpl-fnd-pr-1', taskId: 'PR-FND-001', title: 'Bi-weekly GBP optimization', description: 'Continuous bi-weekly optimization of GBP profile.', phase: 'foundation', owner: 'india-head', cadence: 'bi-weekly', isActive: true, order: 10, tiers: ['enterprise'] },
  { id: 'tpl-fnd-pr-2', taskId: 'PR-FND-002', title: 'Advanced page rewrites', description: 'Complete rewrite and optimization of key pages.', phase: 'foundation', owner: 'india-head', cadence: 'once', isActive: true, order: 11, tiers: ['enterprise'] },
  { id: 'tpl-fnd-pr-3', taskId: 'PR-FND-003', title: 'Speakable schema', description: 'Implement Speakable schema for voice search optimization.', phase: 'foundation', owner: 'india-head', cadence: 'once', isActive: true, order: 12, tiers: ['enterprise'] },
  { id: 'tpl-fnd-pr-4', taskId: 'PR-FND-004', title: 'Weekly site health monitoring', description: 'Continuous weekly monitoring of site health and performance.', phase: 'foundation', owner: 'india-head', cadence: 'weekly', isActive: true, order: 13, tiers: ['enterprise'] },

  // ========== MONTHLY EXECUTION - Starter Tier ==========
  { id: 'tpl-exe-st-1', taskId: 'ST-EXE-001', title: 'Publish 2 Google Posts', description: 'Create and publish monthly Google Business posts.', phase: 'execution', owner: 'india-head', cadence: 'monthly', isActive: true, order: 1, tiers: ['starter', 'growth', 'enterprise'] },
  { id: 'tpl-exe-st-2', taskId: 'ST-EXE-002', title: 'Seed 3 GBP Q&As', description: 'Add 3 relevant Q&A content to GBP monthly.', phase: 'execution', owner: 'india-head', cadence: 'monthly', isActive: true, order: 2, tiers: ['starter', 'growth', 'enterprise'] },
  { id: 'tpl-exe-st-3', taskId: 'ST-EXE-003', title: 'Publish 1 AI-assisted blog', description: 'Create and publish one AI-assisted blog post monthly.', phase: 'execution', owner: 'india-head', cadence: 'monthly', isActive: true, order: 3, tiers: ['starter', 'growth', 'enterprise'] },
  { id: 'tpl-exe-st-4', taskId: 'ST-EXE-004', title: 'Monitor reviews & alerts', description: 'Ongoing monitoring of reviews and alerts.', phase: 'execution', owner: 'india-head', cadence: 'ongoing', isActive: true, order: 4, tiers: ['starter', 'growth', 'enterprise'] },
  { id: 'tpl-exe-st-5', taskId: 'ST-EXE-005', title: 'Approve posts (quick)', description: 'Client quick approval of posts weekly.', phase: 'execution', owner: 'client', cadence: 'weekly', isActive: true, order: 5, tiers: ['starter', 'growth', 'enterprise'] },

  // ========== MONTHLY EXECUTION - Growth Tier ==========
  { id: 'tpl-exe-gr-1', taskId: 'GR-EXE-001', title: 'Publish 4 Google Posts', description: 'Create and publish 4 Google Business posts monthly.', phase: 'execution', owner: 'india-head', cadence: 'monthly', isActive: true, order: 6, tiers: ['growth', 'enterprise'] },
  { id: 'tpl-exe-gr-2', taskId: 'GR-EXE-002', title: 'Seed 5 GBP Q&As', description: 'Add 5 relevant Q&A content to GBP monthly.', phase: 'execution', owner: 'india-head', cadence: 'monthly', isActive: true, order: 7, tiers: ['growth', 'enterprise'] },
  { id: 'tpl-exe-gr-3', taskId: 'GR-EXE-003', title: 'Publish 2 blog posts', description: 'Create and publish 2 blog posts monthly.', phase: 'execution', owner: 'india-head', cadence: 'monthly', isActive: true, order: 8, tiers: ['growth', 'enterprise'] },
  { id: 'tpl-exe-gr-4', taskId: 'GR-EXE-004', title: 'FAQ expansion (8 Qs)', description: 'Expand FAQ section with 8 new questions monthly.', phase: 'execution', owner: 'india-head', cadence: 'monthly', isActive: true, order: 9, tiers: ['growth', 'enterprise'] },
  { id: 'tpl-exe-gr-5', taskId: 'GR-EXE-005', title: 'Technical SEO audit', description: 'Monthly technical SEO audit and fixes.', phase: 'execution', owner: 'india-head', cadence: 'monthly', isActive: true, order: 10, tiers: ['growth', 'enterprise'] },
  { id: 'tpl-exe-gr-6', taskId: 'GR-EXE-006', title: 'Case study inputs', description: 'Gather client inputs for case study quarterly.', phase: 'execution', owner: 'client', cadence: 'quarterly', isActive: true, order: 11, tiers: ['growth', 'enterprise'] },

  // ========== MONTHLY EXECUTION - Pro/Enterprise Tier ==========
  { id: 'tpl-exe-pr-1', taskId: 'PR-EXE-001', title: 'Publish 8 Google Posts', description: 'Create and publish 8 Google Business posts monthly.', phase: 'execution', owner: 'india-head', cadence: 'monthly', isActive: true, order: 12, tiers: ['enterprise'] },
  { id: 'tpl-exe-pr-2', taskId: 'PR-EXE-002', title: 'Seed 10 GBP Q&As', description: 'Add 10 relevant Q&A content to GBP monthly.', phase: 'execution', owner: 'india-head', cadence: 'monthly', isActive: true, order: 13, tiers: ['enterprise'] },
  { id: 'tpl-exe-pr-3', taskId: 'PR-EXE-003', title: 'Publish 3–4 blog posts', description: 'Create and publish 3-4 blog posts monthly.', phase: 'execution', owner: 'india-head', cadence: 'monthly', isActive: true, order: 14, tiers: ['enterprise'] },
  { id: 'tpl-exe-pr-4', taskId: 'PR-EXE-004', title: 'Case studies', description: 'Create detailed case studies bi-monthly.', phase: 'execution', owner: 'india-head', cadence: 'bi-monthly', isActive: true, order: 15, tiers: ['enterprise'] },
  { id: 'tpl-exe-pr-5', taskId: 'PR-EXE-005', title: 'Industry directory placements', description: 'Monthly submission to industry-specific directories.', phase: 'execution', owner: 'india-head', cadence: 'monthly', isActive: true, order: 16, tiers: ['enterprise'] },

  // ========== AI / AEO OPTIMIZATION - Starter Tier ==========
  { id: 'tpl-ai-st-1', taskId: 'ST-AEO-001', title: 'Run AI visibility test (10 prompts)', description: 'Test AI visibility with 10 prompts.', phase: 'ai', owner: 'india-head', cadence: 'monthly', isActive: true, order: 1, tiers: ['starter', 'growth', 'enterprise'], notes: 'Starter does NOT include proactive AI content rewrites' },
  { id: 'tpl-ai-st-2', taskId: 'ST-AEO-002', title: 'Log AI mention score (1–5)', description: 'Record AI mention score on a 1-5 scale.', phase: 'ai', owner: 'india-head', cadence: 'monthly', isActive: true, order: 2, tiers: ['starter', 'growth', 'enterprise'] },
  { id: 'tpl-ai-st-3', taskId: 'ST-AEO-003', title: 'Flag gaps (no remediation)', description: 'Identify and flag AI visibility gaps without remediation.', phase: 'ai', owner: 'india-head', cadence: 'monthly', isActive: true, order: 3, tiers: ['starter', 'growth', 'enterprise'] },

  // ========== AI / AEO OPTIMIZATION - Growth Tier ==========
  { id: 'tpl-ai-gr-1', taskId: 'GR-AEO-001', title: 'Run AI tests (20 prompts)', description: 'Test AI visibility with 20 prompts.', phase: 'ai', owner: 'india-head', cadence: 'monthly', isActive: true, order: 4, tiers: ['growth', 'enterprise'] },
  { id: 'tpl-ai-gr-2', taskId: 'GR-AEO-002', title: 'Rewrite FAQs for AI citation', description: 'Optimize FAQ content for better AI citation.', phase: 'ai', owner: 'india-head', cadence: 'monthly', isActive: true, order: 5, tiers: ['growth', 'enterprise'] },
  { id: 'tpl-ai-gr-3', taskId: 'GR-AEO-003', title: 'Competitor mention comparison', description: 'Analyze competitor AI mentions and compare.', phase: 'ai', owner: 'india-head', cadence: 'monthly', isActive: true, order: 6, tiers: ['growth', 'enterprise'] },
  { id: 'tpl-ai-gr-4', taskId: 'GR-AEO-004', title: 'AI visibility review', description: 'US Strategy review of AI visibility performance.', phase: 'ai', owner: 'us-strategy', cadence: 'monthly', isActive: true, order: 7, tiers: ['growth', 'enterprise'] },

  // ========== AI / AEO OPTIMIZATION - Pro/Enterprise Tier ==========
  { id: 'tpl-ai-pr-1', taskId: 'PR-AEO-001', title: 'Run AI tests (40–60 prompts)', description: 'Comprehensive AI visibility testing with 40-60 prompts.', phase: 'ai', owner: 'india-head', cadence: 'monthly', isActive: true, order: 8, tiers: ['enterprise'] },
  { id: 'tpl-ai-pr-2', taskId: 'PR-AEO-002', title: 'Controlled AI experiments', description: 'Run controlled experiments for AI optimization.', phase: 'ai', owner: 'india-head', cadence: 'monthly', isActive: true, order: 9, tiers: ['enterprise'] },
  { id: 'tpl-ai-pr-3', taskId: 'PR-AEO-003', title: 'AI content rewrites', description: 'Proactive content rewrites for AI optimization.', phase: 'ai', owner: 'india-head', cadence: 'monthly', isActive: true, order: 10, tiers: ['enterprise'] },
  { id: 'tpl-ai-pr-4', taskId: 'PR-AEO-004', title: 'AI strategy refinement', description: 'US Strategy refinement of AI approach.', phase: 'ai', owner: 'us-strategy', cadence: 'monthly', isActive: true, order: 11, tiers: ['enterprise'] },
  { id: 'tpl-ai-pr-5', taskId: 'PR-AEO-005', title: 'Escalate flat AI visibility after 60 days', description: 'Escalate if AI visibility shows no improvement after 60 days.', phase: 'ai', owner: 'us-strategy', cadence: 'once', isActive: true, order: 12, tiers: ['enterprise'] },

  // ========== REPORTING & STRATEGY - Starter Tier ==========
  { id: 'tpl-rpt-st-1', taskId: 'ST-RPT-001', title: 'Update dashboard', description: 'System-generated dashboard update.', phase: 'reporting', owner: 'system', cadence: 'monthly', isActive: true, order: 1, tiers: ['starter', 'growth', 'enterprise'] },
  { id: 'tpl-rpt-st-2', taskId: 'ST-RPT-002', title: 'Prepare monthly email summary', description: 'Create and send monthly progress email to client.', phase: 'reporting', owner: 'india-head', cadence: 'monthly', isActive: true, order: 2, tiers: ['starter', 'growth', 'enterprise'] },
  { id: 'tpl-rpt-st-3', taskId: 'ST-RPT-003', title: 'Quarterly strategy memo', description: 'US Strategy quarterly memo for client.', phase: 'reporting', owner: 'us-strategy', cadence: 'quarterly', isActive: true, order: 3, tiers: ['starter', 'growth', 'enterprise'] },

  // ========== REPORTING & STRATEGY - Growth Tier ==========
  { id: 'tpl-rpt-gr-1', taskId: 'GR-RPT-002', title: 'Monthly PDF report', description: 'Create comprehensive monthly PDF report.', phase: 'reporting', owner: 'india-head', cadence: 'monthly', isActive: true, order: 4, tiers: ['growth', 'enterprise'] },
  { id: 'tpl-rpt-gr-2', taskId: 'GR-RPT-003', title: 'Monthly strategy call', description: 'US Strategy monthly call with client.', phase: 'reporting', owner: 'us-strategy', cadence: 'monthly', isActive: true, order: 5, tiers: ['growth', 'enterprise'] },
  { id: 'tpl-rpt-gr-3', taskId: 'GR-RPT-004', title: 'Quarterly Business Review (QBR)', description: 'Comprehensive quarterly business review presentation.', phase: 'reporting', owner: 'us-strategy', cadence: 'quarterly', isActive: true, order: 6, tiers: ['growth', 'enterprise'] },

  // ========== REPORTING & STRATEGY - Pro/Enterprise Tier ==========
  { id: 'tpl-rpt-pr-1', taskId: 'PR-RPT-001', title: 'Real-time dashboard updates', description: 'Continuous real-time dashboard monitoring and updates.', phase: 'reporting', owner: 'system', cadence: 'ongoing', isActive: true, order: 7, tiers: ['enterprise'] },
  { id: 'tpl-rpt-pr-2', taskId: 'PR-RPT-002', title: 'Bi-weekly performance reports', description: 'Detailed bi-weekly performance reporting.', phase: 'reporting', owner: 'india-head', cadence: 'bi-weekly', isActive: true, order: 8, tiers: ['enterprise'] },
  { id: 'tpl-rpt-pr-3', taskId: 'PR-RPT-003', title: 'Bi-weekly strategy calls', description: 'US Strategy bi-weekly calls with client.', phase: 'reporting', owner: 'us-strategy', cadence: 'bi-weekly', isActive: true, order: 9, tiers: ['enterprise'] },
  { id: 'tpl-rpt-pr-4', taskId: 'PR-RPT-004', title: 'Quarterly QBR presentation', description: 'Executive quarterly business review presentation.', phase: 'reporting', owner: 'us-strategy', cadence: 'quarterly', isActive: true, order: 10, tiers: ['enterprise'] },
  { id: 'tpl-rpt-pr-5', taskId: 'PR-RPT-005', title: 'Scope review & upgrade advisory', description: 'Review scope and advise on potential tier upgrades.', phase: 'reporting', owner: 'us-strategy', cadence: 'quarterly', isActive: true, order: 11, tiers: ['enterprise'] },

  // ========== FAILURE MONITORING - Starter Tier ==========
  { id: 'tpl-mon-st-1', taskId: 'ST-MON-001', title: 'Weekly rank tracking', description: 'Monitor local pack rankings and positions weekly.', phase: 'monitoring', owner: 'india-head', cadence: 'weekly', isActive: true, order: 1, tiers: ['starter', 'growth', 'enterprise'] },
  { id: 'tpl-mon-st-2', taskId: 'ST-MON-002', title: 'GBP suspension monitoring', description: 'Monitor for GBP suspension or listing issues.', phase: 'monitoring', owner: 'india-head', cadence: 'ongoing', isActive: true, order: 2, tiers: ['starter', 'growth', 'enterprise'] },
  { id: 'tpl-mon-st-3', taskId: 'ST-MON-003', title: 'Review alerts & response', description: 'Monitor and respond to new review alerts.', phase: 'monitoring', owner: 'india-head', cadence: 'ongoing', isActive: true, order: 3, tiers: ['starter', 'growth', 'enterprise'] },

  // ========== FAILURE MONITORING - Growth Tier ==========
  { id: 'tpl-mon-gr-1', taskId: 'GR-MON-001', title: 'Competitor movement alerts', description: 'Track competitor ranking movements and changes.', phase: 'monitoring', owner: 'india-head', cadence: 'weekly', isActive: true, order: 4, tiers: ['growth', 'enterprise'] },
  { id: 'tpl-mon-gr-2', taskId: 'GR-MON-002', title: 'Citation health check', description: 'Monitor citation accuracy and consistency.', phase: 'monitoring', owner: 'india-head', cadence: 'monthly', isActive: true, order: 5, tiers: ['growth', 'enterprise'] },
  { id: 'tpl-mon-gr-3', taskId: 'GR-MON-003', title: 'Technical issue detection', description: 'Monitor for technical SEO issues and errors.', phase: 'monitoring', owner: 'india-head', cadence: 'weekly', isActive: true, order: 6, tiers: ['growth', 'enterprise'] },
  { id: 'tpl-mon-gr-4', taskId: 'GR-MON-004', title: 'Recovery action plan', description: 'Create recovery plans for detected issues.', phase: 'monitoring', owner: 'us-strategy', cadence: 'monthly', isActive: true, order: 7, tiers: ['growth', 'enterprise'] },

  // ========== FAILURE MONITORING - Enterprise Tier ==========
  { id: 'tpl-mon-pr-1', taskId: 'PR-MON-001', title: 'Real-time rank monitoring', description: 'Continuous real-time monitoring of rankings.', phase: 'monitoring', owner: 'system', cadence: 'ongoing', isActive: true, order: 8, tiers: ['enterprise'] },
  { id: 'tpl-mon-pr-2', taskId: 'PR-MON-002', title: 'Proactive issue prevention', description: 'Proactive identification and prevention of potential issues.', phase: 'monitoring', owner: 'india-head', cadence: 'weekly', isActive: true, order: 9, tiers: ['enterprise'] },
  { id: 'tpl-mon-pr-3', taskId: 'PR-MON-003', title: 'Escalation management', description: 'Priority escalation and resolution of critical issues.', phase: 'monitoring', owner: 'us-strategy', cadence: 'ongoing', isActive: true, order: 10, tiers: ['enterprise'] },
  { id: 'tpl-mon-pr-4', taskId: 'PR-MON-004', title: 'Recovery execution & reporting', description: 'Execute recovery actions and report on outcomes.', phase: 'monitoring', owner: 'india-head', cadence: 'weekly', isActive: true, order: 11, tiers: ['enterprise'] },
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