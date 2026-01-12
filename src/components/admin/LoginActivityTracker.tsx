import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search,
  Activity,
  Clock,
  Globe,
  User,
  LogOut,
  RefreshCw
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LoginActivity } from '@/types/admin';
import { ROLE_LABELS, UserRole } from '@/types';
import { format, formatDistanceToNow } from 'date-fns';

interface LoginActivityTrackerProps {
  activities: LoginActivity[];
  onRefresh: () => void;
}

export function LoginActivityTracker({ activities, onRefresh }: LoginActivityTrackerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<LoginActivity['status'] | 'all'>('all');

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.ipAddress.includes(searchQuery);
    const matchesRole = roleFilter === 'all' || activity.userRole === roleFilter;
    const matchesStatus = statusFilter === 'all' || activity.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const activeSessionsCount = activities.filter(a => a.status === 'active').length;

  const getStatusBadge = (status: LoginActivity['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-success">Active</Badge>;
      case 'logged_out':
        return <Badge variant="secondary">Logged Out</Badge>;
      case 'expired':
        return <Badge variant="outline">Expired</Badge>;
    }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '-';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Login Activity</h2>
          <p className="text-muted-foreground">Track user login sessions and security events</p>
        </div>
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10 text-success">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeSessionsCount}</p>
              <p className="text-xs text-muted-foreground">Active Sessions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-info/10 text-info">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activities.length}</p>
              <p className="text-xs text-muted-foreground">Total Logins (24h)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10 text-warning">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{new Set(activities.map(a => a.ipAddress)).size}</p>
              <p className="text-xs text-muted-foreground">Unique IPs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary text-secondary-foreground">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activities.filter(a => a.status === 'logged_out').length}</p>
              <p className="text-xs text-muted-foreground">Logged Out</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>View detailed login history and session information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or IP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as UserRole | 'all')}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="us-strategy">US Strategy</SelectItem>
                <SelectItem value="india-head">India Head</SelectItem>
                <SelectItem value="india-junior">India Junior</SelectItem>
                <SelectItem value="client">Client</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as LoginActivity['status'] | 'all')}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="logged_out">Logged Out</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Login Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.map(activity => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                          {activity.userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="font-medium">{activity.userName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{ROLE_LABELS[activity.userRole]}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{activity.ipAddress}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{format(activity.loginAt, 'MMM d, yyyy')}</span>
                        <span className="text-xs text-muted-foreground">{format(activity.loginAt, 'h:mm a')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">
                          {activity.status === 'active' 
                            ? formatDistanceToNow(activity.loginAt, { addSuffix: false })
                            : formatDuration(activity.sessionDuration)
                          }
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(activity.status)}</TableCell>
                  </TableRow>
                ))}
                
                {filteredActivities.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No login activity found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
