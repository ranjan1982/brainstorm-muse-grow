import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { CheckCircle2, ArrowRight, Calendar, Mail, Phone } from 'lucide-react';

export default function CheckoutSuccess() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6 animate-fade-in">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>

            <h1 className="text-3xl font-bold mb-4 animate-fade-in stagger-1">
              Welcome to SEO Suite!
            </h1>

            <p className="text-muted-foreground mb-8 animate-fade-in stagger-2">
              Your subscription is now active and your account has been created.
              Your 14-day free trial has begun.
            </p>

            <Card className="mb-8 animate-fade-in stagger-3">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">What happens next?</h3>
                <div className="space-y-4 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">Onboarding Call</p>
                      <p className="text-sm text-muted-foreground">
                        Our strategy team will reach out to schedule your kickoff call within 24 hours.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-info/20 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-info" />
                    </div>
                    <div>
                      <p className="font-medium">Check Your Email</p>
                      <p className="text-sm text-muted-foreground">
                        We've sent you access credentials and onboarding instructions.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-warning" />
                    </div>
                    <div>
                      <p className="font-medium">Prepare Your Assets</p>
                      <p className="text-sm text-muted-foreground">
                        Get your GBP login credentials and business photos ready for the onboarding process.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Link to="/dashboard">
              <Button variant="accent" size="lg" className="gap-2 animate-fade-in stagger-4">
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
