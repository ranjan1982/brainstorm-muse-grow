import {
  ClipboardList,
  LayoutDashboard,
  CreditCard,
  UserCog,
  Users,
  Settings,
  GitMerge,
  ChevronRight,
  PlayCircle,
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';


interface AppSidebarProps {
  selectedPhase: Phase | null;
  onPhaseSelect: (phase: Phase) => void;
  activeView: string;
  onViewChange: (view: string) => void;
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

  const isAdmin = currentUser?.role === 'admin';

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
            {isAdmin && <span className="text-xs text-muted-foreground">Administrator</span>}
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {/* Main Navigation */}
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

        {/* Admin Navigation */}
        {isAdmin ? (
          <>
            <SidebarGroup>
              <div className="px-2 py-1.5 flex items-center gap-2 text-xs font-medium text-sidebar-foreground/70">
                <Settings className="w-4 h-4" />
                <span>Administration</span>
              </div>
              <SidebarGroupContent className="mt-2">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeView === 'admin-clients'}
                      onClick={() => onViewChange('admin-clients')}
                    >
                      <Users className="w-4 h-4" />
                      <span>Clients Management</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeView === 'admin-workflow'}
                      onClick={() => onViewChange('admin-workflow')}
                    >
                      <GitMerge className="w-4 h-4" />
                      <span>Work Phases</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <Collapsible className="group/collapsible" asChild>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip="System Setup">
                          <Settings className="w-4 h-4" />
                          <span>System Setup</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton isActive={activeView === 'admin-setup-plans'} onClick={() => onViewChange('admin-setup-plans')}>
                              <span>Plans</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton isActive={activeView === 'admin-setup-discounts'} onClick={() => onViewChange('admin-setup-discounts')}>
                              <span>Coupons</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton isActive={activeView === 'admin-setup-users'} onClick={() => onViewChange('admin-setup-users')}>
                              <span>Users</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton isActive={activeView === 'admin-setup-templates'} onClick={() => onViewChange('admin-setup-templates')}>
                              <span>Templates</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton isActive={activeView === 'admin-setup-blast'} onClick={() => onViewChange('admin-setup-blast')}>
                              <span>Email Blast</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator />

            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeView === 'admin-profile'}
                      onClick={() => onViewChange('admin-profile')}
                    >
                      <UserCog className="w-4 h-4" />
                      <span>My Profile</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        ) : (
          /* Standard Workflow Sections for Non-Admin */
          <>
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
                            <span className="text-sm">
                              {currentUser?.role === 'client' && phase === 'onboarding'
                                ? 'Tasks'
                                : PHASE_LABELS[phase].split('&')[0].trim()}
                            </span>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator />

            {/* Account Management (Client Only) */}
            {currentUser?.role === 'client' && (
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeView === 'subscription'}
                        onClick={() => onViewChange('subscription')}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Subscription</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeView === 'profile'}
                        onClick={() => onViewChange('profile')}
                      >
                        <UserCog className="w-4 h-4" />
                        <span>Profile & Org</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}

            {/* Strategy Management (US Strategy Only) */}
            {currentUser?.role === 'us-strategy' && (
              <SidebarGroup>
                <div className="px-2 py-1.5 flex items-center gap-2 text-xs font-medium text-sidebar-foreground/70">
                  <GitMerge className="w-4 h-4" />
                  <span>Strategy Control</span>
                </div>
                <SidebarGroupContent className="mt-2">
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeView === 'strategy-phase-mgmt'}
                        onClick={() => onViewChange('strategy-phase-mgmt')}
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>Phase Management</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}

            {/* Account Management (Internal Roles) */}
            {['us-strategy', 'seo-head', 'seo-junior'].includes(currentUser?.role || '') && (
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeView === 'profile'}
                        onClick={() => onViewChange('profile')}
                      >
                        <UserCog className="w-4 h-4" />
                        <span>My Profile</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
