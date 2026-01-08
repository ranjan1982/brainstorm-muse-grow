import {
  ClipboardList,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { Phase, PHASE_LABELS, ROLE_LABELS } from '@/types';
import { Badge } from '@/components/ui/badge';
import {
  Sidebar,
  SidebarContent,
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

  // Define phases based on user role
  const allPhases: Phase[] = ['onboarding', 'foundation', 'execution', 'ai', 'reporting', 'monitoring'];

  // Client only sees onboarding and reporting
  const visiblePhases: Phase[] = currentUser?.role === 'client'
    ? ['onboarding', 'reporting']
    : allPhases;

  // Get client's subscription tier
  const clientId = currentUser?.role === 'client' ? currentUser.id : currentClient?.id;
  const subscription = clientId ? getClientSubscription(clientId) : undefined;

  // Get action needed count per phase (tasks in this phase across all relevant clients)
  const getPhaseActionCount = (phase: Phase): number => {
    if (!currentUser) return 0;

    return tasks.filter(t => {
      // 1. Match phase
      if (t.phase !== phase) return false;

      // 2. Count all tasks that are not yet 'approved'
      if (t.status === 'approved') return false;

      // 3. Scope filtering
      if (currentUser.role === 'client') {
        // Clients only see their own tasks
        return t.clientId === currentUser.id;
      }

      // For team roles, show the count of all pending items across all clients
      // as per request to see global workload for each phase.
      return true;
    }).length;
  };

  // Get total action count across all visible phases
  const getTotalActionCount = (): number => {
    return visiblePhases.reduce((sum, phase) => sum + getPhaseActionCount(phase), 0);
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


    </Sidebar>
  );
}
