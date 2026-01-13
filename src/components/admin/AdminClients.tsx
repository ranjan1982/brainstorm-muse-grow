
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

export function AdminClients() {
    const { clients, getClientSubscription, getClientPaymentHistory, updateClientInfo, updateSubscriptionStatus, refundPayment, upgradeSubscription } = useApp();
    const [searchTerm, setSearchTerm] = useState('');

    // Profile Edit State
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Partial<Client> | null>(null);

    // Subscription Manage State
    const [isSubManageOpen, setIsSubManageOpen] = useState(false);
    const [selectedClientForSub, setSelectedClientForSub] = useState<string | null>(null);

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openEditProfile = (client: Client) => {
        setEditingClient(client);
        setIsEditProfileOpen(true);
    };

    const handleSaveProfile = () => {
        if (editingClient && editingClient.id) {
            updateClientInfo(editingClient.id, editingClient);
            toast.success('Client profile updated');
            setIsEditProfileOpen(false);
        }
    };

    const handleSubscriptionAction = (action: 'pause' | 'cancel' | 'resume', subId: string) => {
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

    const handleRefund = (paymentId: string) => {
        if (confirm('Process full refund for this payment?')) {
            refundPayment(paymentId);
            toast.success('Payment refunded');
        }
    };

    const handleUpgrade = (clientId: string, tier: SubscriptionTier) => {
        upgradeSubscription(clientId, tier);
        toast.success(`Subscription updated to ${SUBSCRIPTION_TIER_LABELS[tier]}`);
    };

    const selectedClientData = clients.find(c => c.id === selectedClientForSub);
    const selectedClientSub = selectedClientData ? getClientSubscription(selectedClientData.id) : undefined;
    const selectedClientPayments = selectedClientData ? getClientPaymentHistory(selectedClientData.id) : [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Clients Management</h2>
                    <p className="text-muted-foreground">Manage client profiles, subscriptions, and billing</p>
                </div>
                <div className="flex gap-2">
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
                                <TableHead>Status</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredClients.map(client => {
                                const sub = getClientSubscription(client.id);
                                return (
                                    <TableRow key={client.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{client.company}</span>
                                                <span className="text-xs text-muted-foreground">{client.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={client.isActive ? 'outline' : 'secondary'}>
                                                {client.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {sub ? (
                                                <div className="flex flex-col gap-1">
                                                    <Badge variant={sub.status === 'active' ? 'default' : sub.status === 'cancelled' ? 'destructive' : 'secondary'}>
                                                        {SUBSCRIPTION_TIER_LABELS[sub.tier]}
                                                    </Badge>
                                                    <span className="text-[10px] text-muted-foreground uppercase">{sub.status}</span>
                                                </div>
                                            ) : <span className="text-muted-foreground text-sm">-</span>}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1"><Mail className="w-3 h-3" /> {client.email}</div>
                                                {client.phone && <div className="flex items-center gap-1"><Phone className="w-3 h-3" /> {client.phone}</div>}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="outline" onClick={() => openEditProfile(client)}>
                                                    <Edit2 className="w-4 h-4 mr-2" /> Edit
                                                </Button>
                                                <Button size="sm" variant="secondary" onClick={() => { setSelectedClientForSub(client.id); setIsSubManageOpen(true); }}>
                                                    <CreditCard className="w-4 h-4 mr-2" /> Billing
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Edit Profile Dialog */}
            <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Client Profile</DialogTitle>
                        <DialogDescription>Update contact and organization details</DialogDescription>
                    </DialogHeader>
                    {editingClient && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Company Name</Label>
                                    <Input value={editingClient.company || ''} onChange={e => setEditingClient({ ...editingClient, company: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Contact Name</Label>
                                    <Input value={editingClient.name || ''} onChange={e => setEditingClient({ ...editingClient, name: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input value={editingClient.email || ''} onChange={e => setEditingClient({ ...editingClient, email: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Phone</Label>
                                    <Input value={editingClient.phone || ''} onChange={e => setEditingClient({ ...editingClient, phone: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Address</Label>
                                    <Input value={editingClient.address || ''} onChange={e => setEditingClient({ ...editingClient, address: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={handleSaveProfile}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Manage Subscription & Billing Dialog */}
            <Dialog open={isSubManageOpen} onOpenChange={setIsSubManageOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Billing & Subscription: {selectedClientData?.company}</DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                        {/* Subscription Config */}
                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2"><CreditCard className="w-4 h-4" /> Current Plan</h3>
                            {selectedClientSub ? (
                                <Card className="bg-secondary/20">
                                    <CardContent className="p-4 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-lg">{SUBSCRIPTION_TIER_LABELS[selectedClientSub.tier]}</p>
                                                <Badge variant={selectedClientSub.status === 'active' ? 'default' : 'destructive'} className="mt-1 capitalize">
                                                    {selectedClientSub.status}
                                                </Badge>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-mono">${selectedClientSub.monthlyPrice}/mo</p>
                                                <p className="text-xs text-muted-foreground">Next: {selectedClientSub.nextBillingDate?.toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Change Plan</Label>
                                            <Select defaultValue={selectedClientSub.tier} onValueChange={(v) => handleUpgrade(selectedClientSub.clientId, v as SubscriptionTier)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="starter">Starter</SelectItem>
                                                    <SelectItem value="growth">Growth</SelectItem>
                                                    <SelectItem value="enterprise">Enterprise</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            {selectedClientSub.status === 'active' ? (
                                                <>
                                                    <Button variant="outline" size="sm" className="w-full" onClick={() => handleSubscriptionAction('pause', selectedClientSub.id)}>
                                                        <PauseCircle className="w-3 h-3 mr-2" /> Pause
                                                    </Button>
                                                    <Button variant="destructive" size="sm" className="w-full" onClick={() => handleSubscriptionAction('cancel', selectedClientSub.id)}>
                                                        Cancel Sub
                                                    </Button>
                                                </>
                                            ) : selectedClientSub.status === 'paused' ? (
                                                <Button variant="outline" size="sm" className="w-full" onClick={() => handleSubscriptionAction('resume', selectedClientSub.id)}>
                                                    <RotateCcw className="w-3 h-3 mr-2" /> Resume
                                                </Button>
                                            ) : null}
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="p-4 border border-dashed rounded text-center text-muted-foreground">No active subscription</div>
                            )}
                        </div>

                        {/* Payment History */}
                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2"><Clock className="w-4 h-4" /> history</h3>
                            <div className="border rounded-md max-h-[300px] overflow-y-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[80px]">Date</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead className="w-[80px]">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {selectedClientPayments.map(payment => (
                                            <TableRow key={payment.id}>
                                                <TableCell className="text-xs">{payment.paymentDate.toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">${payment.amount}</span>
                                                        <span className={`text-[10px] ${payment.status === 'refunded' ? 'text-destructive' : 'text-green-600'}`}>{payment.status}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {payment.status === 'paid' && (
                                                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleRefund(payment.id)} title="Refund">
                                                            <RotateCcw className="w-3 h-3" />
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
