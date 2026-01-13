import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { TaskList } from '@/components/tasks/TaskList';
import { OrganizationProfile } from '@/components/profile/OrganizationProfile';
import { TaskDetailView } from '@/components/tasks/TaskDetailView';
import { KPIDashboard } from '@/components/dashboard/KPIDashboard';
import { useApp } from '@/context/AppContext';
import { Phase, ROLE_LABELS, STATUS_LABELS, PHASE_LABELS, SUBSCRIPTION_TIER_LABELS, SUBSCRIPTION_TIER_PRICES, SubscriptionTier } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AdminClients } from '@/components/admin/AdminClients';
import { AdminWorkflow } from '@/components/admin/AdminWorkflow';
import { AdminPlans, AdminDiscounts, AdminUsers, AdminTemplates, AdminBlast } from '@/components/admin/AdminSetup';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  Eye,
  Users,
  CreditCard,
  Mail,
  FileText,
  Building2,
  MessageSquare,
  Download
} from 'lucide-react';

export default function Dashboard() {
  const {
    currentUser,
    isAuthenticated,
    tasks,
    currentClient,
    getClientTasks,
    clients,
    subscriptions,
    getClientSubscription,
    upgradeSubscription,
    paymentHistory,
    getClientPaymentHistory,
    taskTemplates,
    emailTemplates
  } = useApp();

  const [selectedPhase, setSelectedPhase] = useState<Phase>('onboarding');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<string>('dashboard');

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Calculate role-specific stats
  const getRoleStats = () => {
    if (!currentUser) return [];

    switch (currentUser.role) {
      case 'us-strategy':
        const strategyAwaiting = tasks.filter(t => t.status === 'submitted').length;
        const strategyPending = tasks.filter(t => t.owner === 'us-strategy' && (t.status === 'pending' || t.status === 'in-progress')).length;
        const strategyRevision = tasks.filter(t => t.owner === 'us-strategy' && t.status === 'resubmit').length;
        const totalClients = clients.filter(c => c.isActive).length;

        return [
          { label: 'Awaiting My Approval', value: strategyAwaiting, icon: Eye, color: 'text-warning', status: 'submitted' },
          { label: 'My Active Tasks', value: strategyPending, icon: Clock, color: 'text-info', status: 'in-progress' },
          { label: 'Revision Required', value: strategyRevision, icon: AlertCircle, color: 'text-destructive', status: 'resubmit' },
          { label: 'Active Clients', value: totalClients, icon: Building2, color: 'text-muted-foreground', status: 'all' },
        ];

      case 'india-head':
      case 'india-junior':
        const indiaToExecute = tasks.filter(t =>
          (t.owner === 'india-head' || t.owner === 'india-junior' || t.assignedTo === currentUser.id) &&
          (t.status === 'pending' || t.status === 'in-progress')
        ).length;
        const indiaRevision = tasks.filter(t =>
          (t.owner === 'india-head' || t.owner === 'india-junior' || t.assignedTo === currentUser.id) &&
          t.status === 'resubmit'
        ).length;
        const indiaSubmitted = tasks.filter(t =>
          (t.owner === 'india-head' || t.owner === 'india-junior' || t.assignedTo === currentUser.id) &&
          t.status === 'submitted'
        ).length;
        const indiaApproved = tasks.filter(t =>
          (t.owner === 'india-head' || t.owner === 'india-junior' || t.assignedTo === currentUser.id) &&
          t.status === 'approved'
        ).length;

        return [
          { label: 'Tasks to Execute', value: indiaToExecute, icon: Clock, color: 'text-info', status: 'pending' },
          { label: 'Need Revision', value: indiaRevision, icon: AlertCircle, color: 'text-destructive', status: 'resubmit' },
          { label: 'In Review', value: indiaSubmitted, icon: Eye, color: 'text-warning', status: 'submitted' },
          { label: 'Completed', value: indiaApproved, icon: CheckCircle2, color: 'text-success', status: 'approved' },
        ];

      case 'client':
        const clientAction = tasks.filter(t => t.clientId === currentUser.id && t.owner === 'client' && t.status !== 'approved').length;
        const clientInProgress = tasks.filter(t => t.clientId === currentUser.id && t.status !== 'approved').length;
        const clientCompleted = tasks.filter(t => t.clientId === currentUser.id && t.status === 'approved').length;

        return [
          { label: 'Action Required from Me', value: clientAction, icon: AlertCircle, color: 'text-destructive', status: 'pending' },
          { label: 'Active Project Tasks', value: clientInProgress, icon: Clock, color: 'text-info', status: 'all' },
          { label: 'Completed Tasks', value: clientCompleted, icon: CheckCircle2, color: 'text-success', status: 'approved' },
          { label: 'My Plan Status', value: 'Active', icon: Building2, color: 'text-muted-foreground', status: 'all' },
        ];

      default:
        const defaultPending = tasks.filter(t => t.status === 'pending' || t.status === 'resubmit').length;
        const defaultInProgress = tasks.filter(t => t.status === 'in-progress').length;
        const defaultAwaiting = tasks.filter(t => t.status === 'submitted').length;
        const defaultCompleted = tasks.filter(t => t.status === 'approved').length;

        return [
          { label: 'Pending', value: defaultPending, icon: Clock, color: 'text-muted-foreground', status: 'pending' },
          { label: 'In Progress', value: defaultInProgress, icon: AlertCircle, color: 'text-info', status: 'in-progress' },
          { label: 'Awaiting Review', value: defaultAwaiting, icon: Eye, color: 'text-warning', status: 'submitted' },
          { label: 'Completed', value: defaultCompleted, icon: CheckCircle2, color: 'text-success', status: 'approved' },
        ];
    }
  };

  const quickStats = getRoleStats();

  // Admin stats
  const activeClients = clients.filter(c => c.isActive);
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const totalMRR = activeSubscriptions.reduce((sum, s) => sum + s.monthlyPrice, 0);

  // Client subscription upgrade
  const clientSubscription = currentUser?.role === 'client' ? getClientSubscription(currentUser.id) : null;
  const clientPayments = currentUser?.role === 'client' ? getClientPaymentHistory(currentUser.id) : [];

  const handleUpgrade = (tier: SubscriptionTier) => {
    if (currentUser?.id) {
      upgradeSubscription(currentUser.id, tier);
    }
  };

  // Render Dashboard with Sidebar for all users including admin
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar
          selectedPhase={selectedPhase}
          onPhaseSelect={(phase) => {
            setSelectedPhase(phase);
            setSelectedTaskId(null);
            setActiveView('tasks');
          }}
          activeView={activeView}
          onViewChange={(view) => {
            setSelectedTaskId(null);
            setActiveView(view as any);
          }}
        />

        <SidebarInset>
          <Header />

          <main className="pt-20 pb-16 px-6">
            <div className="flex items-center gap-2 mb-6">
              <SidebarTrigger className="md:hidden" />
            </div>

            {/* Dashboard View */}
            {activeView === 'dashboard' && (
              <div>
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold">Welcome back, {currentUser?.name}</h1>
                    <Badge variant={currentUser?.role as any}>
                      {ROLE_LABELS[currentUser?.role || 'client']}
                    </Badge>
                  </div>
                  {currentClient && currentUser?.role === 'client' && (
                    <p className="text-muted-foreground">
                      Client Portal for <span className="font-medium text-foreground">{currentClient.company}</span>
                    </p>
                  )}
                </div>

                {/* Workflow Attention Breakdown - For Team Roles */}
                {currentUser?.role !== 'client' && (
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Workflow Phase Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                      {(['onboarding', 'foundation', 'execution', 'ai', 'monitoring', 'reporting'] as Phase[]).map((phase) => {
                        const phaseTasks = tasks.filter(t => t.phase === phase);
                        const awaitingApproval = phaseTasks.filter(t => t.status === 'submitted').length;
                        const inProgress = phaseTasks.filter(t => t.status === 'in-progress' || t.status === 'pending').length;
                        const totalComments = phaseTasks.reduce((sum, t) => sum + t.comments.length, 0);

                        return (
                          <Card
                            key={phase}
                            className="bg-card/50 hover:bg-card cursor-pointer border-border/50 transition-colors"
                            onClick={() => {
                              setSelectedPhase(phase);
                              setSelectedStatus('all');
                              setActiveView('tasks');
                            }}
                          >
                            <CardContent className="p-3 text-center">
                              <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1 truncate">
                                {PHASE_LABELS[phase]}
                              </p>
                              <div className="flex flex-col gap-1">
                                {awaitingApproval > 0 && (
                                  <Badge variant="warning" className="text-[9px] py-0 h-4 justify-center">
                                    {awaitingApproval} Review
                                  </Badge>
                                )}
                                {inProgress > 0 && (
                                  <Badge variant="secondary" className="text-[9px] py-0 h-4 justify-center">
                                    {inProgress} Active
                                  </Badge>
                                )}
                                {awaitingApproval === 0 && inProgress === 0 && (
                                  <span className="text-[10px] text-muted-foreground/50 italic">Clear</span>
                                )}
                                {totalComments > 0 && (
                                  <div className="flex items-center justify-center gap-1 mt-1 text-[9px] text-accent font-medium">
                                    <MessageSquare className="w-2.5 h-2.5" />
                                    <span>{totalComments} Messages</span>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {quickStats.map((stat) => (
                    <Card
                      key={stat.label}
                      className="cursor-pointer transition-all hover:ring-2 hover:ring-accent hover:border-accent"
                      onClick={() => {
                        if (stat.status) {
                          setSelectedStatus(stat.status);
                          setActiveView('tasks');
                          // If it's a global view click, clear phase to show all
                          setSelectedPhase(undefined as any);
                        }
                      }}
                    >
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-secondary ${stat.color}`}>
                          <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <p className="text-xs text-muted-foreground">{stat.label}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Action Items Based on Role */}
                <div className="mt-8">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-accent" />
                        Immediate Actions
                      </CardTitle>
                      <CardDescription>
                        Critical tasks requiring your attention
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {tasks.filter(t => {
                          if (currentUser?.role === 'us-strategy') return t.status === 'submitted';
                          if (currentUser?.role === 'india-head' || currentUser?.role === 'india-junior') {
                            return (t.owner === currentUser.role || t.assignedTo === currentUser.id) &&
                              (t.status === 'pending' || t.status === 'resubmit');
                          }
                          if (currentUser?.role === 'client') return t.clientId === currentUser.id && t.owner === 'client' && t.status === 'pending';
                          return false;
                        }).slice(0, 5).map(task => (
                          <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg bg-card/50 hover:bg-card transition-colors">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div className="font-mono text-[10px] text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded">
                                {task.taskId}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{task.title}</p>
                                <div className="flex items-center gap-2">
                                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Building2 className="w-3 h-3" />
                                    {clients.find(c => c.id === task.clientId)?.company}
                                  </p>
                                  <span className="text-[10px] bg-[#f1f5f9] text-[#475569] px-2 py-0.5 rounded-full font-medium uppercase tracking-tight">
                                    {PHASE_LABELS[task.phase]}
                                  </span>
                                  {task.comments.length > 0 && (
                                    <Badge variant="secondary" className="text-[9px] h-3.5 px-1 font-normal gap-1 bg-accent/10 border-accent/20 text-accent">
                                      <MessageSquare className="w-2 h-2" />
                                      {task.comments.length}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant={task.status as any} className="text-[10px]">
                                {STATUS_LABELS[task.status]}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs gap-1"
                                onClick={() => {
                                  setSelectedTaskId(task.id);
                                  setActiveView('task-detail');
                                }}
                              >
                                <Eye className="w-3.5 h-3.5" />
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                        {tasks.filter(t => {
                          if (currentUser?.role === 'us-strategy') return t.status === 'submitted';
                          if (currentUser?.role === 'india-head' || currentUser?.role === 'india-junior') {
                            return (t.owner === currentUser.role || t.assignedTo === currentUser.id) &&
                              (t.status === 'pending' || t.status === 'resubmit');
                          }
                          if (currentUser?.role === 'client') return t.owner === 'client' && t.status === 'pending';
                          return false;
                        }).length === 0 && (
                            <div className="text-center py-8">
                              <CheckCircle2 className="w-10 h-10 text-success/30 mx-auto mb-3" />
                              <p className="text-sm text-muted-foreground">All caught up! No immediate actions required.</p>
                            </div>
                          )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Subscription Management View (Client Only) */}
            {activeView === 'subscription' && currentUser?.role === 'client' && clientSubscription && (
              <div className="space-y-6">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-[#0f172a]">Subscription & Billing</h1>
                  <p className="text-muted-foreground">Manage your plan, payment methods, and billing history.</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {/* Current Plan Highlight */}
                  <Card className="border-[#bae6fd] bg-[#f0f9ff]/30 border-2">
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-white border border-[#bae6fd] rounded-xl shadow-sm gap-6">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-[#ccfbf1] text-[#0f766e] flex items-center justify-center shadow-inner">
                            <CreditCard className="w-7 h-7" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-2xl font-black text-[#0f172a] tracking-tight">{SUBSCRIPTION_TIER_LABELS[clientSubscription.tier]}</p>
                              <Badge className="bg-[#14b8a6] text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
                                {clientSubscription.status}
                              </Badge>
                            </div>
                            <p className="text-sm font-bold text-[#64748b] whitespace-nowrap">
                              ${clientSubscription.monthlyPrice} per month • Billed monthly
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-8 w-full md:w-auto border-t md:border-t-0 md:border-l border-[#f1f5f9] pt-4 md:pt-0 md:pl-8">
                          <div className="flex-1">
                            <div className="flex justify-between items-end mb-2">
                              <span className="text-[10px] font-black text-[#64748b] uppercase tracking-wider">Next Payment</span>
                              <span className="text-sm font-bold text-[#0f172a]">Feb 08, 2026</span>
                            </div>
                            <Progress value={65} className="h-2 bg-[#f1f5f9]" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Upgrade Plans */}
                    <Card className="border-[#e2e8f0] shadow-sm flex flex-col">
                      <CardHeader className="pb-4 border-b border-[#f1f5f9]">
                        <CardTitle className="text-base font-bold text-[#0f172a] flex items-center gap-2">
                          Available Upgrades
                        </CardTitle>
                        <CardDescription>Scale your SEO growth with a premium tier</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6 flex-1">
                        <div className="space-y-3">
                          {(['starter', 'growth', 'enterprise'] as SubscriptionTier[]).map(tier => {
                            const isCurrent = clientSubscription?.tier === tier;
                            return (
                              <div
                                key={tier}
                                className={cn(
                                  "group flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                                  isCurrent
                                    ? "border-[#14b8a6] bg-[#f0fdfa]"
                                    : "border-[#f1f5f9] hover:border-[#e2e8f0] bg-white"
                                )}
                              >
                                <div className="flex items-center gap-4">
                                  <div className={cn(
                                    "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg",
                                    isCurrent ? "bg-[#14b8a6] text-white" : "bg-secondary text-muted-foreground"
                                  )}>
                                    {tier === 'starter' ? 'S' : tier === 'growth' ? 'G' : 'E'}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-extrabold text-[#0f172a] text-sm">{SUBSCRIPTION_TIER_LABELS[tier]}</span>
                                    <span className="text-[11px] font-bold text-[#64748b] tracking-tight">${SUBSCRIPTION_TIER_PRICES[tier]}/mo</span>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant={isCurrent ? "secondary" : "default"}
                                  className={cn(
                                    "h-8 px-5 font-black text-[10px] uppercase tracking-widest",
                                    isCurrent ? "bg-[#14b8a6]/10 text-[#0f766e] cursor-default" : "bg-[#0f172a] hover:bg-black text-white"
                                  )}
                                  onClick={() => !isCurrent && handleUpgrade(tier)}
                                >
                                  {isCurrent ? 'Current' : 'Select Plan'}
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Payment History & Method */}
                    <div className="flex flex-col gap-6">
                      <Card className="border-[#e2e8f0] shadow-sm">
                        <CardHeader className="pb-3 border-b border-[#f1f5f9]">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-base font-bold text-[#0f172a]">Payment Method</CardTitle>
                              <CardDescription>Registered billing info</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className="h-8 text-[10px] font-black uppercase border-[#e2e8f0] hover:bg-[#f8fafc]">Update Card</Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-5">
                          <div className="flex items-center gap-4 p-4 border border-[#e2e8f0] rounded-xl bg-[#f8fafc]">
                            <div className="w-12 h-8 bg-white border border-[#e2e8f0] rounded flex items-center justify-center shadow-sm">
                              <span className="text-[10px] font-black italic text-[#2563eb]">VISA</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-extrabold text-[#0f172a]">•••• •••• •••• 4242</p>
                              <p className="text-[10px] text-[#64748b] font-bold">Expires 12/26 • Primary Card</p>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-[#14b8a6]" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-[#e2e8f0] shadow-sm flex-1">
                        <CardHeader className="pb-3 border-b border-[#f1f5f9]">
                          <CardTitle className="text-base font-bold text-[#0f172a]">Recent Invoices</CardTitle>
                          <CardDescription>Your last 5 billing statements</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0 px-0">
                          <div className="divide-y divide-[#f1f5f9]">
                            {clientPayments.length > 0 ? clientPayments.slice(0, 5).map(payment => (
                              <div key={payment.id} className="flex items-center justify-between p-4 hover:bg-[#f8fafc] transition-colors cursor-pointer group">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded bg-[#f1f5f9] flex items-center justify-center text-[#64748b] group-hover:bg-[#e2e8f0]">
                                    <FileText className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-[#0f172a] text-xs">{payment.invoiceNumber}</p>
                                    <p className="text-[10px] text-[#64748b] font-bold">
                                      {new Date(payment.paymentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <p className="font-black text-[#0f172a] text-sm">${payment.amount}</p>
                                    <span className="text-[9px] font-extrabold text-[#14b8a6] uppercase tracking-tight">PAID</span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Mock download action
                                      console.log('Downloading invoice:', payment.invoiceNumber);
                                    }}
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            )) : (
                              <div className="text-center py-10">
                                <p className="text-[#64748b] text-sm font-medium italic">No payments recorded yet.</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tasks View */}
            {activeView === 'tasks' && (
              <TaskList
                phase={selectedPhase}
                initialStatus={selectedStatus}
                onViewTask={(id) => {
                  setSelectedTaskId(id);
                  setActiveView('task-detail');
                }}
              />
            )}

            {/* Task Detail View */}
            {activeView === 'task-detail' && selectedTaskId && (
              <TaskDetailView
                taskId={selectedTaskId}
                onBack={() => setActiveView('tasks')}
              />
            )}

            {/* Reports View */}
            {activeView === 'reports' && (
              <KPIDashboard />
            )}

            {/* Admin Views */}
            {activeView === 'admin-clients' && <AdminClients />}
            {activeView === 'admin-workflow' && <AdminWorkflow />}
            {activeView === 'admin-setup-plans' && <AdminPlans />}
            {activeView === 'admin-setup-discounts' && <AdminDiscounts />}
            {activeView === 'admin-setup-users' && <AdminUsers />}
            {activeView === 'admin-setup-templates' && <AdminTemplates />}
            {activeView === 'admin-setup-blast' && <AdminBlast />}
            {activeView === 'admin-profile' && <OrganizationProfile />}

            {/* Profile View (Client) */}
            {activeView === 'profile' && <OrganizationProfile />}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
