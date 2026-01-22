
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { useApp } from '@/context/AppContext';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Zap, ArrowRight, Shield, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function FreeTrial() {
    const navigate = useNavigate();
    const { login } = useApp();
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

        // Validate Captcha
        if (parseInt(captchaAnswer) !== captcha.num1 + captcha.num2) {
            toast.error('Incorrect security check answer. Please try again.');
            return;
        }

        if (!isNotRobot) {
            toast.error('Please verify that you are not a robot.');
            return;
        }

        // Simulate trial activation
        toast.success('Trial activated!', {
            description: 'Welcome to your 14-day free trial'
        });
        login('client');
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-24 pb-16">
                <div className="container mx-auto px-6">
                    <div className="max-w-xl mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold mb-2">Start Your Free Trial</h1>
                            <p className="text-muted-foreground">No credit card required. Instant access.</p>
                        </div>

                        <Card className="shadow-xl border-accent/20">
                            <CardHeader className="text-center border-b bg-accent/5 pb-6">
                                <div className="flex justify-center mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-accent" />
                                    </div>
                                </div>
                                <CardTitle className="text-xl">14-Day Free Access</CardTitle>
                                <CardDescription>
                                    Experience the full power of SEO Suite Starter
                                </CardDescription>
                                <div className="flex items-center justify-center gap-4 mt-4">
                                    <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                                        <Shield className="w-3 h-3" /> No Credit Card
                                    </div>
                                    <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                                        <Clock className="w-3 h-3" /> Ends in 14 Days
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-8">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="businessName">Business Name</Label>
                                        <Input
                                            id="businessName"
                                            name="businessName"
                                            placeholder="Acme Plumbing Co."
                                            value={formData.businessName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="contactFirstName">Contact First Name</Label>
                                            <Input
                                                id="contactFirstName"
                                                name="contactFirstName"
                                                placeholder="John"
                                                value={formData.contactFirstName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="contactLastName">Contact Last Name</Label>
                                            <Input
                                                id="contactLastName"
                                                name="contactLastName"
                                                placeholder="Doe"
                                                value={formData.contactLastName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="john@acmeplumbing.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            placeholder="(555) 123-4567"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="website">Website URL</Label>
                                        <Input
                                            id="website"
                                            name="website"
                                            type="url"
                                            placeholder="https://acmeplumbing.com"
                                            value={formData.website}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* Bot Protection / Security */}
                                    <div className="pt-4 border-t space-y-4">
                                        <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg border border-border/50">
                                            <div className="flex-1">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Security Check</Label>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-mono bg-white px-2 py-1 rounded border shadow-sm select-none">
                                                        {captcha.num1} + {captcha.num2} = ?
                                                    </span>
                                                    <Input
                                                        className="w-20 h-9"
                                                        placeholder="Answer"
                                                        value={captchaAnswer}
                                                        onChange={e => setCaptchaAnswer(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center justify-center px-4 border-l">
                                                <Shield className="w-5 h-5 text-accent mb-1" />
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Bot Protected</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 px-1">
                                            <input
                                                type="checkbox"
                                                id="not-robot"
                                                className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
                                                checked={isNotRobot}
                                                onChange={e => setIsNotRobot(e.target.checked)}
                                            />
                                            <Label htmlFor="not-robot" className="text-sm font-medium cursor-pointer">
                                                I am not a robot
                                            </Label>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        variant="accent"
                                        className="w-full h-12 text-base font-bold shadow-glow mt-2"
                                        size="lg"
                                        disabled={!isNotRobot || !captchaAnswer}
                                    >
                                        Activate Free Trial
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
