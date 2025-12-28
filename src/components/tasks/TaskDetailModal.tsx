import { Task, STATUS_LABELS, ROLE_LABELS, UserRole, PHASE_LABELS } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  MessageSquare, 
  FileText, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Send,
  Calendar,
  User,
  Folder,
  History,
  Paperclip
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface TaskDetailModalProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDetailModal({ task, open, onOpenChange }: TaskDetailModalProps) {
  const { currentUser, updateTask, addComment, users } = useApp();
  const [newComment, setNewComment] = useState('');

  if (!task) return null;

  const handleStatusChange = (newStatus: Task['status']) => {
    updateTask(task.id, { status: newStatus });
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    addComment(task.id, newComment.trim());
    setNewComment('');
  };

  const canEdit = () => {
    if (!currentUser) return false;
    if ((currentUser.role === 'india-head' || currentUser.role === 'india-junior') && 
        (task.owner === 'india-head' || task.owner === 'india-junior')) {
      return true;
    }
    if (currentUser.role === 'client' && task.owner === 'client') {
      return true;
    }
    if (currentUser.role === 'us-strategy' && task.status === 'submitted') {
      return true;
    }
    return false;
  };

  const canApprove = () => {
    return currentUser?.role === 'us-strategy' && task.status === 'submitted';
  };

  const statusIcon = {
    'pending': <Clock className="w-4 h-4" />,
    'in-progress': <AlertCircle className="w-4 h-4" />,
    'completed': <CheckCircle2 className="w-4 h-4" />,
    'submitted': <Send className="w-4 h-4" />,
    'approved': <CheckCircle2 className="w-4 h-4" />,
    'resubmit': <RotateCcw className="w-4 h-4" />,
  };

  const getOwnerUser = () => {
    if (task.owner === 'system') return null;
    return users.find(u => u.role === task.owner);
  };

  const ownerUser = getOwnerUser();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b border-border/50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">
                  {task.taskId}
                </span>
                <Badge variant={task.phase as any} className="text-[10px]">
                  {PHASE_LABELS[task.phase]}
                </Badge>
                {task.cadence && (
                  <Badge variant="outline" className="text-[10px]">
                    {task.cadence}
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-xl font-semibold">
                {task.title}
              </DialogTitle>
            </div>
            <Badge variant={task.status as any} className="shrink-0 text-sm">
              {statusIcon[task.status]}
              <span className="ml-1">{STATUS_LABELS[task.status]}</span>
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[60vh]">
          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Description
              </h4>
              <p className="text-sm leading-relaxed">
                {task.description || 'No description provided.'}
              </p>
            </div>

            <Separator />

            {/* Meta Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <h5 className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  Owner
                </h5>
                <Badge variant={task.owner as any} className="text-xs">
                  {task.owner === 'system' ? 'System' : ROLE_LABELS[task.owner as UserRole]}
                </Badge>
              </div>
              <div>
                <h5 className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <Folder className="w-3 h-3" />
                  Phase
                </h5>
                <span className="text-sm">{PHASE_LABELS[task.phase]}</span>
              </div>
              <div>
                <h5 className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Created
                </h5>
                <span className="text-sm">{format(task.createdAt, 'MMM d, yyyy')}</span>
              </div>
              <div>
                <h5 className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <History className="w-3 h-3" />
                  Updated
                </h5>
                <span className="text-sm">{format(task.updatedAt, 'MMM d, yyyy')}</span>
              </div>
            </div>

            {ownerUser && (
              <div className="bg-secondary/30 rounded-lg p-4 flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-accent text-accent-foreground">
                    {ownerUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{ownerUser.name}</p>
                  <p className="text-xs text-muted-foreground">{ownerUser.email}</p>
                </div>
              </div>
            )}

            <Separator />

            {/* Documents */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Paperclip className="w-4 h-4" />
                Attachments ({task.documents.length})
              </h4>
              {task.documents.length === 0 ? (
                <div className="text-center py-6 bg-secondary/20 rounded-lg border border-dashed border-border">
                  <Paperclip className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">No attachments yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {task.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-2 p-2 bg-secondary/30 rounded-lg">
                      <FileText className="w-4 h-4 text-accent" />
                      <span className="text-sm flex-1">{doc.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(doc.uploadedAt, 'MMM d')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Comments */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Comments ({task.comments.length})
              </h4>
              
              {task.comments.length === 0 ? (
                <div className="text-center py-6 bg-secondary/20 rounded-lg border border-dashed border-border">
                  <MessageSquare className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">No comments yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {task.comments.map((comment) => (
                    <div key={comment.id} className="bg-secondary/30 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-[10px]">
                            {comment.userName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{comment.userName}</span>
                        <Badge variant={comment.userRole as any} className="text-[9px] px-1.5">
                          {ROLE_LABELS[comment.userRole]}
                        </Badge>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {format(comment.createdAt, 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/80 pl-8">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment */}
              {currentUser && (
                <div className="mt-4 flex gap-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                  <Button 
                    variant="accent" 
                    size="icon"
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim()}
                    className="shrink-0 h-10 w-10"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Action Footer */}
        <div className="p-4 border-t border-border/50 bg-secondary/20 flex gap-2 flex-wrap">
          {canEdit() && task.status === 'pending' && (
            <Button variant="outline" onClick={() => handleStatusChange('in-progress')}>
              Start Task
            </Button>
          )}
          {canEdit() && task.status === 'in-progress' && (
            <Button variant="outline" onClick={() => handleStatusChange('completed')}>
              Mark Complete
            </Button>
          )}
          {canEdit() && task.status === 'completed' && (
            <Button variant="accent" onClick={() => handleStatusChange('submitted')}>
              Submit for Review
            </Button>
          )}
          {canApprove() && (
            <>
              <Button variant="success" onClick={() => handleStatusChange('approved')}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button variant="destructive" onClick={() => handleStatusChange('resubmit')}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Request Revision
              </Button>
            </>
          )}
          {task.status === 'resubmit' && canEdit() && (
            <Button variant="warning" onClick={() => handleStatusChange('in-progress')}>
              <AlertCircle className="w-4 h-4 mr-2" />
              Revise Task
            </Button>
          )}
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="ml-auto">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
