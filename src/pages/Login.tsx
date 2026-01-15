
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { useApp } from '@/context/AppContext';
import { Lock, Mail, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useApp();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Artificial delay for premium feel
        setTimeout(() => {
            const success = login(formData.email, formData.password);

            if (success) {
                toast.success('Successfully logged in!', {
                    description: 'Welcome back to your SEO Suite dashboard.'
                });
                navigate('/dashboard');
            } else {
                toast.error('Invalid credentials', {
                    description: 'Please check your email and password and try again.'
                });
                setLoading(false);
            }
        }, 800);
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-24 pb-16 flex items-center justify-center">
                <div className="container mx-auto px-6">
                    <div className="max-w-md mx-auto">
                        <div className="text-center mb-8 animate-fade-in">
                            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-accent/10 mb-4">
                                <ShieldCheck className="w-8 h-8 text-accent" />
                            </div>
                            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                            <p className="text-muted-foreground">Log in to manage your SEO workflows</p>
                        </div>

                        <Card className="shadow-2xl border-accent/10 overflow-hidden">
                            <CardHeader className="space-y-1 bg-secondary/30 border-b pb-6">
                                <CardTitle className="text-xl flex items-center justify-center gap-2">
                                    <Lock className="w-4 h-4 text-accent" /> Secure Portal
                                </CardTitle>
                                <CardDescription className="text-center font-medium">
                                    Enter your credentials to access your dashboard
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-8 px-8">
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="font-bold">Email Address</Label>
                                        <div className="relative">
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="name@company.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="h-12 pl-10"
                                            />
                                            <Mail className="w-4 h-4 absolute left-3 top-4 text-muted-foreground" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password" className="font-bold">Password</Label>
                                            <button type="button" className="text-xs font-bold text-accent hover:underline">Forgot password?</button>
                                        </div>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                name="password"
                                                type="password"
                                                placeholder="••••••••"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                className="h-12 pl-10"
                                            />
                                            <Lock className="w-4 h-4 absolute left-3 top-4 text-muted-foreground" />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        variant="accent"
                                        className="w-full h-12 text-base font-bold shadow-glow mt-4"
                                        size="lg"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Authenticating...
                                            </div>
                                        ) : (
                                            <>
                                                Log In to Dashboard
                                                <ArrowRight className="w-5 h-5 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </form>

                                <div className="mt-8 pt-6 border-t">
                                    <div className="bg-accent/5 rounded-xl p-4 border border-accent/10">
                                        <p className="text-[10px] uppercase tracking-widest font-black text-accent mb-2">Demo Credentials</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground">Portal Admin</p>
                                                <p className="text-xs font-mono">alex@seosuite.com</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground">US Strategy</p>
                                                <p className="text-xs font-mono">sarah@seosuite.com</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground">SEO Head</p>
                                                <p className="text-xs font-mono">robert@seosuite.com</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground">SEO Junior</p>
                                                <p className="text-xs font-mono">jennifer@seosuite.com</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground">Client</p>
                                                <p className="text-xs font-mono">john@acmeplumbing.com</p>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground mt-2 italic font-medium text-center">Password: password123</p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-secondary/20 border-t py-4 flex flex-col gap-2">
                                <p className="text-xs text-muted-foreground text-center font-medium">
                                    Don't have an account?
                                    <Link to="/pricing" className="text-accent font-bold hover:underline ml-1">View Plans</Link>
                                </p>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
