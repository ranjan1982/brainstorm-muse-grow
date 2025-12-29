import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { PhaseTracker } from '@/components/workflow/PhaseTracker';
import { TaskList } from '@/components/tasks/TaskList';
import { KPIDashboard } from '@/components/dashboard/KPIDashboard';
import { useApp } from '@/context/AppContext';
import { Phase, ROLE_LABELS, SUBSCRIPTION_TIER_LABELS, SUBSCRIPTION_TIER_PRICES, SubscriptionTier } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  CheckSquare, 
  BarChart3, 
  Settings,
  Clock,
  AlertCircle,
  CheckCircle2,
  Eye,
  Users,
  CreditCard,
  Mail,
  FileText,
  TrendingUp,
  Building2
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
  const [currentPhase, setCurrentPhase] = useState<Phase>('onboarding');

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Get relevant tasks based on role
  const getRelevantTasks = () => {
    if (currentUser?.role === 'admin') {
      return []; // Admin doesn't see tasks
    }
    if (currentUser?.role === 'client') {
      return tasks.filter(t => t.clientId === currentUser.id);
    }
    // Team members see current client's tasks
    if (currentClient) {
      return getClientTasks(currentClient.id);
    }
    return tasks;
  };

  const myTasks = getRelevantTasks();

  // Calculate task stats
  const filteredTasks = myTasks.filter(t => {
    if (currentUser?.role === 'client') return t.owner === 'client';
    if (currentUser?.role === 'india-head' || currentUser?.role === 'india-junior') {
      return t.owner === 'india-head' || t.owner === 'india-junior';
    }
    if (currentUser?.role === 'us-strategy') return t.status === 'submitted' || t.owner === 'us-strategy';
    return true;
  });

  const pendingTasks = filteredTasks.filter(t => t.status === 'pending' || t.status === 'resubmit').length;
  const inProgressTasks = filteredTasks.filter(t => t.status === 'in-progress').length;
  const awaitingReview = filteredTasks.filter(t => t.status === 'submitted').length;
  const completedTasks = filteredTasks.filter(t => t.status === 'approved').length;

  const quickStats = [
    { label: 'Pending', value: pendingTasks, icon: Clock, color: 'text-muted-foreground' },
    { label: 'In Progress', value: inProgressTasks, icon: AlertCircle, color: 'text-info' },
    { label: 'Awaiting Review', value: awaitingReview, icon: Eye, color: 'text-warning' },
    { label: 'Completed', value: completedTasks, icon: CheckCircle2, color: 'text-success' },
  ];

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

  // Render Admin Dashboard
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

  // Render Client Dashboard with Subscription Management
  if (currentUser?.role === 'client') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-6">
            {/* Welcome Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">Welcome back, {currentUser?.name}</h1>
                <Badge variant="client">
                  {ROLE_LABELS['client']}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Here's what's happening with your SEO campaign today.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {quickStats.map((stat) => (
                <Card key={stat.label}>
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

            {/* Phase Tracker */}
            <div className="mb-8">
              <PhaseTracker currentPhase={currentPhase} onPhaseClick={setCurrentPhase} />
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="tasks" className="space-y-6">
              <TabsList className="bg-secondary/50 p-1">
                <TabsTrigger value="tasks" className="gap-2">
                  <CheckSquare className="w-4 h-4" />
                  Tasks
                </TabsTrigger>
                <TabsTrigger value="reports" className="gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Reports
                </TabsTrigger>
                <TabsTrigger value="subscription" className="gap-2">
                  <CreditCard className="w-4 h-4" />
                  Subscription
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tasks" className="mt-6">
                <TaskList showAllPhases />
              </TabsContent>

              <TabsContent value="reports" className="mt-6">
                <KPIDashboard />
              </TabsContent>

              <TabsContent value="subscription" className="mt-6">
                <div className="space-y-6">
                  {/* Current Plan */}
                  {clientSubscription && (
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
                  )}

                  {/* Upgrade Options */}
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

                  {/* Payment History */}
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
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    );
  }

  // Render Team Dashboard (US Strategy, India Head, India Junior)
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-6">
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">Welcome back, {currentUser?.name}</h1>
              <Badge variant={currentUser?.role as any}>
                {ROLE_LABELS[currentUser?.role || 'client']}
              </Badge>
            </div>
            {currentClient && (
              <p className="text-muted-foreground">
                Managing: <span className="font-medium text-foreground">{currentClient.company}</span>
              </p>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {quickStats.map((stat) => (
              <Card key={stat.label}>
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

          {/* Phase Tracker */}
          <div className="mb-8">
            <PhaseTracker currentPhase={currentPhase} onPhaseClick={setCurrentPhase} />
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="tasks" className="space-y-6">
            <TabsList className="bg-secondary/50 p-1">
              <TabsTrigger value="tasks" className="gap-2">
                <CheckSquare className="w-4 h-4" />
                Tasks
              </TabsTrigger>
              <TabsTrigger value="reports" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tasks" className="mt-6">
              <TaskList showAllPhases />
            </TabsContent>

            <TabsContent value="reports" className="mt-6">
              <KPIDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}