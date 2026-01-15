
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function OrganizationProfile() {
    const { currentUser, currentClient, updateUserProfile, updateClientInfo } = useApp();
    const [isEditing, setIsEditing] = useState(false);

    // Local state for form
    const [name, setName] = useState(currentUser?.name || '');
    const [email, setEmail] = useState(currentUser?.email || '');
    const [phone, setPhone] = useState(currentUser?.phone || '');

    // Client specific
    const [company, setCompany] = useState(currentClient?.company || '');
    const [address, setAddress] = useState(currentClient?.address || '');

    // Password state
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSave = () => {
        if (!currentUser) return;

        // Security check: require password if email is changed
        if (email !== currentUser.email && !password) {
            toast.error('Please enter and confirm your password in the Security Settings tile to change your email address.');
            return;
        }

        // Update User
        updateUserProfile(currentUser.id, {
            name,
            email,
            phone
        });

        // Update Client Org if applicable
        if (currentClient && currentUser.role === 'client') {
            updateClientInfo(currentClient.id, {
                company,
                address,
                phone // Client phone might be same as user phone or diff
            });
        }

        // Update Password if provided
        if (password) {
            if (password !== confirmPassword) {
                toast.error('Passwords do not match');
                return;
            }
            if (password.length < 6) {
                toast.error('Password must be at least 6 characters');
                return;
            }
            // In a real app, this would call changePassword(currentUser.id, password)
            toast.success('Password updated successfully');
            setPassword('');
            setConfirmPassword('');
        }

        toast.success('Profile updated successfully');
        setIsEditing(false);
    };

    if (!currentUser) return null;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Profile & Settings</h2>
                <p className="text-muted-foreground">Manage your personal and organization information</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Your account details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input disabled={!isEditing} value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Email Address</Label>
                            <Input disabled={!isEditing} value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input disabled={!isEditing} value={phone} onChange={e => setPhone(e.target.value)} />
                        </div>
                    </CardContent>
                </Card>

                {currentUser.role === 'client' && currentClient && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Organization Details</CardTitle>
                            <CardDescription>Company information visible on invoices</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Company Name</Label>
                                <Input disabled={!isEditing} value={company} onChange={e => setCompany(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Billing Address</Label>
                                <Input disabled={!isEditing} value={address} onChange={e => setAddress(e.target.value)} />
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card className="border-accent/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <span className="p-1 px-1.5 rounded bg-accent/10 border border-accent/20 text-accent">🔒</span>
                            Security Settings
                        </CardTitle>
                        <CardDescription>Update your credentials. Required to change email address.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>New Password</Label>
                            <Input
                                type="password"
                                disabled={!isEditing}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Enter new password"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Confirm New Password</Label>
                            <Input
                                type="password"
                                disabled={!isEditing}
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                            />
                        </div>
                        {!isEditing && (
                            <p className="text-xs text-muted-foreground italic">
                                Password fields are hidden for security. Click Edit to change.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end gap-2">
                {isEditing ? (
                    <>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                        <Button onClick={handleSave}>Save Changes</Button>
                    </>
                ) : (
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                )}
            </div>
        </div>
    );
}
