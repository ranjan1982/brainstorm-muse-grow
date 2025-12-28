import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { Badge } from '@/components/ui/badge';
import { ROLE_LABELS, UserRole } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, LogOut, User, LayoutDashboard, Zap } from 'lucide-react';

export function Header() {
  const { currentUser, isAuthenticated, logout, login } = useApp();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  const roles: UserRole[] = ['admin', 'us-strategy', 'india-head', 'india-junior', 'client'];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isLandingPage ? 'bg-transparent' : 'bg-background/80 backdrop-blur-xl border-b border-border/50'
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
              <Link to="/pricing" className={`text-sm font-medium transition-colors hover:text-accent ${
                isLandingPage ? 'text-primary-foreground/80 hover:text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}>
                Pricing
              </Link>
              <Link to="/register" className={`text-sm font-medium transition-colors hover:text-accent ${
                isLandingPage ? 'text-primary-foreground/80 hover:text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}>
                Get Started
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
                  <DropdownMenuLabel>Switch Role (Demo)</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {roles.map((role) => (
                    <DropdownMenuItem
                      key={role}
                      onClick={() => login(role)}
                      className="cursor-pointer"
                    >
                      <Badge variant={role as any} className="mr-2">
                        {ROLE_LABELS[role]}
                      </Badge>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              {/* Role Switcher for Demo */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={isLandingPage ? "hero-outline" : "outline"} size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    Demo Login
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Select a Role</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {roles.map((role) => (
                    <DropdownMenuItem
                      key={role}
                      onClick={() => login(role)}
                      className="cursor-pointer"
                    >
                      <Badge variant={role as any} className="mr-2">
                        {ROLE_LABELS[role]}
                      </Badge>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Link to="/register">
                <Button variant={isLandingPage ? "hero" : "accent"} size="sm">
                  Start Free Trial
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
