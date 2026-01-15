import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import {
  Zap,
  BarChart3,
  Users,
  Bot,
  CheckCircle2,
  ArrowRight,
  Star,
  Shield,
  Clock
} from 'lucide-react';

export default function Landing() {
  const features = [
    {
      icon: Zap,
      title: 'Automated SEO Execution',
      description: 'Streamlined workflows from strategy to implementation with built-in quality gates.'
    },
    {
      icon: Bot,
      title: 'AI Visibility Optimization',
      description: 'Get your brand mentioned in AI responses with cutting-edge AEO strategies.'
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Track local pack visibility, GBP performance, and AI mention scores live.'
    },
    {
      icon: Users,
      title: 'Multi-Role Collaboration',
      description: 'Seamless handoffs between strategy, execution, and client approval teams.'
    },
  ];

  const workflow = [
    { step: '1', title: 'Onboard', description: 'Quick setup with guided intake' },
    { step: '2', title: 'Execute', description: 'Professional SEO implementation' },
    { step: '3', title: 'Review', description: 'Quality assurance at every step' },
    { step: '4', title: 'Report', description: 'Transparent progress tracking' },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-info/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-6 pt-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 animate-fade-in">
              <Star className="w-4 h-4 text-warning" />
              <span className="text-sm text-primary-foreground/90">Trusted by 500+ local businesses</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 animate-fade-in stagger-1">
              Dominate Local Search
              <span className="block text-gradient mt-2">& AI Visibility</span>
            </h1>

            <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto animate-fade-in stagger-2">
              End-to-end SEO execution platform with built-in workflows,
              multi-team collaboration, and AI-powered optimization strategies.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in stagger-3">
              <Link to="/free-trial">
                <Button variant="accent" size="xl" className="gap-2 shadow-glow animate-pulse-glow">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="hero-outline" size="xl">
                  View Pricing
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-8 mt-12 animate-fade-in stagger-4">
              <div className="flex items-center gap-2 text-primary-foreground/70">
                <Shield className="w-5 h-5" />
                <span className="text-sm">No credit card required</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/70">
                <Clock className="w-5 h-5" />
                <span className="text-sm">14-day free trial</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-primary-foreground/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Rank</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A complete platform designed for agencies and businesses serious about local SEO success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-card border border-border hover:shadow-lg hover:border-accent/50 transition-all duration-300 group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Powerful Workflow</h2>
            <p className="text-muted-foreground text-lg">From onboarding to results in 4 clear stages</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            {workflow.map((item, index) => (
              <div key={item.step} className="flex items-center gap-4 md:gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center text-2xl font-bold text-accent-foreground mb-3 shadow-glow">
                    {item.step}
                  </div>
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                {index < workflow.length - 1 && (
                  <ArrowRight className="hidden md:block w-6 h-6 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Transform Your Local SEO?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
            Join hundreds of businesses already seeing results with our streamlined SEO platform.
          </p>
          <Link to="/register">
            <Button variant="accent" size="xl" className="gap-2 shadow-glow">
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl">SEO Suite</span>
            </div>
            <p className="text-sm text-primary-foreground/60">
              © 2024 SEO Suite. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
