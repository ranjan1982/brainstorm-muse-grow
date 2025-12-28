import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { PhaseTracker } from '@/components/workflow/PhaseTracker';
import { TaskList } from '@/components/tasks/TaskList';
import { KPIDashboard } from '@/components/dashboard/KPIDashboard';
import { useApp } from '@/context/AppContext';
import { Phase, ROLE_LABELS, Task, STATUS_LABELS } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  CheckSquare, 
  BarChart3, 
  Settings,
  Clock,
  AlertCircle,
  CheckCircle2,
  Eye
} from 'lucide-react';

export default function Dashboard() {
  const { currentUser, isAuthenticated, tasks } = useApp();
  const [currentPhase, setCurrentPhase] = useState<Phase>('onboarding');

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Calculate task stats
  const myTasks = tasks.filter(t => {
    if (currentUser?.role === 'client') return t.owner === 'client';
    if (currentUser?.role === 'india-head' || currentUser?.role === 'india-junior') {
      return t.owner === 'india-head' || t.owner === 'india-junior';
    }
    if (currentUser?.role === 'us-strategy') return t.status === 'submitted' || t.owner === 'us-strategy';
    return true;
  });

  const pendingTasks = myTasks.filter(t => t.status === 'pending' || t.status === 'resubmit').length;
  const inProgressTasks = myTasks.filter(t => t.status === 'in-progress').length;
  const awaitingReview = myTasks.filter(t => t.status === 'submitted').length;
  const completedTasks = myTasks.filter(t => t.status === 'approved').length;

  const quickStats = [
    { label: 'Pending', value: pendingTasks, icon: Clock, color: 'text-muted-foreground' },
    { label: 'In Progress', value: inProgressTasks, icon: AlertCircle, color: 'text-info' },
    { label: 'Awaiting Review', value: awaitingReview, icon: Eye, color: 'text-warning' },
    { label: 'Completed', value: completedTasks, icon: CheckCircle2, color: 'text-success' },
  ];

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
              {currentUser?.role === 'admin' && (
                <TabsTrigger value="admin" className="gap-2">
                  <Settings className="w-4 h-4" />
                  Admin
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="tasks" className="mt-6">
              <TaskList showAllPhases />
            </TabsContent>

            <TabsContent value="reports" className="mt-6">
              <KPIDashboard />
            </TabsContent>

            {currentUser?.role === 'admin' && (
              <TabsContent value="admin" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Admin Panel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-secondary/30">
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2">Active Subscriptions</h4>
                          <p className="text-3xl font-bold">127</p>
                          <p className="text-xs text-muted-foreground">+12 this month</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-secondary/30">
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2">Total Revenue</h4>
                          <p className="text-3xl font-bold">$63.4k</p>
                          <p className="text-xs text-muted-foreground">MRR</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-secondary/30">
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2">Task Completion</h4>
                          <p className="text-3xl font-bold">89%</p>
                          <p className="text-xs text-muted-foreground">On-time rate</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  );
}
