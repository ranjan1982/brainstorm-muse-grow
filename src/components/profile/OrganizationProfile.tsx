
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

    const handleSave = () => {
        if (!currentUser) return;

        // Update User
        updateUserProfile(currentUser.id, {
            name,
            email, // In real app, changing email might require verification
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
