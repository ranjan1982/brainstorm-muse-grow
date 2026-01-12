import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { TaskList } from '@/components/tasks/TaskList';
import { OrganizationProfile } from '@/components/profile/OrganizationProfile';
import { TaskDetailView } from '@/components/tasks/TaskDetailView';
import { KPIDashboard } from '@/components/dashboard/KPIDashboard';
import { ClientManagement } from '@/components/admin/ClientManagement';
import { WorkPhaseManagement } from '@/components/admin/WorkPhaseManagement';
import { UserManagement } from '@/components/admin/UserManagement';
import { EmailBlast } from '@/components/admin/EmailBlast';
import { LoginActivityTracker } from '@/components/admin/LoginActivityTracker';
import { useApp } from '@/context/AppContext';
import { Phase, ROLE_LABELS, SUBSCRIPTION_TIER_LABELS, SUBSCRIPTION_TIER_PRICES, SubscriptionTier } from '@/types';
import { AdminView } from '@/types/admin';
import { 
  mockWorkPhases, 
  mockAdminUsers, 
  mockEmailBlasts, 
  mockLoginActivity,
  mockRefunds
} from '@/data/adminMockData';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import {
  Users,
  CreditCard,
  FileText,
  Mail,
  Building2
} from 'lucide-react';

