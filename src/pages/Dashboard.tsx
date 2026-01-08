import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskDetailView } from '@/components/tasks/TaskDetailView';
import { KPIDashboard } from '@/components/dashboard/KPIDashboard';
import { useApp } from '@/context/AppContext';
import { Phase, ROLE_LABELS, STATUS_LABELS, PHASE_LABELS, SUBSCRIPTION_TIER_LABELS, SUBSCRIPTION_TIER_PRICES, SubscriptionTier } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
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
  MessageSquare
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
  const [activeView, setActiveView] = useState<'tasks' | 'reports' | 'dashboard' | 'task-detail'>('dashboard');

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

  // Render Admin Dashboard (no sidebar)
  if (currentUser?.role === 'admin') {
    return (
      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-20 pb-16">
          <div className="container mx-auto px-6">
            {/* Welcome Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">Admin Portal</h1>
                <Badge variant="admin">
                  {ROLE_LABELS['admin']}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Manage subscriptions, clients, task templates, and email configurations.
              </p>
            </div>

            {/* Admin Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/10 text-success">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{activeClients.length}</p>
                    <p className="text-xs text-muted-foreground">Active Clients</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-info/10 text-info">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">${totalMRR.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Monthly Revenue</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10 text-warning">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{taskTemplates.length}</p>
                    <p className="text-xs text-muted-foreground">Task Templates</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10 text-accent">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{emailTemplates.length}</p>
                    <p className="text-xs text-muted-foreground">Email Templates</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Admin Tabs */}
            <Tabs defaultValue="clients" className="space-y-6">
              <TabsList className="bg-secondary/50 p-1">
                <TabsTrigger value="clients" className="gap-2">
                  <Users className="w-4 h-4" />
                  Clients
                </TabsTrigger>
                <TabsTrigger value="subscriptions" className="gap-2">
                  <CreditCard className="w-4 h-4" />
                  Subscriptions
                </TabsTrigger>
                <TabsTrigger value="tasks" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Task Templates
                </TabsTrigger>
                <TabsTrigger value="emails" className="gap-2">
                  <Mail className="w-4 h-4" />
                  Email Templates
                </TabsTrigger>
              </TabsList>

              <TabsContent value="clients" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Registered Clients</CardTitle>
                    <CardDescription>Manage all registered clients and their details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {clients.map(client => {
                        const subscription = getClientSubscription(client.id);
                        const payments = getClientPaymentHistory(client.id);
                        const lastPayment = payments[0];
                        return (
                          <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="font-medium">{client.company}</p>
                                <p className="text-sm text-muted-foreground">{client.name} • {client.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              {subscription && (
                                <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                                  {SUBSCRIPTION_TIER_LABELS[subscription.tier]}
                                </Badge>
                              )}
                              <Badge variant={client.isActive ? 'outline' : 'destructive'}>
                                {client.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                              {lastPayment && (
                                <span className="text-sm text-muted-foreground">
                                  Last: ${lastPayment.amount} ({lastPayment.status})
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="subscriptions" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Plans</CardTitle>
                    <CardDescription>Overview of all subscription tiers and active subscribers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {(['starter', 'growth', 'enterprise'] as SubscriptionTier[]).map(tier => {
                        const tierSubs = subscriptions.filter(s => s.tier === tier && s.status === 'active');
                        return (
                          <Card key={tier} className="bg-secondary/30">
                            <CardContent className="p-4">
                              <h4 className="font-semibold mb-2">{SUBSCRIPTION_TIER_LABELS[tier]}</h4>
                              <p className="text-3xl font-bold">{tierSubs.length}</p>
                              <p className="text-xs text-muted-foreground">
                                ${SUBSCRIPTION_TIER_PRICES[tier]}/mo per client
                              </p>
                              <p className="text-sm text-success mt-2">
                                ${tierSubs.length * SUBSCRIPTION_TIER_PRICES[tier]}/mo
                              </p>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium mb-3">Recent Payments</h4>
                      {paymentHistory.slice(0, 5).map(payment => {
                        const client = clients.find(c => c.id === payment.clientId);
                        return (
                          <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{client?.company}</p>
                              <p className="text-xs text-muted-foreground">{payment.invoiceNumber}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-medium">${payment.amount}</span>
                              <Badge variant={payment.status === 'paid' ? 'default' : payment.status === 'pending' ? 'secondary' : 'destructive'}>
                                {payment.status}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tasks" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Task Templates by Phase</CardTitle>
                    <CardDescription>Configure default tasks for each workflow phase</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {taskTemplates.map(template => (
                        <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-muted-foreground">{template.taskId}</span>
                              <p className="font-medium">{template.title}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">{template.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{template.phase}</Badge>
                            <Badge variant={template.isActive ? 'default' : 'secondary'}>
                              {template.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="emails" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Email Templates</CardTitle>
                    <CardDescription>Manage automated email notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {emailTemplates.map(template => (
                        <div key={template.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{template.name}</h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{template.trigger}</Badge>
                              <Badge variant={template.isActive ? 'default' : 'secondary'}>
                                {template.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Subject: {template.subject}
                          </p>
                          <pre className="text-xs bg-secondary/50 p-2 rounded overflow-x-auto">
                            {template.body.slice(0, 150)}...
                          </pre>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    );
  }

  // Render Dashboard with Sidebar for all other users
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
          activeView={activeView === 'task-detail' ? 'tasks' : activeView}
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
                          if (currentUser?.role === 'client') return t.owner === 'client' && t.status === 'pending';
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

                {/* Client Subscription Section */}
                {currentUser?.role === 'client' && clientSubscription && (
                  <div className="space-y-6 mt-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Current Plan</CardTitle>
                        <CardDescription>Your active subscription details</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                          <div>
                            <p className="text-2xl font-bold">{SUBSCRIPTION_TIER_LABELS[clientSubscription.tier]}</p>
                            <p className="text-muted-foreground">${clientSubscription.monthlyPrice}/month</p>
                          </div>
                          <Badge variant={clientSubscription.status === 'active' ? 'default' : 'secondary'}>
                            {clientSubscription.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Upgrade Your Plan</CardTitle>
                        <CardDescription>Choose a plan that fits your business needs</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {(['starter', 'growth', 'enterprise'] as SubscriptionTier[]).map(tier => (
                            <Card key={tier} className={`relative ${clientSubscription?.tier === tier ? 'border-accent' : ''}`}>
                              {clientSubscription?.tier === tier && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                  <Badge variant="default">Current</Badge>
                                </div>
                              )}
                              <CardContent className="p-6 text-center">
                                <h3 className="text-xl font-bold mb-2">{SUBSCRIPTION_TIER_LABELS[tier]}</h3>
                                <p className="text-3xl font-bold mb-4">
                                  ${SUBSCRIPTION_TIER_PRICES[tier]}
                                  <span className="text-sm font-normal text-muted-foreground">/mo</span>
                                </p>
                                <Button
                                  variant={clientSubscription?.tier === tier ? 'outline' : 'default'}
                                  className="w-full"
                                  disabled={clientSubscription?.tier === tier}
                                  onClick={() => handleUpgrade(tier)}
                                >
                                  {clientSubscription?.tier === tier ? 'Current Plan' : 'Upgrade'}
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Payment History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {clientPayments.length > 0 ? clientPayments.map(payment => (
                            <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <p className="font-medium">{payment.invoiceNumber}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(payment.paymentDate).toLocaleDateString()} • {payment.paymentMethod}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-medium">${payment.amount}</span>
                                <Badge variant={payment.status === 'paid' ? 'default' : 'secondary'}>
                                  {payment.status}
                                </Badge>
                              </div>
                            </div>
                          )) : (
                            <p className="text-muted-foreground text-center py-4">No payment history available</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
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
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
