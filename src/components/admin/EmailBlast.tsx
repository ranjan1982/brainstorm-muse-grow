import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Send,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Eye
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmailBlast as EmailBlastType } from '@/types/admin';
import { SubscriptionTier, SUBSCRIPTION_TIER_LABELS } from '@/types';
import { format } from 'date-fns';

interface EmailBlastProps {
  emailBlasts: EmailBlastType[];
  onSendBlast: (blast: Omit<EmailBlastType, 'id' | 'createdAt' | 'sentAt' | 'status' | 'recipientCount' | 'openCount'>) => void;
}

export function EmailBlast({ emailBlasts, onSendBlast }: EmailBlastProps) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [recipientType, setRecipientType] = useState<EmailBlastType['recipientType']>('all-clients');
  const [targetTier, setTargetTier] = useState<SubscriptionTier>('starter');

  const sentBlasts = emailBlasts.filter(b => b.status === 'sent');
  const draftBlasts = emailBlasts.filter(b => b.status === 'draft');

  const handleSend = () => {
    onSendBlast({
      subject,
      body,
      recipientType,
      targetTier: recipientType === 'specific-tier' ? targetTier : undefined,
      sentBy: 'admin-1'
    });
    setSubject('');
    setBody('');
  };

  const getStatusIcon = (status: EmailBlastType['status']) => {
    switch (status) {
      case 'sent': return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'draft': return <Clock className="w-4 h-4 text-muted-foreground" />;
      case 'failed': return <XCircle className="w-4 h-4 text-destructive" />;
      default: return null;
    }
  };

  const getRecipientLabel = (type: EmailBlastType['recipientType'], tier?: SubscriptionTier) => {
    switch (type) {
      case 'all-clients': return 'All Clients';
      case 'active-clients': return 'Active Clients';
      case 'specific-tier': return tier ? `${SUBSCRIPTION_TIER_LABELS[tier]} Tier` : 'Specific Tier';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Email Blast</h2>
        <p className="text-muted-foreground">Send broadcast communications to client users</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compose Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Compose Broadcast
            </CardTitle>
            <CardDescription>Create and send email to multiple clients</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Recipients</Label>
              <Select
                value={recipientType}
                onValueChange={(value: EmailBlastType['recipientType']) => setRecipientType(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-clients">All Clients</SelectItem>
                  <SelectItem value="active-clients">Active Clients Only</SelectItem>
                  <SelectItem value="specific-tier">Specific Subscription Tier</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {recipientType === 'specific-tier' && (
              <div className="space-y-2">
                <Label>Target Tier</Label>
                <Select
                  value={targetTier}
                  onValueChange={(value: SubscriptionTier) => setTargetTier(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="growth">Growth</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject line..."
              />
            </div>

            <div className="space-y-2">
              <Label>Message Body</Label>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your message here..."
                className="min-h-[200px]"
              />
              <p className="text-xs text-muted-foreground">
                Available variables: {'{{client_name}}'}, {'{{company}}'}, {'{{subscription_tier}}'}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button 
                onClick={handleSend} 
                disabled={!subject || !body}
                className="flex-1"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Broadcast
              </Button>
              <Button variant="outline">
                Save as Draft
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* History Section */}
        <div className="space-y-4">
          <Tabs defaultValue="sent">
            <TabsList className="w-full">
              <TabsTrigger value="sent" className="flex-1">
                Sent ({sentBlasts.length})
              </TabsTrigger>
              <TabsTrigger value="drafts" className="flex-1">
                Drafts ({draftBlasts.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sent" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sent Broadcasts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sentBlasts.map(blast => (
                      <div key={blast.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(blast.status)}
                              <p className="font-medium">{blast.subject}</p>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {blast.body}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{getRecipientLabel(blast.recipientType, blast.targetTier)}</span>
                          </div>
                          {blast.sentAt && (
                            <span>Sent: {format(blast.sentAt, 'MMM d, yyyy h:mm a')}</span>
                          )}
                          {blast.recipientCount !== undefined && (
                            <Badge variant="outline" className="text-xs">
                              {blast.recipientCount} recipients
                            </Badge>
                          )}
                          {blast.openCount !== undefined && (
                            <Badge variant="secondary" className="text-xs">
                              {blast.openCount} opens
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {sentBlasts.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No broadcasts sent yet.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="drafts" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Draft Broadcasts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {draftBlasts.map(blast => (
                      <div key={blast.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(blast.status)}
                              <p className="font-medium">{blast.subject}</p>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {blast.body}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Edit</Button>
                            <Button size="sm">Send</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {draftBlasts.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No drafts saved.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
