import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Lock, Zap, Star } from 'lucide-react';

export default function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: '$499',
      period: '/month',
      description: 'Perfect for single-location businesses ready to dominate local search.',
      highlighted: true,
      available: true,
      features: [
        { text: 'GBP Optimization & Management', included: true },
        { text: '2 Google Posts per month', included: true },
        { text: 'Monthly Q&A seeding', included: true },
        { text: '1 AI-optimized blog per month', included: true },
        { text: 'Review monitoring', included: true },
        { text: 'Tier-1 citations', included: true },
        { text: 'Monthly reporting dashboard', included: true },
        { text: 'Email support', included: true },
        { text: 'Multi-location management', included: false },
        { text: 'Advanced AI/AEO optimization', included: false },
        { text: 'Competitor analysis', included: false },
      ],
    },
    {
      name: 'Growth',
      price: '$999',
      period: '/month',
      description: 'For growing businesses needing advanced SEO and AI visibility.',
      highlighted: false,
      available: false,
      features: [
        { text: 'Everything in Starter', included: true },
        { text: '4 Google Posts per month', included: true },
        { text: '2 AI-optimized blogs per month', included: true },
        { text: 'Advanced AI/AEO optimization', included: true },
        { text: 'Competitor tracking', included: true },
        { text: 'Proactive remediation', included: true },
        { text: 'Weekly strategy calls', included: true },
        { text: 'Priority support', included: true },
        { text: 'Multi-location (up to 3)', included: true },
      ],
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For agencies and multi-location businesses with complex needs.',
      highlighted: false,
      available: false,
      features: [
        { text: 'Everything in Growth', included: true },
        { text: 'Unlimited locations', included: true },
        { text: 'Custom AI strategies', included: true },
        { text: 'White-label reporting', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'API access', included: true },
        { text: 'Custom integrations', included: true },
        { text: 'SLA guarantee', included: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <Star className="w-3 h-3 mr-1" />
              Simple, Transparent Pricing
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your Growth Path
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              All plans include our core SEO workflow platform.
              Start with Starter and upgrade as you grow.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative transition-all duration-300 hover:shadow-xl ${plan.highlighted
                    ? 'border-accent shadow-lg scale-105 z-10'
                    : plan.available
                      ? 'hover:border-accent/50'
                      : 'opacity-75'
                  }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge variant="accent" className="shadow-glow">
                      <Zap className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                {!plan.available && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline">
                      <Lock className="w-3 h-3 mr-1" />
                      Coming Soon
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature.text} className="flex items-start gap-2">
                        {feature.included ? (
                          <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                        ) : (
                          <Lock className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                        )}
                        <span className={feature.included ? '' : 'text-muted-foreground'}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {plan.available ? (
                    <div className="space-y-3">
                      <Link to="/purchase" className="block">
                        <Button
                          variant={plan.highlighted ? 'accent' : 'outline'}
                          className="w-full h-12 font-bold"
                          size="lg"
                        >
                          Purchase Subscription
                        </Button>
                      </Link>
                      <Link to="/free-trial" className="block text-center">
                        <button className="text-sm font-bold text-muted-foreground hover:text-accent transition-colors">
                          Start 14-Day Free Trial
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <Button variant="outline" className="w-full" size="lg" disabled>
                      <Lock className="w-4 h-4 mr-2" />
                      Coming Soon
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-24 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What\'s included in the free trial?',
                  a: 'Your 14-day free trial includes full access to the Starter tier features. No credit card required.'
                },
                {
                  q: 'Can I upgrade my plan later?',
                  a: 'Absolutely! You can upgrade to Growth or Enterprise at any time. Your data and progress will be preserved.'
                },
                {
                  q: 'How does the workflow process work?',
                  a: 'Our platform guides you through each phase: onboarding, foundation setup, monthly execution, and reporting. Each task is tracked and reviewed for quality.'
                },
              ].map((faq) => (
                <Card key={faq.q} className="p-6">
                  <h4 className="font-semibold mb-2">{faq.q}</h4>
                  <p className="text-muted-foreground text-sm">{faq.a}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
