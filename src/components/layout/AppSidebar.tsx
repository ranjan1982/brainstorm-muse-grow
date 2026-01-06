import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  BarChart3,
  LayoutDashboard,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { Phase, PHASE_LABELS, ROLE_LABELS } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';

interface AppSidebarProps {
  selectedPhase: Phase | null;
  onPhaseSelect: (phase: Phase) => void;
  activeView: 'tasks' | 'reports' | 'dashboard';
  onViewChange: (view: 'tasks' | 'reports' | 'dashboard') => void;
}

export function AppSidebar({ selectedPhase, onPhaseSelect, activeView, onViewChange }: AppSidebarProps) {
  const { currentUser, currentClient, tasks, logout, getClientSubscription } = useApp();
  const navigate = useNavigate();

  // Define phases based on user role
  const allPhases: Phase[] = ['onboarding', 'foundation', 'execution', 'ai', 'reporting', 'monitoring'];

  // Client only sees onboarding and reporting
  const visiblePhases: Phase[] = currentUser?.role === 'client'
    ? ['onboarding', 'reporting']
    : allPhases;

  // Get client's subscription tier
  const clientId = currentUser?.role === 'client' ? currentUser.id : currentClient?.id;
  const subscription = clientId ? getClientSubscription(clientId) : undefined;

  // Get action needed count per phase (tasks assigned to current user)
  const getPhaseActionCount = (phase: Phase): number => {
    if (!currentUser) return 0;

    const clientTasks = tasks.filter(t => {
      // Filter by client if applicable
      if (currentUser.role === 'client') {
        return t.clientId === currentUser.id;
      }
      if (currentClient) {
        return t.clientId === currentClient.id;
      }
      return true;
    });

    // Count tasks assigned to current user's role in this phase
    return clientTasks.filter(t =>
      t.phase === phase &&
      t.owner === currentUser.role &&
      t.status !== 'approved' // Exclude completed tasks
    ).length;
  };

  // Get total action count across all visible phases
  const getTotalActionCount = (): number => {
    return visiblePhases.reduce((sum, phase) => sum + getPhaseActionCount(phase), 0);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const phaseIcons: Record<Phase, string> = {
    'onboarding': '🚀',
    'foundation': '🏗️',
    'execution': '⚡',
    'ai': '🤖',
    'reporting': '📊',
    'monitoring': '🔔'
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
            SE
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">SEO Portal</span>
            {currentClient && currentUser?.role !== 'client' && (
              <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                {currentClient.company}
              </span>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeView === 'dashboard'}
                  onClick={() => onViewChange('dashboard')}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeView === 'reports'}
                  onClick={() => onViewChange('reports')}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Reports</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <div className="flex items-center justify-between px-2 py-1.5">
            <div className="flex items-center gap-2 text-xs font-medium text-sidebar-foreground/70">
              <ClipboardList className="w-4 h-4" />
              <span>Workflow Phases</span>
            </div>
            {getTotalActionCount() > 0 && (
              <Badge variant="destructive" className="text-[10px] px-1.5 h-5">
                {getTotalActionCount()}
              </Badge>
            )}
          </div>

          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              {visiblePhases.map((phase) => {
                const actionCount = getPhaseActionCount(phase);
                const isActive = selectedPhase === phase && activeView === 'tasks';

                return (
                  <SidebarMenuItem key={phase}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => {
                        onPhaseSelect(phase);
                        onViewChange('tasks');
                      }}
                      className="justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span>{phaseIcons[phase]}</span>
                        <span className="text-sm">{PHASE_LABELS[phase].split('&')[0].trim()}</span>
                      </div>
                      <Badge
                        variant={actionCount > 0 ? "destructive" : "secondary"}
                        className={cn(
                          "text-[10px] px-1.5 h-5 min-w-[20px] justify-center",
                          actionCount === 0 && "opacity-50"
                        )}
                      >
                        {actionCount}
                      </Badge>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarSeparator className="mb-4" />
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
            {currentUser?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{currentUser?.name}</p>
            <p className="text-xs text-muted-foreground">
              {currentUser?.role ? ROLE_LABELS[currentUser.role] : ''}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
