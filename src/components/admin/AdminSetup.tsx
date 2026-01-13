
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { User, UserRole, ROLE_LABELS, SubscriptionPlan, Discount, EmailTemplate } from '@/types';
import { toast } from 'sonner';
import { Plus, Trash2, Edit2, Send } from 'lucide-react';


export function AdminPlans() {
    const { plans, addPlan, updatePlan, deletePlan } = useApp();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [planState, setPlanState] = useState<Partial<SubscriptionPlan>>({ tier: 'starter', isActive: true, billingCycle: 'monthly', features: [] });
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleSave = () => {
        if (editingId) {
            updatePlan(editingId, planState);
        } else {
            addPlan(planState as any);
        }
        setIsDialogOpen(false);
        setEditingId(null);
        setPlanState({ tier: 'starter', isActive: true, billingCycle: 'monthly', features: [] });
    };

    const openEdit = (plan: SubscriptionPlan) => {
        setPlanState(plan);
        setEditingId(plan.id);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Subscription Plans</h2>
                    <p className="text-muted-foreground">Manage pricing tiers and billing cycles</p>
                </div>
                <Button onClick={() => { setIsDialogOpen(true); setEditingId(null); setPlanState({ tier: 'starter', isActive: true, billingCycle: 'monthly', features: [] }); }}>
                    <Plus className="w-4 h-4 mr-2" /> Create Plan
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Plan Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Cycle</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Features</TableHead>
                                <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {plans.map((plan) => (
                                <TableRow key={plan.id}>
                                    <TableCell className="font-medium">{plan.name}</TableCell>
                                    <TableCell>${plan.price}</TableCell>
                                    <TableCell className="capitalize">{plan.billingCycle}</TableCell>
                                    <TableCell>
                                        <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                                            {plan.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {plan.features?.length || 0} features
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(plan)}><Edit2 className="w-4 h-4" /></Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => { if (confirm('Are you sure?')) deletePlan(plan.id); }}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Edit Plan' : 'Create Plan'}</DialogTitle>
                        <DialogDescription>Configure plan details and pricing</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Plan Name</Label>
                            <Input value={planState.name || ''} onChange={e => setPlanState({ ...planState, name: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Monthly Price ($)</Label>
                                <Input type="number" value={planState.price || ''} onChange={e => setPlanState({ ...planState, price: Number(e.target.value) })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Billing Cycle</Label>
                                <Select value={planState.billingCycle} onValueChange={(v: any) => setPlanState({ ...planState, billingCycle: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                        <SelectItem value="yearly">Yearly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Tier Level</Label>
                            <Select value={planState.tier} onValueChange={(v: any) => setPlanState({ ...planState, tier: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="starter">Starter</SelectItem>
                                    <SelectItem value="growth">Growth</SelectItem>
                                    <SelectItem value="enterprise">Enterprise</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch checked={planState.isActive} onCheckedChange={c => setPlanState({ ...planState, isActive: c })} />
                            <Label>Active Plan</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}>Save Plan</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export function AdminDiscounts() {
    const { discounts, addDiscount, updateDiscount, deleteDiscount } = useApp();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [discountState, setDiscountState] = useState<Partial<Discount>>({ type: 'percentage', appliesTo: 'one-time', isActive: true });
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleSave = () => {
        if (editingId) {
            updateDiscount(editingId, discountState);
        } else {
            addDiscount(discountState as any);
        }
        setIsDialogOpen(false);
        setEditingId(null);
        setDiscountState({ type: 'percentage', appliesTo: 'one-time', isActive: true });
    };

    const openEdit = (discount: Discount) => {
        setDiscountState(discount);
        setEditingId(discount.id);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Discount Coupons</h2>
                    <p className="text-muted-foreground">Manage promo codes and offers</p>
                </div>
                <Button onClick={() => { setIsDialogOpen(true); setEditingId(null); setDiscountState({ type: 'percentage', appliesTo: 'one-time', isActive: true }); }}>
                    <Plus className="w-4 h-4 mr-2" /> Add Coupon
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Usage</TableHead>
                                <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {discounts.map((discount) => (
                                <TableRow key={discount.id}>
                                    <TableCell className="font-mono font-bold">{discount.code}</TableCell>
                                    <TableCell>
                                        {discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`}
                                    </TableCell>
                                    <TableCell className="capitalize">
                                        {discount.appliesTo}
                                        {discount.appliesTo === 'recurring' && ` (${discount.recurringDuration}x)`}
                                    </TableCell>
                                    <TableCell>{discount.usedCount} times</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(discount)}><Edit2 className="w-4 h-4" /></Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => { if (confirm('Are you sure?')) deleteDiscount(discount.id); }}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Edit Coupon' : 'New Coupon'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Coupon Code</Label>
                            <Input value={discountState.code || ''} onChange={e => setDiscountState({ ...discountState, code: e.target.value.toUpperCase() })} placeholder="e.g. SUMMER25" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Type</Label>
                                <Select value={discountState.type} onValueChange={(v: any) => setDiscountState({ ...discountState, type: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                                        <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Value</Label>
                                <Input type="number" value={discountState.value || ''} onChange={e => setDiscountState({ ...discountState, value: Number(e.target.value) })} />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSave}>Save Coupon</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export function AdminUsers() {
    const { users, addUser, updateUserProfile, deleteUserAccount } = useApp();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [userState, setUserState] = useState<Partial<User>>({ role: 'team-member', isActive: true });
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleSave = () => {
        if (editingId) {
            updateUserProfile(editingId, userState);
        } else {
            addUser(userState as any);
        }
        setIsDialogOpen(false);
        setEditingId(null);
        setUserState({ role: 'team-member', isActive: true });
    };

    const openEdit = (user: User) => {
        setUserState(user);
        setEditingId(user.id);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">System Users</h2>
                    <p className="text-muted-foreground">Manage SEO team and Backoffice admins</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => { setIsDialogOpen(true); setEditingId(null); setUserState({ role: 'admin', isActive: true }); }}>
                        <Plus className="w-4 h-4 mr-2" /> Add Admin
                    </Button>
                    <Button onClick={() => { setIsDialogOpen(true); setEditingId(null); setUserState({ role: 'india-junior', isActive: true }); }}>
                        <Plus className="w-4 h-4 mr-2" /> Add SEO User
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.filter(u => u.role !== 'client').map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{ROLE_LABELS[user.role]}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(user)}><Edit2 className="w-4 h-4" /></Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => { if (confirm('Are you sure?')) deleteUserAccount(user.id); }}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Edit User' : 'Add User'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input value={userState.name || ''} onChange={e => setUserState({ ...userState, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Email Address</Label>
                            <Input value={userState.email || ''} onChange={e => setUserState({ ...userState, email: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Select value={userState.role} onValueChange={(v: any) => setUserState({ ...userState, role: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">System Admin</SelectItem>
                                    <SelectItem value="us-strategy">US Strategy</SelectItem>
                                    <SelectItem value="india-head">India Head</SelectItem>
                                    <SelectItem value="india-junior">India Junior</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSave}>Save User</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export function AdminTemplates() {
    const { emailTemplates, updateEmailTemplate } = useApp();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [emailState, setEmailState] = useState<Partial<EmailTemplate>>({});
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleSave = () => {
        if (editingId) {
            updateEmailTemplate(editingId, emailState);
        }
        setIsDialogOpen(false);
        setEditingId(null);
        setEmailState({});
    };

    const openEdit = (template: EmailTemplate) => {
        setEmailState(template);
        setEditingId(template.id);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Email Templates</h2>
                    <p className="text-muted-foreground">Configure system notification templates</p>
                </div>
                <Button onClick={() => toast.info('Create Template Dialog')}><Plus className="w-4 h-4 mr-2" /> New Template</Button>
            </div>

            <Card>
                <CardContent>
                    <div className="space-y-4">
                        {emailTemplates.map(template => (
                            <div key={template.id} className="flex items-start justify-between p-4 border rounded-lg">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold">{template.name}</h4>
                                        <Badge variant="secondary" className="text-xs">{template.trigger}</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Subject: {template.subject}</p>
                                </div>
                                <Button size="sm" variant="outline" onClick={() => openEdit(template)}><Edit2 className="w-4 h-4 mr-2" /> Edit</Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Email Template</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Template Name</Label>
                            <Input value={emailState.name || ''} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label>Subject Line</Label>
                            <Input value={emailState.subject || ''} onChange={e => setEmailState({ ...emailState, subject: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Content</Label>
                            <textarea
                                className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={emailState.body || ''}
                                onChange={e => setEmailState({ ...emailState, body: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSave}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export function AdminBlast() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Email Blast</h2>
                <p className="text-muted-foreground">Send bulk emails to clients based on criteria</p>
            </div>

            <Card>
                <CardContent className="space-y-4 pt-6">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <Label>Target Audience</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select audience" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Active Clients</SelectItem>
                                    <SelectItem value="starter">Starter Plan Subscribers</SelectItem>
                                    <SelectItem value="growth">Growth Plan Subscribers</SelectItem>
                                    <SelectItem value="enterprise">Enterprise Plan Subscribers</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Subject Line</Label>
                            <Input placeholder="Enter email subject" />
                        </div>
                        <div className="space-y-2">
                            <Label>Message Body</Label>
                            <textarea
                                className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Type your message here..."
                            />
                        </div>
                        <Button className="w-full md:w-auto"><Send className="w-4 h-4 mr-2" /> Send Blast</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
