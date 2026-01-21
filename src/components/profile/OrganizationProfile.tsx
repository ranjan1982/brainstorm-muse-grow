
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
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
} from "@/components/ui/alert-dialog"

export function OrganizationProfile() {
    const { currentUser, currentClient, updateUserProfile, updateClientInfo, deleteUserAccount } = useApp();
    const [isEditing, setIsEditing] = useState(false);

    // Local state for form
    // Split name into first and last name
    const [firstName, setFirstName] = useState(currentUser?.name?.split(' ')[0] || '');
    const [lastName, setLastName] = useState(currentUser?.name?.split(' ').slice(1).join(' ') || '');

    const [email, setEmail] = useState(currentUser?.email || '');
    const [phone, setPhone] = useState(currentUser?.phone || '');

    // Client specific
    const [company, setCompany] = useState(currentClient?.company || '');

    // Split address
    const [billingLine1, setBillingLine1] = useState(currentClient?.billingAddress?.line1 || currentClient?.address || '');
    const [billingLine2, setBillingLine2] = useState(currentClient?.billingAddress?.line2 || '');
    const [billingCity, setBillingCity] = useState(currentClient?.billingAddress?.city || '');
    const [billingState, setBillingState] = useState(currentClient?.billingAddress?.state || '');
    const [billingZip, setBillingZip] = useState(currentClient?.billingAddress?.zip || '');

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
        // Combine first and last name
        const fullName = `${firstName} ${lastName}`.trim();
        updateUserProfile(currentUser.id, {
            name: fullName,
            email,
            phone
        });

        // Update Client Org if applicable
        if (currentClient && currentUser.role === 'client') {
            const newBillingAddress = {
                line1: billingLine1,
                line2: billingLine2,
                city: billingCity,
                state: billingState,
                zip: billingZip,
                country: 'USA'
            };

            // Construct legacy address string for backward compatibility
            const addressString = [billingLine1, billingLine2, billingCity, billingState, billingZip]
                .filter(Boolean)
                .join(', ');

            updateClientInfo(currentClient.id, {
                company,
                address: addressString,
                billingAddress: newBillingAddress,
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

    const handleDeleteProfile = () => {
        if (!currentUser) return;
        deleteUserAccount(currentUser.id);
        toast.success('Your profile has been deleted.');
    };

    if (!currentUser) return null;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Profile & Settings</h2>
                    <p className="text-muted-foreground">Manage your personal and organization information</p>
                </div>

                {currentUser.role === 'client' && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">Delete Profile</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your account
                                    and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteProfile} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Delete Account
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Your account details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>First Name</Label>
                                <Input disabled={!isEditing} value={firstName} onChange={e => setFirstName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Last Name</Label>
                                <Input disabled={!isEditing} value={lastName} onChange={e => setLastName(e.target.value)} />
                            </div>
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
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Address Line 1"
                                        disabled={!isEditing}
                                        value={billingLine1}
                                        onChange={e => setBillingLine1(e.target.value)}
                                    />
                                    <Input
                                        placeholder="Address Line 2 (Optional)"
                                        disabled={!isEditing}
                                        value={billingLine2}
                                        onChange={e => setBillingLine2(e.target.value)}
                                    />
                                    <div className="grid grid-cols-3 gap-2">
                                        <Input
                                            placeholder="City"
                                            disabled={!isEditing}
                                            value={billingCity}
                                            onChange={e => setBillingCity(e.target.value)}
                                        />
                                        <Input
                                            placeholder="State"
                                            disabled={!isEditing}
                                            value={billingState}
                                            onChange={e => setBillingState(e.target.value)}
                                        />
                                        <Input
                                            placeholder="Zip Code"
                                            disabled={!isEditing}
                                            value={billingZip}
                                            onChange={e => setBillingZip(e.target.value)}
                                        />
                                    </div>
                                </div>
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
