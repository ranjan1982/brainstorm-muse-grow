import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Building2, 
  Search, 
  MoreVertical,
  UserX,
  UserCheck,
  XCircle,
  Clock,
  CreditCard,
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
import { Textarea } from '@/components/ui/textarea';
import { Client, Subscription, SUBSCRIPTION_TIER_LABELS } from '@/types';
import { ExtendedSubscription } from '@/types/admin';

interface ClientManagementProps {
  clients: Client[];
  subscriptions: Subscription[] | ExtendedSubscription[];
  onDeactivateClient: (clientId: string) => void;
  onActivateClient: (clientId: string) => void;
  onCancelSubscription: (clientId: string, reason: string) => void;
  onExtendTrial: (clientId: string, days: number) => void;
}

export function ClientManagement({
  clients,
  subscriptions,
  onDeactivateClient,
  onActivateClient,
  onCancelSubscription,
  onExtendTrial
}: ClientManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [dialogType, setDialogType] = useState<'deactivate' | 'cancel' | 'extend' | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [trialDays, setTrialDays] = useState(7);

  const filteredClients = clients.filter(client =>
    client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getClientSubscription = (clientId: string) => {
    return subscriptions.find(s => s.clientId === clientId);
  };

  const handleAction = (client: Client, action: 'deactivate' | 'activate' | 'cancel' | 'extend') => {
    if (action === 'activate') {
      onActivateClient(client.id);
    } else {
      setSelectedClient(client);
      setDialogType(action === 'deactivate' ? 'deactivate' : action);
    }
  };

  const confirmAction = () => {
    if (!selectedClient) return;

    switch (dialogType) {
      case 'deactivate':
        onDeactivateClient(selectedClient.id);
        break;
      case 'cancel':
        onCancelSubscription(selectedClient.id, cancellationReason);
        break;
      case 'extend':
        onExtendTrial(selectedClient.id, trialDays);
        break;
    }

    setDialogType(null);
    setSelectedClient(null);
    setCancellationReason('');
    setTrialDays(7);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Client Management</h2>
          <p className="text-muted-foreground">Manage clients, subscriptions, and account status</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered Clients ({filteredClients.length})</CardTitle>
          <CardDescription>View and manage all registered client accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredClients.map(client => {
              const subscription = getClientSubscription(client.id);
              const isTrialStatus = (subscription as ExtendedSubscription)?.status === 'trial';
              
              return (
                <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{client.company}</p>
                      <p className="text-sm text-muted-foreground">{client.name} • {client.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {subscription && (
                      <Badge variant={subscription.status === 'active' ? 'default' : subscription.status === 'trial' ? 'outline' : 'secondary'}>
                        {isTrialStatus ? '🧪 Trial' : SUBSCRIPTION_TIER_LABELS[subscription.tier]}
                      </Badge>
                    )}
                    <Badge variant={client.isActive ? 'outline' : 'destructive'}>
                      {client.isActive ? '✓ Active' : 'Inactive'}
                    </Badge>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {}}>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {}}>
                          <CreditCard className="w-4 h-4 mr-2" />
                          View Subscription
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {isTrialStatus && (
                          <DropdownMenuItem onClick={() => handleAction(client, 'extend')}>
                            <Clock className="w-4 h-4 mr-2" />
                            Extend Trial
                          </DropdownMenuItem>
                        )}
                        {client.isActive ? (
                          <DropdownMenuItem 
                            onClick={() => handleAction(client, 'deactivate')}
                            className="text-destructive"
                          >
                            <UserX className="w-4 h-4 mr-2" />
                            Deactivate Client
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleAction(client, 'activate')}>
                            <UserCheck className="w-4 h-4 mr-2" />
                            Reactivate Client
                          </DropdownMenuItem>
                        )}
                        {subscription?.status === 'active' && (
                          <DropdownMenuItem 
                            onClick={() => handleAction(client, 'cancel')}
                            className="text-destructive"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Cancel Subscription
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
            
            {filteredClients.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No clients found matching your search.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Deactivate Dialog */}
      <Dialog open={dialogType === 'deactivate'} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate Client</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate {selectedClient?.company}? 
              The client will lose access to their dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmAction}>Deactivate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Subscription Dialog */}
      <Dialog open={dialogType === 'cancel'} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Cancel the subscription for {selectedClient?.company}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Cancellation Reason</Label>
              <Textarea
                placeholder="Enter reason for cancellation..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmAction}>Confirm Cancellation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Extend Trial Dialog */}
      <Dialog open={dialogType === 'extend'} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Extend Trial Period</DialogTitle>
            <DialogDescription>
              Extend the trial for {selectedClient?.company}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Additional Days</Label>
              <Input
                type="number"
                min={1}
                max={30}
                value={trialDays}
                onChange={(e) => setTrialDays(parseInt(e.target.value) || 7)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>Cancel</Button>
            <Button onClick={confirmAction}>Extend Trial</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
