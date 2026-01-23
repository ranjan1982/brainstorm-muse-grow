
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { useApp } from '@/context/AppContext';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Zap, ArrowRight, CreditCard, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { TRACK_LABELS, SUBSCRIPTION_TIER_LABELS } from '@/types';

export default function Purchase() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const planId = searchParams.get('planId');
    const { login, plans, packages, discounts } = useApp();

    // Select the plan based on URL or default
    const selectedPlan = plans.find(p => p.id === planId) || plans.find(p => p.id === 'plan-starter-monthly') || plans[0];

    // Find setup fee for the specific tier AND track
    const tierPackage = packages.find(pkg => pkg.tier === selectedPlan?.tier && pkg.track === selectedPlan?.track);

    const setupFee = tierPackage?.setupCost || 0;
    const isSetupFeeApplicable = selectedPlan?.isSetupFeeApplicable;
    const subtotal = (selectedPlan?.price || 0) + (isSetupFeeApplicable ? setupFee : 0);

    const [couponInput, setCouponInput] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState<import('@/types').Discount | null>(null);

    const handleApplyCoupon = () => {
        const found = discounts.find(d => d.code.toUpperCase() === couponInput.toUpperCase() && d.isActive);
        if (found) {
            setAppliedDiscount(found);
            toast.success(`Coupon "${found.code}" applied!`);
        } else {
            toast.error('Invalid or expired coupon code.');
            setAppliedDiscount(null);
        }
    };

    const discountAmount = appliedDiscount
        ? (appliedDiscount.type === 'percentage'
            ? (selectedPlan?.price || 0) * (appliedDiscount.value / 100)
            : appliedDiscount.value)
        : 0;

    const totalPayableAmount = Math.max(0, subtotal - discountAmount);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        businessName: '',
        contactFirstName: '',
        contactLastName: '',
        email: '',
        phone: '',
        website: '',
    });

    const [captcha] = useState({ num1: Math.floor(Math.random() * 10), num2: Math.floor(Math.random() * 10) });
    const [captchaAnswer, setCaptchaAnswer] = useState('');
    const [isNotRobot, setIsNotRobot] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 1) {
            // Validate Captcha
            if (parseInt(captchaAnswer) !== captcha.num1 + captcha.num2) {
                toast.error('Incorrect security check answer.');
                return;
            }
            if (!isNotRobot) {
                toast.error('Please verify you are not a robot.');
                return;
            }
            setStep(2);
            window.scrollTo(0, 0);
        } else {
            // Simulate checkout success
            toast.success('Subscription activated!', {
                description: 'Welcome to SEO Suite'
            });
            login('client');
            navigate('/checkout-success');
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-24 pb-16">
                <div className="container mx-auto px-6">
                    <div className="max-w-xl mx-auto">
                        {/* Progress Steps */}
                        <div className="flex items-center justify-center gap-4 mb-10">
                            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step >= 1 ? 'bg-primary border-primary text-white shadow-lg' : 'bg-muted border-transparent'
                                    }`}>
                                    {step > 1 ? <CheckCircle2 className="w-5 h-5" /> : '1'}
                                </div>
                                <span className="text-sm font-bold">Business Info</span>
                            </div>
                            <div className={`w-12 h-0.5 ${step > 1 ? 'bg-primary' : 'bg-border'}`} />
                            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step >= 2 ? 'bg-primary border-primary text-white shadow-lg' : 'bg-muted border-transparent'
                                    }`}>
                                    2
                                </div>
                                <span className="text-sm font-bold">Checkout</span>
                            </div>
                        </div>

                        <Card className="shadow-2xl border-primary/10 overflow-hidden">
                            <CardHeader className="text-center bg-secondary/30 pb-8 border-b">
                                <Badge variant="outline" className="w-fit mx-auto mb-3 bg-white/50 backdrop-blur-sm">
                                    <Lock className="w-3 h-3 mr-1" /> Secure Purchase
                                </Badge>
                                <CardTitle className="text-2xl font-black">
                                    {step === 1 ? 'Account Registration' : 'Secure Checkout'}
                                </CardTitle>
                                <CardDescription className="font-medium">
                                    {step === 1
                                        ? 'Enter your business details to customize your plan'
                                        : 'Activate your premium local SEO tools'
                                    }
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-8 px-8">
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {step === 1 ? (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="businessName" className="font-bold">Business Name</Label>
                                                <Input
                                                    id="businessName"
                                                    name="businessName"
                                                    placeholder="Acme Plumbing Co."
                                                    value={formData.businessName}
                                                    onChange={handleChange}
                                                    required
                                                    className="h-11"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="contactFirstName" className="font-bold">Contact First Name</Label>
                                                    <Input
                                                        id="contactFirstName"
                                                        name="contactFirstName"
                                                        placeholder="John"
                                                        value={formData.contactFirstName}
                                                        onChange={handleChange}
                                                        required
                                                        className="h-11"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="contactLastName" className="font-bold">Contact Last Name</Label>
                                                    <Input
                                                        id="contactLastName"
                                                        name="contactLastName"
                                                        placeholder="Doe"
                                                        value={formData.contactLastName}
                                                        onChange={handleChange}
                                                        required
                                                        className="h-11"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="font-bold">Email Address</Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="john@acmeplumbing.com"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="h-11"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone" className="font-bold">Phone Number</Label>
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    type="tel"
                                                    placeholder="(555) 123-4567"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    required
                                                    className="h-11"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="website" className="font-bold">Website URL</Label>
                                                <Input
                                                    id="website"
                                                    name="website"
                                                    type="url"
                                                    placeholder="https://acmeplumbing.com"
                                                    value={formData.website}
                                                    onChange={handleChange}
                                                    className="h-11"
                                                />
                                            </div>

                                            {/* Bot Protection */}
                                            <div className="pt-4 border-t space-y-4">
                                                <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg border border-border/50">
                                                    <div className="flex-1">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 block">Security Verification</Label>
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-mono bg-white px-2 py-1 rounded border shadow-sm select-none text-sm">
                                                                {captcha.num1} + {captcha.num2} = ?
                                                            </span>
                                                            <Input
                                                                className="w-20 h-9"
                                                                placeholder="Val"
                                                                value={captchaAnswer}
                                                                onChange={e => setCaptchaAnswer(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 px-1">
                                                    <input
                                                        type="checkbox"
                                                        id="not-robot"
                                                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                        checked={isNotRobot}
                                                        onChange={e => setIsNotRobot(e.target.checked)}
                                                    />
                                                    <Label htmlFor="not-robot" className="text-sm font-bold cursor-pointer">
                                                        I am not a robot
                                                    </Label>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="bg-[#f8fafc] border rounded-xl overflow-hidden mb-6 shadow-inner">
                                                <div className="p-5 flex items-center justify-between border-b bg-white">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                            <Zap className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-black text-sm">{selectedPlan ? SUBSCRIPTION_TIER_LABELS[selectedPlan.tier] : 'Starter Plan'}</p>
                                                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 text-[9px] font-bold px-1.5 py-0 h-4">
                                                                    {selectedPlan ? TRACK_LABELS[selectedPlan.track] : 'LOCAL'}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">{selectedPlan?.billingCycle} Billing</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-black text-xl">${selectedPlan?.price || 499}</p>
                                                        <p className="text-[10px] font-bold text-muted-foreground">Billed {selectedPlan?.billingCycle}</p>
                                                    </div>
                                                </div>

                                                <div className="p-4 space-y-3 bg-[#f8fafc]">
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-muted-foreground font-medium">Setup Fee (one-time)</span>
                                                        <span className={`font-bold ${!isSetupFeeApplicable ? 'line-through text-muted-foreground' : 'text-blue-600'}`}>
                                                            ${setupFee}
                                                        </span>
                                                    </div>

                                                    <div className="pt-2">
                                                        <div className="flex gap-2">
                                                            <Input
                                                                placeholder="Coupon Code"
                                                                value={couponInput}
                                                                onChange={(e) => setCouponInput(e.target.value)}
                                                                className="h-9 text-xs font-bold uppercase"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={handleApplyCoupon}
                                                                className="h-9 text-xs"
                                                            >
                                                                Apply
                                                            </Button>
                                                        </div>
                                                        {appliedDiscount && (
                                                            <div className="flex justify-between items-center mt-2 text-[11px] text-success font-bold px-1">
                                                                <span>Coupon ({appliedDiscount.code}) applied</span>
                                                                <span>-${discountAmount.toFixed(2)}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="pt-3 border-t flex justify-between items-center">
                                                        <span className="font-black text-base">Total Payable Amount</span>
                                                        <span className="font-black text-2xl text-primary">${totalPayableAmount.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-5">
                                                <div className="space-y-2">
                                                    <Label htmlFor="cardNumber" className="font-bold">Card Number</Label>
                                                    <div className="relative">
                                                        <Input
                                                            id="cardNumber"
                                                            placeholder="4242 4242 4242 4242"
                                                            required
                                                            className="h-11 pl-10"
                                                        />
                                                        <CreditCard className="w-4 h-4 absolute left-3 top-3.5 text-muted-foreground" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="expiry" className="font-bold">Expiry Date</Label>
                                                        <Input
                                                            id="expiry"
                                                            placeholder="MM/YY"
                                                            required
                                                            className="h-11"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="cvc" className="font-bold">CVC</Label>
                                                        <Input
                                                            id="cvc"
                                                            placeholder="123"
                                                            required
                                                            className="h-11"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <Button
                                        type="submit"
                                        variant="accent"
                                        className="w-full h-12 text-base font-black shadow-lg shadow-primary/20 mt-6"
                                        size="lg"
                                        disabled={step === 1 && (!isNotRobot || !captchaAnswer)}
                                    >
                                        {step === 1 ? (
                                            <>
                                                Continue to Payment
                                                <ArrowRight className="w-5 h-5 ml-2" />
                                            </>
                                        ) : (
                                            <>
                                                Complete Subscription
                                                <CheckCircle2 className="w-5 h-5 ml-2" />
                                            </>
                                        )}
                                    </Button>

                                    {step === 2 && (
                                        <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground font-medium pt-2">
                                            <Lock className="w-3 h-3" />
                                            256-bit SSL Encrypted Payment
                                        </div>
                                    )}
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
