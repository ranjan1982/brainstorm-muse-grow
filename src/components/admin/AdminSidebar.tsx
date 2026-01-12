import { useState } from 'react';
import {
  Users,
  CreditCard,
  Layers,
  ClipboardList,
  UserCog,
  Mail,
  Send,
  Shield,
  Activity,
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
  Percent,
  RefreshCw,
  Clock,
  FileText,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdminView } from '@/types/admin';
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';

interface AdminSidebarProps {
  activeView: AdminView;
  onViewChange: (view: AdminView) => void;
  badges?: {
    pendingRefunds?: number;
    pendingTrials?: number;
    activeLogins?: number;
  };
}

interface MenuSection {
  id: string;
  title: string;
  icon: React.ElementType;
  items: {
    view: AdminView;
    label: string;
    icon: React.ElementType;
    badge?: number;
  }[];
}

export function AdminSidebar({ activeView, onViewChange, badges = {} }: AdminSidebarProps) {
  const [openSections, setOpenSections] = useState<string[]>(['clients', 'phases']);

  const menuSections: MenuSection[] = [
    {
      id: 'clients',
      title: 'Client & Subscription',
      icon: Users,
      items: [
        { view: 'clients', label: 'Client Management', icon: Users },
        { view: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
        { view: 'trials', label: 'Trial Extensions', icon: Clock, badge: badges.pendingTrials },
        { view: 'coupons', label: 'Discount Coupons', icon: Percent },
        { view: 'refunds', label: 'Refund Management', icon: RefreshCw, badge: badges.pendingRefunds },
      ]
    },
    {
      id: 'phases',
      title: 'Work Phases & Tasks',
      icon: Layers,
      items: [
        { view: 'work-phases', label: 'Work Phases', icon: Layers },
        { view: 'task-templates', label: 'Task Templates', icon: ClipboardList },
      ]
    },
    {
      id: 'users',
      title: 'User Management',
      icon: UserCog,
      items: [
        { view: 'users', label: 'Team Users', icon: UserCog },
        { view: 'email-templates', label: 'Email Templates', icon: Mail },
      ]
    },
    {
      id: 'email-blast',
      title: 'Email Blast',
      icon: Send,
      items: [
        { view: 'email-blast', label: 'Send Broadcast', icon: Send },
      ]
    },
    {
      id: 'security',
      title: 'Security & Audit',
      icon: Shield,
      items: [
        { view: 'login-activity', label: 'Login Activity', icon: Activity, badge: badges.activeLogins },
      ]
    }
  ];

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isItemActive = (view: AdminView) => activeView === view;

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
            <Settings className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Admin Portal</span>
            <span className="text-xs text-muted-foreground">Portal Management</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {/* Dashboard Link */}
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

        {/* Collapsible Menu Sections */}
        {menuSections.map((section) => (
          <SidebarGroup key={section.id}>
            <Collapsible
              open={openSections.includes(section.id)}
              onOpenChange={() => toggleSection(section.id)}
            >
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between px-2 py-1.5 hover:bg-sidebar-accent rounded-md cursor-pointer">
                  <div className="flex items-center gap-2 text-xs font-medium text-sidebar-foreground/70">
                    <section.icon className="w-4 h-4" />
                    <span>{section.title}</span>
                  </div>
                  {openSections.includes(section.id) ? (
                    <ChevronDown className="w-4 h-4 text-sidebar-foreground/50" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-sidebar-foreground/50" />
                  )}
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarGroupContent className="mt-1">
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.view}>
                        <SidebarMenuButton
                          isActive={isItemActive(item.view)}
                          onClick={() => onViewChange(item.view)}
                          className="pl-6"
                        >
                          <item.icon className="w-4 h-4" />
                          <span className="flex-1">{item.label}</span>
                          {item.badge !== undefined && item.badge > 0 && (
                            <Badge variant="destructive" className="ml-auto h-5 min-w-5 px-1 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