export default function Dashboard() {
  const {
    currentUser,
    isAuthenticated,
    tasks,
    currentClient,
    clients,
    subscriptions,
    getClientSubscription,
    upgradeSubscription,
    taskTemplates,
    emailTemplates
  } = useApp();

  const [selectedPhase, setSelectedPhase] = useState<Phase>('onboarding');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'tasks' | 'reports' | 'dashboard' | 'task-detail' | 'subscription' | 'profile'>('dashboard');
  const [adminView, setAdminView] = useState<AdminView>('dashboard');

  // Admin state
  const [workPhases, setWorkPhases] = useState(mockWorkPhases);
  const [adminUsers, setAdminUsers] = useState(mockAdminUsers);
  const [emailBlasts, setEmailBlasts] = useState(mockEmailBlasts);
  const [loginActivity] = useState(mockLoginActivity);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Admin stats
  const activeClients = clients.filter(c => c.isActive);
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const totalMRR = activeSubscriptions.reduce((sum, s) => sum + s.monthlyPrice, 0);

  // Admin handlers
  const handleDeactivateClient = (clientId: string) => {
    console.log('Deactivate client:', clientId);
  };

  const handleActivateClient = (clientId: string) => {
    console.log('Activate client:', clientId);
  };

  const handleCancelSubscription = (clientId: string, reason: string) => {
    console.log('Cancel subscription:', clientId, reason);
  };

  const handleExtendTrial = (clientId: string, days: number) => {
    console.log('Extend trial:', clientId, days);
  };

  const handleAddPhase = (phase: any) => {
    const newPhase = {
      ...phase,
      id: `phase-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setWorkPhases([...workPhases, newPhase]);
  };

  const handleUpdatePhase = (phaseId: string, updates: any) => {
    setWorkPhases(workPhases.map(p => p.id === phaseId ? { ...p, ...updates, updatedAt: new Date() } : p));
  };

  const handleDeletePhase = (phaseId: string) => {
    setWorkPhases(workPhases.filter(p => p.id !== phaseId));
  };

  const handleAddUser = (user: any) => {
    const newUser = {
      ...user,
      id: `user-${Date.now()}`,
      createdAt: new Date()
    };
    setAdminUsers([...adminUsers, newUser]);
  };

  const handleDeactivateUser = (userId: string) => {
    setAdminUsers(adminUsers.map(u => u.id === userId ? { ...u, isActive: false } : u));
  };

  const handleActivateUser = (userId: string) => {
    setAdminUsers(adminUsers.map(u => u.id === userId ? { ...u, isActive: true } : u));
  };

  const handleSendBlast = (blast: any) => {
    const newBlast = {
      ...blast,
      id: `blast-${Date.now()}`,
      createdAt: new Date(),
      sentAt: new Date(),
      status: 'sent' as const,
      recipientCount: clients.filter(c => c.isActive).length,
      openCount: 0
    };
    setEmailBlasts([newBlast, ...emailBlasts]);
  };

  // Render Admin Dashboard with sidebar
  if (currentUser?.role === 'admin') {
    const pendingRefunds = mockRefunds.filter(r => r.status === 'pending').length;
    const activeLogins = loginActivity.filter(l => l.status === 'active').length;

    const renderAdminContent = () => {
      switch (adminView) {
        case 'clients':
          return (
            <ClientManagement
              clients={clients}
              subscriptions={subscriptions}
              onDeactivateClient={handleDeactivateClient}
              onActivateClient={handleActivateClient}
              onCancelSubscription={handleCancelSubscription}
              onExtendTrial={handleExtendTrial}
            />
          );
        case 'work-phases':
          return (
            <WorkPhaseManagement
              phases={workPhases}
              onAddPhase={handleAddPhase}
              onUpdatePhase={handleUpdatePhase}
              onDeletePhase={handleDeletePhase}
            />
          );
        case 'users':
          return (
            <UserManagement
              users={adminUsers}
              onAddUser={handleAddUser}
              onDeactivateUser={handleDeactivateUser}
              onActivateUser={handleActivateUser}
            />
          );
        case 'email-blast':
          return (
            <EmailBlast
              emailBlasts={emailBlasts}
              onSendBlast={handleSendBlast}
            />
          );
        case 'login-activity':
          return (
            <LoginActivityTracker
              activities={loginActivity}
              onRefresh={() => console.log('Refresh')}
            />
          );
        default:
          // Dashboard view
          return (
            <div className="space-y-6">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                  <Badge variant="admin">{ROLE_LABELS['admin']}</Badge>
                </div>
                <p className="text-muted-foreground">
                  Manage subscriptions, clients, task templates, and email configurations.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setAdminView('clients')}>
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
                <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setAdminView('work-phases')}>
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
                <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setAdminView('users')}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/10 text-accent-foreground">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{adminUsers.length}</p>
                      <p className="text-xs text-muted-foreground">Team Users</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-3 flex-wrap">
                  <Button onClick={() => setAdminView('clients')}>Manage Clients</Button>
                  <Button variant="outline" onClick={() => setAdminView('work-phases')}>Configure Phases</Button>
                  <Button variant="outline" onClick={() => setAdminView('users')}>Add Team User</Button>
                  <Button variant="outline" onClick={() => setAdminView('email-blast')}>Send Broadcast</Button>
                  <Button variant="outline" onClick={() => setAdminView('login-activity')}>View Activity</Button>
                </CardContent>
              </Card>
            </div>
          );
      }
    };

    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AdminSidebar
            activeView={adminView}
            onViewChange={setAdminView}
            badges={{
              pendingRefunds,
              activeLogins
            }}
          />
          <SidebarInset className="flex-1">
            <Header />
            <main className="pt-20 pb-16 px-6">
              <div className="container mx-auto">
                {renderAdminContent()}
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  // Non-admin users - regular dashboard with AppSidebar
  const handleUpgrade = (tier: SubscriptionTier) => {
    if (currentUser?.id) {
      upgradeSubscription(currentUser.id, tier);
    }
  };

  const clientSubscription = currentUser?.role === 'client' ? getClientSubscription(currentUser.id) : null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar
          selectedPhase={selectedPhase}
          onPhaseSelect={setSelectedPhase}
          activeView={activeView}
          onViewChange={setActiveView}
        />
        <SidebarInset className="flex-1">
          <Header />
          <main className="pt-20 pb-16 px-6">
            <div className="container mx-auto">
              {activeView === 'dashboard' && (
                <KPIDashboard />
              )}
              {activeView === 'tasks' && (
                <TaskList
                  selectedPhase={selectedPhase}
                  onTaskSelect={(taskId) => {
                    setSelectedTaskId(taskId);
                    setActiveView('task-detail');
                  }}
                />
              )}
              {activeView === 'task-detail' && selectedTaskId && (
                <TaskDetailView
                  taskId={selectedTaskId}
                  onBack={() => setActiveView('tasks')}
                />
              )}
              {activeView === 'profile' && <OrganizationProfile />}
              {activeView === 'subscription' && clientSubscription && (
                <Card>
                  <CardHeader>
                    <CardTitle>My Subscription</CardTitle>
                    <CardDescription>Current plan: {SUBSCRIPTION_TIER_LABELS[clientSubscription.tier]}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">${clientSubscription.monthlyPrice}/month</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
