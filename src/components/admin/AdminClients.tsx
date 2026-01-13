
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { SUBSCRIPTION_TIER_LABELS, Client, SubscriptionTier } from '@/types';
import { toast } from 'sonner';
import { Edit2, Building2, CreditCard, Clock, RotateCcw, PauseCircle, Phone, MapPin, Mail } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Download, AlertTriangle, UserCheck, UserX, Monitor, Activity, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminClientsProps {
    defaultFilter?: 'all' | 'active' | 'inactive' | 'incomplete';
}

export function AdminClients({ defaultFilter = 'all' }: AdminClientsProps) {
    const { clients, getClientSubscription, getClientPaymentHistory, updateClientInfo, updateSubscriptionStatus, refundPayment, upgradeSubscription } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState(defaultFilter);

    // Detailed View State
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [activeTab, setActiveTab] = useState('profile');

    const filteredClients = clients.filter(client => {
        const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        if (filterStatus === 'active') return client.isActive;
        if (filterStatus === 'inactive') return !client.isActive;
        if (filterStatus === 'incomplete') {
            const payments = getClientPaymentHistory(client.id);
            // Incomplete: Active or Inactive user but NO payments made ever
            return payments.length === 0;
        }

        return true;
    });

    const handleViewClient = (client: Client) => {
        setSelectedClient(client);
        setIsDetailOpen(true);
        setActiveTab('profile'); // Default tab
    };

    // Helper to get client data for the selected client in detail view
    const detailClientData = selectedClient;
    const detailClientSub = detailClientData ? getClientSubscription(detailClientData.id) : undefined;
    const detailClientPayments = detailClientData ? getClientPaymentHistory(detailClientData.id) : [];
    // Mock login history for demo
    const detailLoginHistory = useApp().loginHistory.filter(h => h.userId === detailClientData?.id);

    // Handlers for Detail View actions
    const onSaveProfile = (updatedClient: Client) => {
        updateClientInfo(updatedClient.id, updatedClient);
        toast.success('Client profile updated');
    };

    const onSubscriptionAction = (action: 'pause' | 'cancel' | 'resume', subId: string) => {
        if (action === 'cancel') {
            if (confirm('Are you sure you want to cancel this subscription?')) {
                updateSubscriptionStatus(subId, 'cancelled');
                toast.success('Subscription cancelled');
            }
        } else if (action === 'pause') {
            updateSubscriptionStatus(subId, 'paused');
            toast.success('Subscription paused');
        } else if (action === 'resume') {
            updateSubscriptionStatus(subId, 'active');
            toast.success('Subscription resumed');
        }
    };

    const { extendSubscriptionTrial } = useApp();
    const onExtendTrial = (subId: string, days: number) => {
        extendSubscriptionTrial(subId, days);
        toast.success(`Trial extended by ${days} days`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Clients Management</h2>
                    <p className="text-muted-foreground">Manage client profiles, subscriptions, and billing</p>
                </div>
                <div className="flex gap-2">
                    <Select value={filterStatus} onValueChange={(v: any) => setFilterStatus(v)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Clients</SelectItem>
                            <SelectItem value="active">Active Members</SelectItem>
                            <SelectItem value="inactive">Inactive Members</SelectItem>
                            <SelectItem value="incomplete">Incomplete Reg.</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-[250px]"
                    />
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Client / Company</TableHead>
                                <TableHead>Contact Info</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead>Billing</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredClients.map(client => {
                                const sub = getClientSubscription(client.id);
                                return (
                                    <TableRow key={client.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium hover:text-primary cursor-pointer transition-colors" onClick={() => handleViewClient(client)}>{client.company}</span>
                                                <span className="text-xs text-muted-foreground">{client.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1.5 text-sm">
                                                <a href={`mailto:${client.email}`} className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    <span className="truncate max-w-[180px]">{client.email}</span>
                                                </a>
                                                {client.phone && (
                                                    <a href={`tel:${client.phone}`} className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                                                        <Phone className="w-3.5 h-3.5" />
                                                        <span>{client.phone}</span>
                                                    </a>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {sub ? (
                                                <Badge variant="outline" className="font-semibold">
                                                    {SUBSCRIPTION_TIER_LABELS[sub.tier]}
                                                </Badge>
                                            ) : <span className="text-muted-foreground">-</span>}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={client.isActive ? 'default' : 'secondary'} className={client.isActive ? 'bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border-0' : ''}>
                                                {client.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-xs text-muted-foreground">
                                                {client.createdAt ? format(new Date(client.createdAt), 'MMM dd, yyyy') : '-'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-sm">
                                                <span className="font-medium">{sub ? `$${sub.monthlyPrice}` : '-'}</span>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {sub?.nextBillingDate ? format(new Date(sub.nextBillingDate), 'MMM dd') : ''}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" variant="ghost" className="h-8 md:h-9 hover:bg-secondary" onClick={() => handleViewClient(client)}>
                                                <Eye className="w-4 h-4 mr-2" /> View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Detailed Client View Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent className="w-[400px] sm:w-[600px] sm:max-w-[700px] overflow-y-auto">
                    <SheetHeader className="mb-6">
                        <SheetTitle>Client Details: {detailClientData?.company}</SheetTitle>
                        <SheetDescription>Manage profile, subscription, and view history</SheetDescription>
                    </SheetHeader>

                    {detailClientData && (
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-6">
                                <TabsTrigger value="profile">Profile</TabsTrigger>
                                <TabsTrigger value="subscription">Subscription & Billing</TabsTrigger>
                                <TabsTrigger value="history">Login History</TabsTrigger>
                            </TabsList>

                            {/* Profile Tab */}
                            <TabsContent value="profile" className="space-y-4">
                                <div className="grid gap-4 py-2">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center bg-secondary/20 p-4 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                {detailClientData.isActive ? <UserCheck className="text-green-500 w-5 h-5" /> : <UserX className="text-destructive w-5 h-5" />}
                                                <span className="font-medium">Account Status</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Label htmlFor="active-mode">Active?</Label>
                                                <Switch
                                                    id="active-mode"
                                                    checked={detailClientData.isActive}
                                                    onCheckedChange={(c) => {
                                                        onSaveProfile({ ...detailClientData, isActive: c });
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Company Name</Label>
                                                <Input
                                                    value={detailClientData.company}
                                                    onChange={e => setSelectedClient({ ...detailClientData, company: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Industry</Label>
                                                <Input
                                                    value={detailClientData.industry || ''}
                                                    placeholder="e.g. Legal, Medical"
                                                    onChange={e => setSelectedClient({ ...detailClientData, industry: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>First Name</Label>
                                                <Input
                                                    value={detailClientData.name.split(' ')[0]}
                                                    onChange={e => {
                                                        const names = detailClientData.name.split(' ');
                                                        const newName = [e.target.value, ...names.slice(1)].join(' ');
                                                        setSelectedClient({ ...detailClientData, name: newName });
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Last Name</Label>
                                                <Input
                                                    value={detailClientData.name.split(' ').slice(1).join(' ')}
                                                    onChange={e => {
                                                        const names = detailClientData.name.split(' ');
                                                        const newName = [names[0], e.target.value].join(' ');
                                                        setSelectedClient({ ...detailClientData, name: newName });
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Email</Label>
                                                <Input
                                                    value={detailClientData.email}
                                                    onChange={e => setSelectedClient({ ...detailClientData, email: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Phone</Label>
                                                <Input
                                                    value={detailClientData.phone || ''}
                                                    onChange={e => setSelectedClient({ ...detailClientData, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Website</Label>
                                            <Input
                                                value={detailClientData.website || ''}
                                                placeholder="https://example.com"
                                                onChange={e => setSelectedClient({ ...detailClientData, website: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Address</Label>
                                            <Input
                                                value={detailClientData.address || ''}
                                                onChange={e => setSelectedClient({ ...detailClientData, address: e.target.value })}
                                            />
                                        </div>

                                        <Button onClick={() => onSaveProfile(detailClientData)} className="w-full">Save Changes</Button>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Subscription Tab */}
                            <TabsContent value="subscription" className="space-y-6">
                                {detailClientSub ? (
                                    <div className="space-y-6">
                                        <Card>
                                            <CardContent className="p-6 space-y-6">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-bold text-lg">{SUBSCRIPTION_TIER_LABELS[detailClientSub.tier]} Plan</h3>
                                                        <div className="flex gap-2 mt-2">
                                                            <Badge variant={detailClientSub.status === 'active' ? 'default' : detailClientSub.status === 'trial' ? 'outline' : 'destructive'} className="capitalize">
                                                                {detailClientSub.status}
                                                            </Badge>
                                                            {detailClientSub.status === 'trial' && (
                                                                <Badge variant="secondary">Trial ends {format(detailClientSub.trialEndDate || new Date(), 'MMM dd')}</Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold">${detailClientSub.monthlyPrice}</div>
                                                        <div className="text-sm text-muted-foreground">per month</div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="space-y-2">
                                                        <Label>Change Plan</Label>
                                                        <Select defaultValue={detailClientSub.tier} onValueChange={(v) => upgradeSubscription(detailClientData.id, v as SubscriptionTier)}>
                                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="starter">Starter</SelectItem>
                                                                <SelectItem value="growth">Growth</SelectItem>
                                                                <SelectItem value="enterprise">Enterprise</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Status Action</Label>
                                                        {detailClientSub.status === 'active' || detailClientSub.status === 'trial' ? (
                                                            <div className="flex gap-2">
                                                                <Button variant="outline" size="sm" onClick={() => onSubscriptionAction('pause', detailClientSub.id)} className="flex-1">Pause</Button>
                                                                <Button variant="destructive" size="sm" onClick={() => onSubscriptionAction('cancel', detailClientSub.id)} className="flex-1">Cancel</Button>
                                                            </div>
                                                        ) : detailClientSub.status === 'paused' ? (
                                                            <Button variant="outline" size="sm" onClick={() => onSubscriptionAction('resume', detailClientSub.id)} className="w-full">Resume</Button>
                                                        ) : (
                                                            <div className="text-sm text-muted-foreground py-2">Subscription is {detailClientSub.status}</div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Trial Extension */}
                                                {detailClientSub.status === 'trial' && (
                                                    <div className="border-t pt-4">
                                                        <Label className="mb-2 block">Extend Trial Period</Label>
                                                        <div className="flex gap-2">
                                                            <Button size="sm" variant="outline" onClick={() => onExtendTrial(detailClientSub.id, 7)}>+7 Days</Button>
                                                            <Button size="sm" variant="outline" onClick={() => onExtendTrial(detailClientSub.id, 14)}>+14 Days</Button>
                                                            <Button size="sm" variant="outline" onClick={() => onExtendTrial(detailClientSub.id, 30)}>+30 Days</Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>

                                        {/* Payment History */}
                                        <div className="space-y-3">
                                            <h4 className="font-semibold flex items-center gap-2"><CreditCard className="w-4 h-4" /> Payment History</h4>
                                            <div className="border rounded-md overflow-hidden">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Date</TableHead>
                                                            <TableHead>Amount</TableHead>
                                                            <TableHead>Status</TableHead>
                                                            <TableHead className="text-right">Action</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {detailClientPayments.map(payment => (
                                                            <TableRow key={payment.id}>
                                                                <TableCell>{format(payment.paymentDate, 'MMM dd, yyyy')}</TableCell>
                                                                <TableCell>${payment.amount}</TableCell>
                                                                <TableCell>
                                                                    <span className={cn(
                                                                        "text-xs px-2 py-1 rounded-full",
                                                                        payment.status === 'paid' ? "bg-green-100 text-green-700" :
                                                                            payment.status === 'refunded' ? "bg-red-100 text-red-700" :
                                                                                "bg-gray-100 text-gray-700"
                                                                    )}>
                                                                        {payment.status}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <div className="flex justify-end gap-1">
                                                                        <Button size="icon" variant="ghost" className="h-6 w-6" title="Download Invoice">
                                                                            <Download className="w-3 h-3" />
                                                                        </Button>
                                                                        {payment.status === 'paid' && (
                                                                            <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive"
                                                                                title="Refund"
                                                                                onClick={() => {
                                                                                    if (confirm('Issue full refund?')) refundPayment(payment.id);
                                                                                }}
                                                                            >
                                                                                <RotateCcw className="w-3 h-3" />
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                        {detailClientPayments.length === 0 && (
                                                            <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-4">No payment history found</TableCell></TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground bg-secondary/20 rounded-lg">
                                        <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        No active subscription found for this client.
                                    </div>
                                )}
                            </TabsContent>

                            {/* Login History Tab */}
                            <TabsContent value="history" className="space-y-4">
                                <div className="border rounded-md">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Date & Time</TableHead>
                                                <TableHead>IP Address</TableHead>
                                                <TableHead>Session Time</TableHead>
                                                <TableHead>User</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {detailLoginHistory?.length ? detailLoginHistory.map(log => (
                                                <TableRow key={log.id}>
                                                    <TableCell>{format(log.loginTime, 'MMM dd, yyyy HH:mm')}</TableCell>
                                                    <TableCell className="font-mono text-xs">{log.ipAddress}</TableCell>
                                                    <TableCell>{log.sessionTime}</TableCell>
                                                    <TableCell>{log.userName}</TableCell>
                                                </TableRow>
                                            )) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                        No login history available.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>
                        </Tabs>
                    )}
                </SheetContent>
            </Sheet >
        </div >
    );
}
