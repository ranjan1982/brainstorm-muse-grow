import {
  ClipboardList,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { Phase, PHASE_LABELS, ROLE_LABELS } from '@/types';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
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
          <div className="px-2 py-1.5 flex items-center gap-2 text-xs font-medium text-sidebar-foreground/70">
            <ClipboardList className="w-4 h-4" />
            <span>Workflow Phases</span>
          </div>

          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              {visiblePhases.map((phase) => {
                const isActive = selectedPhase === phase && activeView === 'tasks';

                return (
                  <SidebarMenuItem key={phase}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => {
                        onPhaseSelect(phase);
                        onViewChange('tasks');
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span>{phaseIcons[phase]}</span>
                        <span className="text-sm">{PHASE_LABELS[phase].split('&')[0].trim()}</span>
                      </div>
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
