import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus,
  Search,
  UserPlus,
  UserX,
  UserCheck,
  MoreVertical,
  Mail
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminUser } from '@/types/admin';
import { ROLE_LABELS, UserRole } from '@/types';
import { format } from 'date-fns';

interface UserManagementProps {
  users: AdminUser[];
  onAddUser: (user: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>) => void;
  onDeactivateUser: (userId: string) => void;
  onActivateUser: (userId: string) => void;
}

export function UserManagement({
  users,
  onAddUser,
  onDeactivateUser,
  onActivateUser
}: UserManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'india-junior' as UserRole,
    department: 'seo-team' as AdminUser['department'],
    isActive: true
  });

  const backofficeUsers = users.filter(u => u.department === 'backoffice');
  const seoTeamUsers = users.filter(u => u.department === 'seo-team');

  const filterUsers = (userList: AdminUser[]) => {
    if (!searchQuery) return userList;
    return userList.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleAddUser = () => {
    onAddUser(formData);
    setIsDialogOpen(false);
    setFormData({
      name: '',
      email: '',
      role: 'india-junior',
      department: 'seo-team',
      isActive: true
    });
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'us-strategy': return 'default';
      case 'india-head': return 'secondary';
      default: return 'outline';
    }
  };

  const UserCard = ({ user }: { user: AdminUser }) => (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
          {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">{user.name}</p>
            <Badge variant={getRoleBadgeVariant(user.role)}>
              {ROLE_LABELS[user.role]}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          {user.lastLogin && (
            <p className="text-xs text-muted-foreground mt-0.5">
              Last login: {format(user.lastLogin, 'MMM d, yyyy h:mm a')}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Badge variant={user.isActive ? 'outline' : 'destructive'}>
          {user.isActive ? '✓ Active' : 'Inactive'}
        </Badge>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Mail className="w-4 h-4 mr-2" />
              Send Credentials Email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {user.isActive ? (
              <DropdownMenuItem 
                onClick={() => onDeactivateUser(user.id)}
                className="text-destructive"
              >
                <UserX className="w-4 h-4 mr-2" />
                Deactivate User
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onActivateUser(user.id)}>
                <UserCheck className="w-4 h-4 mr-2" />
                Reactivate User
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">Manage backoffice and SEO team users</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <Tabs defaultValue="seo-team">
        <TabsList>
          <TabsTrigger value="seo-team">
            SEO Team ({seoTeamUsers.length})
          </TabsTrigger>
          <TabsTrigger value="backoffice">
            Backoffice ({backofficeUsers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="seo-team" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Team Members</CardTitle>
              <CardDescription>India SEO Head and Junior team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filterUsers(seoTeamUsers).map(user => (
                  <UserCard key={user.id} user={user} />
                ))}
                {filterUsers(seoTeamUsers).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No SEO team members found.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backoffice" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Backoffice Users</CardTitle>
              <CardDescription>US Strategy Team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filterUsers(backofficeUsers).map(user => (
                  <UserCard key={user.id} user={user} />
                ))}
                {filterUsers(backofficeUsers).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No backoffice users found.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new team member account
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="user@seosuite.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Department</Label>
              <Select
                value={formData.department}
                onValueChange={(value: AdminUser['department']) => setFormData({ ...formData, department: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seo-team">SEO Team</SelectItem>
                  <SelectItem value="backoffice">Backoffice</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formData.department === 'seo-team' ? (
                    <>
                      <SelectItem value="india-head">India SEO Head</SelectItem>
                      <SelectItem value="india-junior">India SEO Junior</SelectItem>
                    </>
                  ) : (
                    <SelectItem value="us-strategy">US Strategy Team</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddUser}>Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
