import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    User,
    Building2,
    Mail,
    Phone,
    MapPin,
    Lock,
    Save,
    UserCircle,
    Camera,
    Trash2,
    AlertTriangle
} from 'lucide-react';

export function OrganizationProfile() {
    const { currentUser, currentClient, updateUserProfile, updateClientInfo, deleteUserAccount } = useApp();

    // Personal Info State
    const [personalInfo, setPersonalInfo] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        avatar: currentUser?.avatar || ''
    });

    // Credential State
    const [credentials, setCredentials] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Organization Info State
    const [orgInfo, setOrgInfo] = useState({
        company: currentClient?.company || '',
        email: currentClient?.email || '',
        phone: currentClient?.phone || '',
        address: currentClient?.address || ''
    });

    useEffect(() => {
        if (currentUser) {
            setPersonalInfo({
                name: currentUser.name,
                email: currentUser.email,
                avatar: currentUser.avatar || ''
            });
        }
        if (currentClient) {
            setOrgInfo({
                company: currentClient.company,
                email: currentClient.email,
                phone: currentClient.phone || '',
                address: currentClient.address || ''
            });
        }
    }, [currentUser, currentClient]);

    const handlePersonalSave = () => {
        if (!currentUser) return;
        updateUserProfile(currentUser.id, {
            name: personalInfo.name,
            email: personalInfo.email,
            avatar: personalInfo.avatar
        });
        toast.success('Personal information updated successfully');
    };

    const handleCredentialSave = () => {
        if (credentials.newPassword !== credentials.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        if (credentials.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        toast.success('Password updated successfully');
        setCredentials({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    const handleOrgSave = () => {
        if (!currentClient) return;
        updateClientInfo(currentClient.id, {
            company: orgInfo.company,
            email: orgInfo.email,
            phone: orgInfo.phone,
            address: orgInfo.address
        });
        toast.success('Organization information updated successfully');
    };

    const handleDeleteAccount = () => {
        if (!currentUser) return;
        deleteUserAccount(currentUser.id);
        toast.info('Account deleted successfully');
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-[#0f172a]">Profile & Organization</h1>
                <p className="text-muted-foreground text-lg">Manage your personal account and company information.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column: Personal & Credentials */}
                <div className="xl:col-span-2 space-y-8">
                    {/* Personal Information */}
                    <Card className="border-border/50 shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-border/50 p-6">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <UserCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold">Personal Information</CardTitle>
                                    <CardDescription>Update your personal details and how others see you.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="flex flex-col md:flex-row gap-10">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative group">
                                        <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                                            <AvatarImage src={personalInfo.avatar} />
                                            <AvatarFallback className="text-3xl bg-primary/5 text-primary">
                                                {personalInfo.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <Camera className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="font-semibold text-xs uppercase tracking-wider">
                                        Change Photo
                                    </Button>
                                </div>

                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm font-bold text-slate-700">Full Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="name"
                                                value={personalInfo.name}
                                                onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                                                className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-bold text-slate-700">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                value={personalInfo.email}
                                                onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                                                className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-slate-50/50 border-t border-border/50 p-4 px-8 justify-end">
                            <Button onClick={handlePersonalSave} className="gap-2 font-bold px-6 h-11">
                                <Save className="w-4 h-4" />
                                Save Changes
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Login Credentials */}
                    <Card className="border-border/50 shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-border/50 p-6">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold">Login Credentials</CardTitle>
                                    <CardDescription>Update your password to keep your account secure.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="current-password" className="text-sm font-bold text-slate-700">Current Password</Label>
                                    <Input
                                        id="current-password"
                                        type="password"
                                        value={credentials.currentPassword}
                                        onChange={(e) => setCredentials({ ...credentials, currentPassword: e.target.value })}
                                        className="h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new-password" className="text-sm font-bold text-slate-700">New Password</Label>
                                    <Input
                                        id="new-password"
                                        type="password"
                                        value={credentials.newPassword}
                                        onChange={(e) => setCredentials({ ...credentials, newPassword: e.target.value })}
                                        className="h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password" className="text-sm font-bold text-slate-700">Confirm New Password</Label>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        value={credentials.confirmPassword}
                                        onChange={(e) => setCredentials({ ...credentials, confirmPassword: e.target.value })}
                                        className="h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-slate-50/50 border-t border-border/50 p-4 px-8 justify-end">
                            <Button onClick={handleCredentialSave} variant="outline" className="gap-2 font-bold px-6 h-11 border-slate-200 hover:bg-slate-100">
                                <Lock className="w-4 h-4 text-orange-600" />
                                Update Password
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Right Column: Organization Info */}
                <div className="space-y-8">
                    <Card className="border-border/50 shadow-sm overflow-hidden h-full flex flex-col">
                        <CardHeader className="bg-slate-50/50 border-b border-border/50 p-6">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold">Organization</CardTitle>
                                    <CardDescription>Details about your company and billing.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 flex-1 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="company" className="text-sm font-bold text-slate-700">Company Name</Label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="company"
                                        value={orgInfo.company}
                                        onChange={(e) => setOrgInfo({ ...orgInfo, company: e.target.value })}
                                        className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                                        placeholder="Acme Inc."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="org-email" className="text-sm font-bold text-slate-700">Bussiness Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="org-email"
                                        type="email"
                                        value={orgInfo.email}
                                        onChange={(e) => setOrgInfo({ ...orgInfo, email: e.target.value })}
                                        className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                                        placeholder="billing@acme.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-sm font-bold text-slate-700">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        value={orgInfo.phone}
                                        onChange={(e) => setOrgInfo({ ...orgInfo, phone: e.target.value })}
                                        className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address" className="text-sm font-bold text-slate-700">Office Address</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <textarea
                                        id="address"
                                        value={orgInfo.address}
                                        onChange={(e) => setOrgInfo({ ...orgInfo, address: e.target.value })}
                                        className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-slate-50/50 pl-10 pt-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:bg-white"
                                        placeholder="123 SEO Street, Digital City, 10101"
                                    />
                                </div>
                            </div>

                            <Separator className="my-6" />

                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Plan</p>
                                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 rounded uppercase">Active</span>
                                </div>
                                <p className="text-sm font-bold text-slate-800">Growth Plan</p>
                                <p className="text-[11px] text-slate-500 font-medium">$599/month, billed monthly</p>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-slate-50/50 border-t border-border/50 p-4 px-8 justify-end">
                            <Button onClick={handleOrgSave} className="w-full gap-2 font-bold h-11 bg-emerald-600 hover:bg-emerald-700">
                                <Building2 className="w-4 h-4" />
                                Update Organization
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="pt-8">
                <Separator className="mb-8" />
                <Card className="border-destructive/20 shadow-sm overflow-hidden bg-destructive/5">
                    <CardHeader className="p-6">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold text-destructive">Danger Zone</CardTitle>
                                <CardDescription>Irreversible actions for your account.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-destructive/10 bg-white/50">
                            <div>
                                <p className="font-bold text-slate-800 text-sm">Delete Account</p>
                                <p className="text-xs text-muted-foreground">Once you delete your account, there is no going back. All your data will be permanently removed.</p>
                            </div>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" className="gap-2 font-bold px-6">
                                        <Trash2 className="w-4 h-4" />
                                        Delete Account
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your account
                                            and remove your organization data from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                            Yes, Delete My Account
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
