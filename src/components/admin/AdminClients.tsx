
import { useState, useEffect } from 'react';
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
import { CalendarIcon, Download, AlertTriangle, UserCheck, UserX, Monitor, Activity, Eye, ArrowLeft, Plus, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminClientsProps {
    defaultFilter?: 'all' | 'active' | 'inactive' | 'incomplete' | 'trial';
}

export function AdminClients({ defaultFilter = 'all' }: AdminClientsProps) {
    const { clients, getClientSubscription, getClientPaymentHistory, updateClientInfo, updateSubscriptionStatus, refundPayment, upgradeSubscription, addManualClient } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState(defaultFilter);

    // Detailed View State
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [activeTab, setActiveTab] = useState('profile');

    const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
    const [newClientState, setNewClientState] = useState({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        phone: '',
        website: '',
        industry: '',
        tier: 'starter' as SubscriptionTier,
        billingCycle: 'monthly' as 'monthly' | 'yearly' | 'one-time',
        monthlyPrice: 100,
        sendCredentials: true,
        usStrategyId: '',
        seoHeadId: '',
        seoJuniorId: '',
        track: 'local' as any,
    });

    const { users } = useApp();
    const usStrategyUsers = users.filter(u => u.role === 'us-strategy');
    const seoHeadUsers = users.filter(u => u.role === 'seo-head');
    const seoJuniorUsers = users.filter(u => u.role === 'seo-junior');

    // Update form when tiers or roles might change defaults
    useEffect(() => {
        if (!isAddClientDialogOpen) return;

        const defaultUS = users.find(u => u.role === 'us-strategy' && u.isDefaultAssociate)?.id || '';
        const defaultHead = users.find(u => u.role === 'seo-head' && u.isDefaultAssociate)?.id || '';
        const defaultJunior = users.find(u => u.role === 'seo-junior' && u.isDefaultAssociate)?.id || '';

        setNewClientState(prev => ({
            ...prev,
            usStrategyId: defaultUS,
            seoHeadId: defaultHead,
            seoJuniorId: defaultJunior
        }));
    }, [isAddClientDialogOpen, users]);

    const handleAddManualClient = () => {
        if (!newClientState.firstName || !newClientState.email || !newClientState.company) {
            toast.error('First Name, Email and Company are required');
            return;
        }

        const fullName = `${newClientState.firstName} ${newClientState.lastName}`.trim();

        addManualClient(
            {
                name: fullName,
                email: newClientState.email,
                company: newClientState.company,
                phone: newClientState.phone,
                website: newClientState.website,
                industry: newClientState.industry,
                associatedTeam: {
                    usStrategyId: newClientState.usStrategyId || undefined,
                    seoHeadId: newClientState.seoHeadId || undefined,
                    seoJuniorId: newClientState.seoJuniorId || undefined,
                }
            },
            {
                tier: newClientState.tier,
                track: newClientState.track,
                monthlyPrice: newClientState.monthlyPrice,
                billingCycle: newClientState.billingCycle
            }
        );

        if (newClientState.sendCredentials) {
            toast.success('Client added manually. Login details sent to client.');
        } else {
            toast.success('Client added manually.');
        }

        setIsAddClientDialogOpen(false);
        setNewClientState({
            firstName: '',
            lastName: '',
            email: '',
            company: '',
            phone: '',
            website: '',
            industry: '',
            tier: 'starter',
            billingCycle: 'monthly',
            monthlyPrice: 100,
            sendCredentials: true,
            usStrategyId: '',
            seoHeadId: '',
            seoJuniorId: '',
            track: 'local',
        });
    };

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
        if (filterStatus === 'trial') {
            const sub = getClientSubscription(client.id);
            return sub?.status === 'trial';
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

    if (isDetailOpen && detailClientData) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => setIsDetailOpen(false)}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Clients
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Client Details: {detailClientData.company}</h2>
                        <p className="text-muted-foreground">Manage profile, subscription, and view history</p>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 md:w-[800px] mb-6">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="subscription">Subscription & Billing</TabsTrigger>
                        <TabsTrigger value="team">Team Association</TabsTrigger>
                        <TabsTrigger value="history">Login History</TabsTrigger>
                    </TabsList>

                    {/* Profile Tab */}
                    <TabsContent value="profile" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>Update client's personal and company details.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
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

                                <div className="grid grid-cols-2 gap-6">
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

                                <div className="grid grid-cols-2 gap-6">
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

                                <div className="grid grid-cols-2 gap-6">
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

                                <div className="space-y-4 border rounded-md p-4 bg-secondary/5">
                                    <Label className="font-semibold text-base">Billing Address</Label>
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Address Line 1</Label>
                                            <Input
                                                placeholder="123 Main St"
                                                value={detailClientData.billingAddress?.line1 || detailClientData.address || ''}
                                                onChange={e => setSelectedClient({
                                                    ...detailClientData,
                                                    address: e.target.value, // Keep sync for backward compat
                                                    billingAddress: { ...detailClientData.billingAddress, line1: e.target.value, city: detailClientData.billingAddress?.city || '', state: detailClientData.billingAddress?.state || '', zip: detailClientData.billingAddress?.zip || '' }
                                                })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Address Line 2 (Optional)</Label>
                                            <Input
                                                placeholder="Suite 100"
                                                value={detailClientData.billingAddress?.line2 || ''}
                                                onChange={e => setSelectedClient({
                                                    ...detailClientData,
                                                    billingAddress: { ...detailClientData.billingAddress!, line2: e.target.value }
                                                })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="space-y-1">
                                                <Label className="text-xs text-muted-foreground">City</Label>
                                                <Input
                                                    placeholder="City"
                                                    value={detailClientData.billingAddress?.city || ''}
                                                    onChange={e => setSelectedClient({
                                                        ...detailClientData,
                                                        billingAddress: { ...detailClientData.billingAddress!, city: e.target.value }
                                                    })}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs text-muted-foreground">State</Label>
                                                <Input
                                                    placeholder="State"
                                                    value={detailClientData.billingAddress?.state || ''}
                                                    onChange={e => setSelectedClient({
                                                        ...detailClientData,
                                                        billingAddress: { ...detailClientData.billingAddress!, state: e.target.value }
                                                    })}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs text-muted-foreground">Zip Code</Label>
                                                <Input
                                                    placeholder="Zip"
                                                    value={detailClientData.billingAddress?.zip || ''}
                                                    onChange={e => setSelectedClient({
                                                        ...detailClientData,
                                                        billingAddress: { ...detailClientData.billingAddress!, zip: e.target.value }
                                                    })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button onClick={() => onSaveProfile(detailClientData)} size="lg">Save Changes</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="team" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Team Association</CardTitle>
                                <CardDescription>Assign specific team members to manage specialists for {detailClientData.company}.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {detailClientData && (
                                    <TeamAssignmentSection
                                        key={detailClientData.id}
                                        clientId={detailClientData.id}
                                        initialTeam={detailClientData.associatedTeam || {}}
                                    />
                                )}
                            </CardContent>
                        </Card>
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
                                                    <Badge variant="outline" className="bg-blue-50">
                                                        {detailClientSub.track.toUpperCase()} TRACK
                                                    </Badge>
                                                    {detailClientSub.status === 'trial' && (
                                                        <Badge variant="secondary">Trial ends {format(detailClientSub.trialEndDate || new Date(), 'MMM dd')}</Badge>
                                                    )}
                                                </div>
                                                <div className="mt-3 space-y-1">
                                                    <div className="text-xs text-muted-foreground">
                                                        <span className="font-medium text-foreground">Profile ID:</span> {detailClientSub.id}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        <span className="font-medium text-foreground">Created:</span> {format(new Date(detailClientSub.startDate), 'MMM dd, yyyy')}
                                                    </div>
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
                                    <div className="border rounded-md overflow-hidden bg-white">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Date</TableHead>
                                                    <TableHead>Transaction ID</TableHead>
                                                    <TableHead>Amount</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="text-right">Action</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {detailClientPayments.map(payment => (
                                                    <TableRow key={payment.id}>
                                                        <TableCell>{format(payment.paymentDate, 'MMM dd, yyyy')}</TableCell>
                                                        <TableCell className="font-mono text-xs text-muted-foreground">
                                                            {payment.transactionId || `TXN-${payment.id.substring(0, 8)}`}
                                                        </TableCell>
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
                                                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-4">No payment history found</TableCell></TableRow>
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
                        <div className="border rounded-md bg-white">
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
            </div>
        );
    }

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
                            <SelectItem value="trial">Trial Subscribers</SelectItem>
                            <SelectItem value="incomplete">Incomplete Reg.</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-[250px]"
                    />
                    <Button onClick={() => setIsAddClientDialogOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" /> Add Client
                    </Button>
                </div>
            </div>

            <Dialog open={isAddClientDialogOpen} onOpenChange={setIsAddClientDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New Client Manually</DialogTitle>
                        <DialogDescription>
                            Create a client account without payment gateway. Subscription will be activated immediately.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-4">
                        <div className="col-span-1 space-y-2">
                            <Label>Client Name (Contact person)</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <Label className="text-[10px] text-muted-foreground uppercase font-bold">First Name</Label>
                                    <Input
                                        placeholder="e.g. John"
                                        value={newClientState.firstName}
                                        onChange={e => setNewClientState({ ...newClientState, firstName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] text-muted-foreground uppercase font-bold">Last Name</Label>
                                    <Input
                                        placeholder="Doe"
                                        value={newClientState.lastName}
                                        onChange={e => setNewClientState({ ...newClientState, lastName: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Client Email</Label>
                            <Input
                                type="email"
                                placeholder="john@company.com"
                                value={newClientState.email}
                                onChange={e => setNewClientState({ ...newClientState, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Company Name</Label>
                            <Input
                                placeholder="Company LLC"
                                value={newClientState.company}
                                onChange={e => setNewClientState({ ...newClientState, company: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input
                                placeholder="+1 (555) 000-0000"
                                value={newClientState.phone}
                                onChange={e => setNewClientState({ ...newClientState, phone: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2 border-t pt-4">
                            <Label>Service Track</Label>
                            <Select
                                value={newClientState.track}
                                onValueChange={(v: any) => setNewClientState({ ...newClientState, track: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Track" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="local">LOCAL TRACK</SelectItem>
                                    <SelectItem value="national">NATIONAL TRACK</SelectItem>
                                    <SelectItem value="hybrid">HYBRID TRACK</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 border-t pt-4">
                            <Label>Subscription Tier</Label>
                            <Select
                                value={newClientState.tier}
                                onValueChange={(v: any) => {
                                    let price = 100; // default for starter monthly
                                    if (v === 'growth') price = 300; // estimated
                                    if (v === 'enterprise') price = 500; // estimated
                                    setNewClientState({ ...newClientState, tier: v, monthlyPrice: price, billingCycle: 'monthly' });
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Tier" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="starter">Starter</SelectItem>
                                    <SelectItem value="growth">Growth</SelectItem>
                                    <SelectItem value="enterprise">Enterprise</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-2 space-y-2 border-t pt-4">
                            <Label>Subscription Plan / Cycle</Label>
                            <Select
                                value={newClientState.billingCycle}
                                onValueChange={(v: any) => {
                                    let price = newClientState.monthlyPrice;
                                    if (v === 'one-time') {
                                        if (newClientState.tier === 'starter') price = 500;
                                        else if (newClientState.tier === 'growth') price = 1200;
                                        else price = 2500;
                                    } else {
                                        if (newClientState.tier === 'starter') price = 100;
                                        else if (newClientState.tier === 'growth') price = 300;
                                        else price = 500;
                                    }
                                    setNewClientState({ ...newClientState, billingCycle: v, monthlyPrice: price });
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Plan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="one-time">
                                        {newClientState.tier.charAt(0).toUpperCase() + newClientState.tier.slice(1)} onetime ({newClientState.tier === 'starter' ? '$500.00' : (newClientState.tier === 'growth' ? '$1200.00' : '$2500.00')})
                                    </SelectItem>
                                    <SelectItem value="monthly">
                                        {newClientState.tier.charAt(0).toUpperCase() + newClientState.tier.slice(1)} Monthly ({newClientState.tier === 'starter' ? '$100.00' : (newClientState.tier === 'growth' ? '$300.00' : '$500.00')})
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-2 space-y-2 border-t pt-4">
                            <Label>Industry</Label>
                            <Input
                                placeholder="e.g. Legal Services"
                                value={newClientState.industry}
                                onChange={e => setNewClientState({ ...newClientState, industry: e.target.value })}
                            />
                        </div>

                        <div className="col-span-2 space-y-4 border-t pt-4">
                            <Label className="text-base font-semibold">Team Assignment</Label>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>US Strategy</Label>
                                    <Select value={newClientState.usStrategyId || "none"} onValueChange={v => setNewClientState({ ...newClientState, usStrategyId: v === "none" ? "" : v })}>
                                        <SelectTrigger><SelectValue placeholder="Select User" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">None / Not Assigned</SelectItem>
                                            {usStrategyUsers.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>SEO Head</Label>
                                    <Select value={newClientState.seoHeadId || "none"} onValueChange={v => setNewClientState({ ...newClientState, seoHeadId: v === "none" ? "" : v })}>
                                        <SelectTrigger><SelectValue placeholder="Select User" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">None / Not Assigned</SelectItem>
                                            {seoHeadUsers.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>SEO Junior</Label>
                                    <Select value={newClientState.seoJuniorId || "none"} onValueChange={v => setNewClientState({ ...newClientState, seoJuniorId: v === "none" ? "" : v })}>
                                        <SelectTrigger><SelectValue placeholder="Select User" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">None / Not Assigned</SelectItem>
                                            {seoJuniorUsers.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex gap-3 text-sm text-amber-800">
                        <AlertTriangle className="w-5 h-5 shrink-0" />
                        <p>No recurring payment will be collected by the system. Billing must be managed manually outside the portal if required.</p>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <Switch
                            id="send-email"
                            checked={newClientState.sendCredentials}
                            onCheckedChange={(c) => setNewClientState({ ...newClientState, sendCredentials: c })}
                        />
                        <Label htmlFor="send-email" className="text-red-600 font-medium">Will login credential send to client</Label>
                    </div>

                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setIsAddClientDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddManualClient}>Create Client & Send Login</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Client / Company</TableHead>
                                <TableHead>Contact Info</TableHead>
                                <TableHead>Plan & Track</TableHead>
                                <TableHead>Purchase Type</TableHead>
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
                                                <div className="flex flex-col gap-1">
                                                    <Badge variant="outline" className="font-semibold w-fit">
                                                        {SUBSCRIPTION_TIER_LABELS[sub.tier]}
                                                    </Badge>
                                                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{sub.track} track</span>
                                                </div>
                                            ) : <span className="text-muted-foreground">-</span>}
                                        </TableCell>
                                        <TableCell>
                                            {sub ? (
                                                <Badge variant="secondary" className={cn(
                                                    "capitalize font-medium",
                                                    sub.purchaseType === 'manual' ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-slate-50 text-slate-700 border-slate-100"
                                                )}>
                                                    {sub.purchaseType || 'Auto'}
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
                                                    {sub?.status === 'trial' && sub.trialEndDate ? (
                                                        <span className="text-orange-600 font-medium">Trial Ends {format(new Date(sub.trialEndDate), 'MMM dd')}</span>
                                                    ) : (
                                                        sub?.nextBillingDate ? format(new Date(sub.nextBillingDate), 'MMM dd') : ''
                                                    )}
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
        </div >
    );
}

function TeamAssignmentSection({ clientId, initialTeam }: { clientId: string, initialTeam?: Client['associatedTeam'] }) {
    const { users, associateTeamToClient } = useApp();
    const [team, setTeam] = useState({
        usStrategyId: initialTeam?.usStrategyId || '',
        seoHeadId: initialTeam?.seoHeadId || '',
        seoJuniorId: initialTeam?.seoJuniorId || '',
    });
    const [reassignTasks, setReassignTasks] = useState(false);

    // Sync state when initialTeam changes (e.g. switching clients)
    useEffect(() => {
        setTeam({
            usStrategyId: initialTeam?.usStrategyId || '',
            seoHeadId: initialTeam?.seoHeadId || '',
            seoJuniorId: initialTeam?.seoJuniorId || '',
        });
    }, [initialTeam]);

    const usStrategyUsers = users.filter(u => u.role === 'us-strategy');
    const seoHeadUsers = users.filter(u => u.role === 'seo-head');
    const seoJuniorUsers = users.filter(u => u.role === 'seo-junior');

    const handleSave = () => {
        associateTeamToClient(clientId, {
            usStrategyId: team.usStrategyId || undefined,
            seoHeadId: team.seoHeadId || undefined,
            seoJuniorId: team.seoJuniorId || undefined,
        }, reassignTasks);
        toast.success('Team association updated');
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">US Strategy</Label>
                    <Select value={team.usStrategyId || "none"} onValueChange={v => setTeam(prev => ({ ...prev, usStrategyId: v === "none" ? "" : v }))}>
                        <SelectTrigger className="bg-white"><SelectValue placeholder="Select US Strategist" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Not Assigned</SelectItem>
                            {usStrategyUsers.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">SEO Head</Label>
                    <Select value={team.seoHeadId || "none"} onValueChange={v => setTeam(prev => ({ ...prev, seoHeadId: v === "none" ? "" : v }))}>
                        <SelectTrigger className="bg-white"><SelectValue placeholder="Select SEO Head" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Not Assigned</SelectItem>
                            {seoHeadUsers.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">SEO Junior</Label>
                    <Select value={team.seoJuniorId || "none"} onValueChange={v => setTeam(prev => ({ ...prev, seoJuniorId: v === "none" ? "" : v }))}>
                        <SelectTrigger className="bg-white"><SelectValue placeholder="Select SEO Junior" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Not Assigned</SelectItem>
                            {seoJuniorUsers.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <Switch
                    id="reassign"
                    checked={reassignTasks}
                    onCheckedChange={setReassignTasks}
                />
                <div className="space-y-0.5">
                    <Label htmlFor="reassign" className="text-blue-900 font-semibold cursor-pointer">Shift existing tasks to new team members</Label>
                    <p className="text-xs text-blue-700">If enabled, all currently pending tasks for this client will be reassigned to the selected users.</p>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="button" onClick={handleSave} className="gap-2">
                    <Save className="w-4 h-4" /> Save Team Association
                </Button>
            </div>

            <div className="mt-8 pt-6 border-t border-dashed">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Available Resource Pool</p>
                    <Badge variant="outline" className="text-[9px] h-4">Verified Sync</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                    {(users || []).filter(u => u && u.role !== 'client' && u.role !== 'admin').map(u => (
                        <div key={u.id} className="text-[10px] px-2 py-1 bg-secondary/50 rounded-md text-secondary-foreground border border-border/50">
                            {u.name} • <span className="opacity-70 font-semibold uppercase">{u.role}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

