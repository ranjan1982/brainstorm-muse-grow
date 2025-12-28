import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { useApp } from '@/context/AppContext';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    phone: '',
    website: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      // Simulate checkout success
      toast.success('Subscription activated!', {
        description: 'Welcome to SEO Suite Starter Plan'
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
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= 1 ? 'bg-accent text-accent-foreground' : 'bg-muted'
                }`}>
                  {step > 1 ? <CheckCircle2 className="w-5 h-5" /> : '1'}
                </div>
                <span className="text-sm font-medium">Business Info</span>
              </div>
              <div className="w-12 h-0.5 bg-border" />
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= 2 ? 'bg-accent text-accent-foreground' : 'bg-muted'
                }`}>
                  2
                </div>
                <span className="text-sm font-medium">Checkout</span>
              </div>
            </div>

            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <Badge variant="accent" className="w-fit mx-auto mb-2">
                  <Zap className="w-3 h-3 mr-1" />
                  Starter Plan
                </Badge>
                <CardTitle className="text-2xl">
                  {step === 1 ? 'Create Your Account' : 'Complete Your Purchase'}
                </CardTitle>
                <CardDescription>
                  {step === 1 
                    ? 'Tell us about your business to get started' 
                    : 'Enter payment details to activate your subscription'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {step === 1 ? (
                    <>
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
                        <Label htmlFor="website">Website URL (optional)</Label>
                        <Input
                          id="website"
                          name="website"
                          type="url"
                          placeholder="https://acmeplumbing.com"
                          value={formData.website}
                          onChange={handleChange}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-secondary/50 rounded-lg p-4 mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Starter Plan</span>
                          <span className="font-bold">$499/mo</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          14-day free trial included
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="4242 4242 4242 4242"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input
                            id="cvc"
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}
                  
                  <Button type="submit" variant="accent" className="w-full" size="lg">
                    {step === 1 ? (
                      <>
                        Continue to Checkout
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        Start Free Trial
                        <Zap className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                  
                  {step === 2 && (
                    <p className="text-xs text-center text-muted-foreground">
                      You won't be charged until your 14-day trial ends. Cancel anytime.
                    </p>
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
