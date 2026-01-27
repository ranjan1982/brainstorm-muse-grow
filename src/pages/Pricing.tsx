import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Lock, Zap, Star, MapPin, Globe, GitBranch } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ServiceTrack, TRACK_LABELS } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Pricing() {
  const { plans: allPlans } = useApp();
  const [selectedTrack, setSelectedTrack] = useState<ServiceTrack>('local');

  const getTrackIcon = (track: ServiceTrack) => {
    switch (track) {
      case 'local': return <MapPin className="w-4 h-4 mr-2" />;
      case 'national': return <Globe className="w-4 h-4 mr-2" />;
      case 'hybrid': return <GitBranch className="w-4 h-4 mr-2" />;
    }
  };

  const trackPlans = [
    {
      tier: 'starter',
      description: {
        'local': 'Perfect for single-location businesses ready to dominate local search.',
        'national': 'Launch your national presence with core SaaS SEO foundations.',
        'hybrid': 'The best of both worlds for businesses with local and national reach.'
      },
      features: {
        'local': [
          'GBP Optimization & Management',
          '2 Google Posts per month',
          'Monthly Q&A seeding',
          '1 AI-optimized blog/mo',
          'Review monitoring',
          'Tier-1 citations'
        ],
        'national': [
          'National Keyword Research',
          'On-page technical SEO',
          'Sitemap optimization',
          '1 Content piece/mo',
          'Performance tracking',
          'Core Web Vitals audit'
        ],
        'hybrid': [
          'Everything in Local Starter',
          'National anchor keywords',
          'Hybrid search strategy',
          'Dual reporting'
        ]
      }
    },
    {
      tier: 'growth',
      highlighted: true,
      description: {
        'local': 'For growing businesses needing advanced SEO and AI visibility.',
        'national': 'Scale your SaaS or Brand across national markets effectively.',
        'hybrid': 'Aggressive growth for multi-region hybrid businesses.'
      },
      features: {
        'local': [
          'Advanced AI/AEO optimization',
          '4 Google Posts per month',
          'Competitor tracking',
          '2 AI-optimized blogs/mo',
          'Weekly strategy calls',
          'Priority support'
        ],
        'national': [
          'Advanced Content Strategy',
          'Link building (4/mo)',
          'Competitor Gap Analysis',
          '4 Technical blogs/mo',
          'BI Analytics Dashboard',
          'Priority support'
        ],
        'hybrid': [
          'Everything in Growth Local',
          'National PR reach',
          'Multi-channel AI optimization',
          'Custom strategy building'
        ]
      }
    },
    {
      tier: 'enterprise',
      description: {
        'local': 'For agencies and multi-location businesses with complex needs.',
        'national': 'Custom enterprise solutions for massive SaaS/National brands.',
        'hybrid': 'Total market dominance for complex hybrid organizations.'
      },
      features: {
        'local': [
          'Unlimited locations',
          'Custom AI strategies',
          'White-label reporting',
          'Dedicated manager',
          'API access',
          'SLA guarantee'
        ],
        'national': [
          'Custom SEO Engineering',
          'High-DA Link Building',
          'Global SEO support',
          'Market share analysis',
          'Dedicated project team',
          'Full API integration'
        ],
        'hybrid': [
          'Complete SEO infrastructure',
          'Multi-tier strategy',
          'Custom data modeling',
          'Enterprise-grade support'
        ]
      }
    }
  ];

  const currentPlans = trackPlans.map(tp => {
    const planData = allPlans.find(p => p.track === selectedTrack && p.tier === tp.tier && p.billingCycle === 'monthly');
    return {
      ...tp,
      id: planData?.id,
      name: tp.tier.charAt(0).toUpperCase() + tp.tier.slice(1),
      price: planData ? `$${planData.price}` : 'Custom',
      period: planData ? '/month' : '',
      description: tp.description[selectedTrack],
      available: !!planData || tp.tier === 'enterprise',
      featuresList: tp.features[selectedTrack as keyof typeof tp.features] || []
    };
  });

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
              Select your service track below to see tailored plans.
            </p>
          </div>

          {/* Track Selector */}
          <div className="flex justify-center mb-12">
            <Tabs value={selectedTrack} onValueChange={(v) => setSelectedTrack(v as ServiceTrack)} className="w-full max-w-2xl">
              <TabsList className="grid w-full grid-cols-3 h-14 p-1">
                <TabsTrigger value="local" className="font-bold py-3 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  {getTrackIcon('local')}
                  LOCAL
                </TabsTrigger>
                <TabsTrigger value="national" className="font-bold py-3 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  {getTrackIcon('national')}
                  NATIONAL
                </TabsTrigger>
                <TabsTrigger value="hybrid" className="font-bold py-3 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  {getTrackIcon('hybrid')}
                  HYBRID
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-bold shadow-sm">
              Active Track: {TRACK_LABELS[selectedTrack]}
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {currentPlans.map((plan) => (
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
                  <ul className="space-y-3 mb-8 min-h-[250px]">
                    {plan.featuresList.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                        <span className="text-sm font-medium">
                          {feature}
                        </span>
                      </li>
                    ))}
                    {plan.tier === 'enterprise' && (
                      <li className="flex items-start gap-2 text-muted-foreground italic text-sm">
                        Contact sales for tailored enterprise features.
                      </li>
                    )}
                  </ul>

                  {plan.available ? (
                    <div className="space-y-3">
                      <Link to={`/purchase?planId=${plan.id}`} className="block">
                        <Button
                          variant={plan.highlighted ? 'accent' : 'outline'}
                          className="w-full h-12 font-bold"
                          size="lg"
                        >
                          Purchase Subscription
                        </Button>
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
