import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { kpiHistory } from '@/data/mockData';
import { TrendingUp, Eye, Bot, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '@/context/AppContext';

export function KPIDashboard() {
  const { currentClient, getClientKPIData } = useApp();
  const kpiData = getClientKPIData(currentClient?.id || 'client-1');

  const kpis = [
    {
      title: 'Local Pack Visibility',
      value: `+${kpiData.localPackVisibility}%`,
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
      description: 'Month over month'
    },
    {
      title: 'GBP Views',
      value: `+${kpiData.gbpViews}%`,
      icon: Eye,
      color: 'text-info',
      bgColor: 'bg-info/10',
      description: 'Increased traffic'
    },
    {
      title: 'AI Mention Score',
      value: `${kpiData.aiMentionScore}/5`,
      icon: Bot,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      description: 'Brand visibility in AI'
    },
    {
      title: 'Tasks Completed',
      value: `${kpiData.tasksCompleted}/${kpiData.totalTasks}`,
      icon: CheckCircle2,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      description: kpiData.totalTasks > 0 ? `${Math.round((kpiData.tasksCompleted / kpiData.totalTasks) * 100)}% complete` : '0% complete'
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card 
            key={kpi.title} 
            className="animate-fade-in hover:shadow-lg transition-shadow"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${kpi.bgColor}`}>
                  <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
                <ArrowUpRight className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold">{kpi.value}</h3>
                <p className="text-sm font-medium text-foreground mt-1">{kpi.title}</p>
                <p className="text-xs text-muted-foreground">{kpi.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-fade-in stagger-4">
          <CardHeader>
            <CardTitle className="text-lg">Visibility Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={kpiHistory}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="visibility" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in stagger-5">
          <CardHeader>
            <CardTitle className="text-lg">GBP Views Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={kpiHistory}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="hsl(var(--info))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--info))', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Hint */}
      <Card className="border-dashed border-2 bg-muted/30">
        <CardContent className="p-6 text-center">
          <Bot className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">Advanced AI Analytics</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Unlock detailed AI visibility tracking, competitor analysis, and predictive insights.
          </p>
          <span className="text-accent font-medium text-sm">Upgrade to Growth Tier →</span>
        </CardContent>
      </Card>
    </div>
  );
}
