
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
                                <TableHead>Valid Upto</TableHead>
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
                                        {discount.validUpto ? new Date(discount.validUpto).toLocaleDateString('en-US') : 'N/A'}
                                    </TableCell>
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
                        <div className="space-y-2">
                            <Label>Valid Upto</Label>
                            <Input
                                type="date"
                                value={discountState.validUpto ? new Date(discountState.validUpto).toISOString().split('T')[0] : ''}
                                onChange={e => setDiscountState({ ...discountState, validUpto: e.target.value ? new Date(e.target.value) : undefined })}
                            />
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
    const [userState, setUserState] = useState<Partial<User>>({ role: 'seo-junior', isActive: true });
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleSave = () => {
        if (editingId) {
            updateUserProfile(editingId, userState);
        } else {
            addUser(userState as any);
        }
        setIsDialogOpen(false);
        setEditingId(null);
        setUserState({ role: 'seo-junior', isActive: true });
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
                    <Button onClick={() => { setIsDialogOpen(true); setEditingId(null); setUserState({ role: 'seo-junior', isActive: true }); }}>
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
                                    <SelectItem value="admin">Portal Admin</SelectItem>
                                    <SelectItem value="us-strategy">US Strategy</SelectItem>
                                    <SelectItem value="seo-head">SEO Head</SelectItem>
                                    <SelectItem value="seo-junior">SEO Junior</SelectItem>
                                    <SelectItem value="client">Client</SelectItem>
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
    const { emailTemplates, updateEmailTemplate, addEmailTemplate, deleteEmailTemplate } = useApp();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [emailState, setEmailState] = useState<Partial<EmailTemplate>>({ isActive: true });
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleSave = () => {
        if (!emailState.name || !emailState.subject || !emailState.body) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (editingId) {
            updateEmailTemplate(editingId, emailState);
            toast.success('Template updated successfully');
        } else {
            addEmailTemplate({
                name: emailState.name,
                subject: emailState.subject,
                body: emailState.body,
                trigger: emailState.trigger || 'custom',
                isActive: true
            });
            toast.success('Template created successfully');
        }
        setIsDialogOpen(false);
        setEditingId(null);
        setEmailState({ isActive: true });
    };

    const openEdit = (template: EmailTemplate) => {
        setEmailState(template);
        setEditingId(template.id);
        setIsDialogOpen(true);
    };

    const openCreate = () => {
        setEditingId(null);
        setEmailState({ isActive: true, trigger: 'custom' });
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Email Templates</h2>
                    <p className="text-muted-foreground">Configure system notification templates</p>
                </div>
                <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> New Template</Button>
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
                                        <Badge variant={template.isActive ? 'default' : 'outline'} className="text-[10px]">
                                            {template.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Subject: {template.subject}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(template)}>
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => {
                                        if (confirm('Are you sure you want to delete this template?')) {
                                            deleteEmailTemplate(template.id);
                                            toast.success('Template deleted');
                                        }
                                    }}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Edit Template' : 'Create Template'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Template Name</Label>
                            <Input
                                value={emailState.name || ''}
                                onChange={e => setEmailState({ ...emailState, name: e.target.value })}
                                placeholder="e.g. Welcome Email"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Trigger Event</Label>
                            <Select
                                value={emailState.trigger}
                                onValueChange={(v: any) => setEmailState({ ...emailState, trigger: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select trigger" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="welcome">Welcome Email</SelectItem>
                                    <SelectItem value="task_assigned">Task Assigned</SelectItem>
                                    <SelectItem value="task_completed">Task Completed</SelectItem>
                                    <SelectItem value="subscription_reminder">Subscription Reminder</SelectItem>
                                    <SelectItem value="new_user">New User Added</SelectItem>
                                    <SelectItem value="backend_user_added">Backend User Added</SelectItem>
                                    <SelectItem value="custom">Custom / Other</SelectItem>
                                </SelectContent>
                            </Select>
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
                        <div className="flex items-center gap-2">
                            <Switch checked={emailState.isActive} onCheckedChange={c => setEmailState({ ...emailState, isActive: c })} />
                            <Label>Active</Label>
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
    const { sendEmailBlast } = useApp();
    const [audience, setAudience] = useState<string>('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (!audience || !subject || !message) {
            toast.error('Please fill in all fields');
            return;
        }
        sendEmailBlast(audience, subject, message);
        toast.success(`Email blast sent to ${audience} audience!`);
        setSubject('');
        setMessage('');
        setAudience('');
    };

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
                            <Select value={audience} onValueChange={setAudience}>
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
                            <Input
                                placeholder="Enter email subject"
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Message Body</Label>
                            <textarea
                                className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Type your message here..."
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                            />
                        </div>
                        <Button className="w-full md:w-auto" onClick={handleSend}>
                            <Send className="w-4 h-4 mr-2" /> Send Blast
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
