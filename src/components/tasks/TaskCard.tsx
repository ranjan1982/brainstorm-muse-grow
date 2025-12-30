import { Task, STATUS_LABELS, ROLE_LABELS, UserRole } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { 
  MessageSquare, 
  FileText, 
  Clock, 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Eye,
  Send
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onViewDetails?: (task: Task) => void;
}

export function TaskCard({ task, onViewDetails }: TaskCardProps) {
  const { currentUser, updateTask, addComment } = useApp();
  
  // Permission checks based on workflow document
  // US Strategy is the GATEKEEPER - only they approve and send to client
  
  const canEdit = () => {
    if (!currentUser) return false;
    
    // India SEO Head can work on ALL tasks
    if (currentUser.role === 'india-head') {
      return task.status !== 'approved' && task.status !== 'submitted';
    }
    
    // India SEO Junior can only work on tasks assigned to them
    if (currentUser.role === 'india-junior') {
      const isAssignedToJunior = task.owner === 'india-junior' || task.assignedTo === currentUser.id;
      return isAssignedToJunior && task.status !== 'approved' && task.status !== 'submitted';
    }
    
    // Client can only work on client-assigned tasks
    if (currentUser.role === 'client') {
      return task.owner === 'client' && task.status !== 'approved' && task.status !== 'submitted';
    }
    
    return false;
  };

  const canSubmit = () => {
    if (!currentUser) return false;
    if (task.status !== 'completed') return false;
    
    // India SEO Head can submit any task
    if (currentUser.role === 'india-head') return true;
    
    // India SEO Junior can submit their assigned tasks
    if (currentUser.role === 'india-junior') {
      return task.owner === 'india-junior' || task.assignedTo === currentUser.id;
    }
    
    // Client can submit client tasks
    if (currentUser.role === 'client') {
      return task.owner === 'client';
    }
    
    return false;
  };

  // ONLY US Strategy can approve tasks and send to client
  const canApprove = () => {
    return currentUser?.role === 'us-strategy' && task.status === 'submitted';
  };
  
  // US Strategy can send approved tasks to client for review
  const canSendToClient = () => {
    return currentUser?.role === 'us-strategy' && task.status === 'approved' && task.owner !== 'client';
  };

  const handleStatusChange = (newStatus: Task['status']) => {
    updateTask(task.id, { status: newStatus });
  };

  const handleSubmit = () => {
    if (canSubmit()) {
      updateTask(task.id, { status: 'submitted' });
    }
  };

  const handleApprove = () => {
    if (canApprove()) {
      updateTask(task.id, { status: 'approved' });
    }
  };

  const handleResubmit = () => {
    if (canApprove()) {
      updateTask(task.id, { status: 'resubmit' });
    }
  };
  
  const handleSendToClient = () => {
    if (canSendToClient()) {
      updateTask(task.id, { 
        status: 'pending', 
        owner: 'client',
        approver: 'client' 
      });
    }
  };

  const statusIcon = {
    'pending': <Clock className="w-4 h-4" />,
    'in-progress': <ArrowRight className="w-4 h-4" />,
    'completed': <CheckCircle2 className="w-4 h-4" />,
    'submitted': <Eye className="w-4 h-4" />,
    'approved': <CheckCircle2 className="w-4 h-4" />,
    'resubmit': <RotateCcw className="w-4 h-4" />,
  };

  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-lg cursor-pointer group",
      task.status === 'approved' && "opacity-75",
      task.status === 'resubmit' && "border-destructive/50"
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-muted-foreground">{task.taskId}</span>
              {task.cadence && (
                <Badge variant="outline" className="text-[10px] px-1.5">
                  {task.cadence}
                </Badge>
              )}
            </div>
            <h4 className="font-semibold text-sm group-hover:text-accent transition-colors">
              {task.title}
            </h4>
          </div>
          <Badge variant={task.status as any} className="shrink-0">
            {statusIcon[task.status]}
            <span className="ml-1">{STATUS_LABELS[task.status]}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <Badge variant={task.owner as any} className="text-[10px]">
            {task.owner === 'system' ? 'System' : ROLE_LABELS[task.owner as UserRole]}
          </Badge>
          
          {/* Show workflow status for team members */}
          {currentUser?.role !== 'client' && task.status === 'submitted' && (
            <span className="flex items-center gap-1 text-amber-500">
              <Clock className="w-3 h-3" />
              Awaiting US Strategy Review
            </span>
          )}
          
          {task.comments.length > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {task.comments.length}
            </span>
          )}
          {task.documents.length > 0 && (
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {task.documents.length}
            </span>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          {canEdit() && task.status === 'pending' && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={(e) => { e.stopPropagation(); handleStatusChange('in-progress'); }}
            >
              Start Task
            </Button>
          )}
          
          {canEdit() && task.status === 'in-progress' && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={(e) => { e.stopPropagation(); handleStatusChange('completed'); }}
            >
              Mark Complete
            </Button>
          )}
          
          {canSubmit() && (
            <Button 
              size="sm" 
              variant="accent"
              onClick={(e) => { e.stopPropagation(); handleSubmit(); }}
            >
              Submit for Review
            </Button>
          )}
          
          {canApprove() && (
            <>
              <Button 
                size="sm" 
                variant="success"
                onClick={(e) => { e.stopPropagation(); handleApprove(); }}
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={(e) => { e.stopPropagation(); handleResubmit(); }}
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Resubmit
              </Button>
            </>
          )}
          
          {/* US Strategy can send approved tasks to client */}
          {canSendToClient() && (
            <Button 
              size="sm" 
              variant="accent"
              onClick={(e) => { e.stopPropagation(); handleSendToClient(); }}
            >
              <Send className="w-4 h-4 mr-1" />
              Send to Client
            </Button>
          )}
          
          {task.status === 'resubmit' && canEdit() && (
            <Button 
              size="sm" 
              variant="warning"
              onClick={(e) => { e.stopPropagation(); handleStatusChange('in-progress'); }}
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              Revise Task
            </Button>
          )}
          
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => onViewDetails?.(task)}
            className="ml-auto"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
