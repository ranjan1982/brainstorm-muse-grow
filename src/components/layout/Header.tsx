import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { Badge } from '@/components/ui/badge';
import { ROLE_LABELS, UserRole, SUBSCRIPTION_TIER_LABELS } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, LogOut, User, LayoutDashboard, Zap, Building2, Check } from 'lucide-react';

export function Header() {
  const {
    currentUser,
    isAuthenticated,
    logout,
    login,
    clients,
    currentClient,
    setCurrentClient,
    getClientSubscription
  } = useApp();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  const roles: UserRole[] = ['admin', 'us-strategy', 'seo-head', 'seo-junior', 'client'];
  const canSwitchClients = currentUser?.role === 'us-strategy' || currentUser?.role === 'seo-head' || currentUser?.role === 'seo-junior';
  const activeClients = clients.filter(c => c.isActive);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isLandingPage ? 'bg-transparent' : 'bg-background/80 backdrop-blur-xl border-b border-border/50'
      }`}>
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
            <Zap className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className={`font-bold text-xl ${isLandingPage ? 'text-primary-foreground' : 'text-foreground'}`}>
            SEO Suite
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {!isAuthenticated && (
            <>
              <Link to="/pricing" className={`text-sm font-medium transition-colors hover:text-accent ${isLandingPage ? 'text-primary-foreground/80 hover:text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}>
                Pricing
              </Link>
              <Link to="/login" className={`text-sm font-medium transition-colors hover:text-accent ${isLandingPage ? 'text-primary-foreground/80 hover:text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}>
                Login
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              {/* Account Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="glass" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    {currentUser?.name}
                    <Badge variant={currentUser?.role as any} className="ml-1">
                      {ROLE_LABELS[currentUser?.role || 'client']}
                    </Badge>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block">
                <Button variant={isLandingPage ? "hero-outline" : "outline"} size="sm">
                  Login
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
