import { Task, STATUS_LABELS, ROLE_LABELS, UserRole, PHASE_LABELS } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useApp } from '@/context/AppContext';
import { useState, useRef } from 'react';
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
  Paperclip,
  Upload,
  X,
  Download
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface TaskDetailModalProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CommentAttachmentInput {
  name: string;
  size: number;
  type: string;
  url: string;
}

export function TaskDetailModal({ task, open, onOpenChange }: TaskDetailModalProps) {
  const { currentUser, updateTask, addComment, addDocumentToTask, users } = useApp();
  const [newComment, setNewComment] = useState('');
  const [commentAttachments, setCommentAttachments] = useState<CommentAttachmentInput[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!task) return null;

  const handleStatusChange = (newStatus: Task['status']) => {
    if (newStatus === 'submitted') {
      // Handoff to US Strategy for review
      updateTask(task.id, {
        status: 'submitted',
        owner: 'us-strategy'
      });
    } else if (newStatus === 'resubmit') {
      // Handoff back to India team for revision
      updateTask(task.id, {
        status: 'resubmit',
        owner: 'india-head'
      });
    } else {
      updateTask(task.id, { status: newStatus });
    }
  };

  const handleSubmitComment = () => {
    if (!newComment.trim() && commentAttachments.length === 0) return;
    addComment(task.id, newComment.trim(), commentAttachments.length > 0 ? commentAttachments : undefined);
    setNewComment('');
    setCommentAttachments([]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: CommentAttachmentInput[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      newAttachments.push({
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      });
    }
    setCommentAttachments(prev => [...prev, ...newAttachments]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setCommentAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Permission checks based on workflow document
  // US Strategy is the GATEKEEPER - only they approve and send to client

  const canEdit = () => {
    if (!currentUser) return false;

    // India SEO Head can work on ALL tasks (execute tasks)
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

  // ONLY US Strategy can approve tasks
  const canApprove = () => {
    return currentUser?.role === 'us-strategy' && task.status === 'submitted';
  };

  // US Strategy can send approved task to client
  const canSendToClient = () => {
    return currentUser?.role === 'us-strategy' && task.status === 'approved' && task.owner !== 'client';
  };

  // ONLY US Strategy can comment on ALL tasks
  // Other roles can only comment on tasks assigned to their role
  const canComment = () => {
    if (!currentUser) return false;

    // US Strategy can add feedback/comment on ALL tasks (they review everything)
    if (currentUser.role === 'us-strategy') return true;

    // India SEO Head can comment on all India team tasks
    if (currentUser.role === 'india-head') {
      return task.owner === 'india-head' || task.owner === 'india-junior';
    }

    // India SEO Junior can comment only on their assigned tasks
    if (currentUser.role === 'india-junior') {
      return task.owner === 'india-junior' || task.assignedTo === currentUser?.id;
    }

    // Client can comment on client tasks
    if (currentUser.role === 'client') {
      return task.owner === 'client';
    }

    return false;
  };

  // Can upload documents - same as comment permissions
  const canUploadDocuments = () => canComment();

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

  // Sort comments by date descending (newest first)
  const sortedComments = [...task.comments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Calculate task progress based on status
  const getTaskProgress = () => {
    const statusProgress: Record<Task['status'], number> = {
      'pending': 0,
      'in-progress': 25,
      'completed': 50,
      'submitted': 75,
      'approved': 100,
      'resubmit': 30,
    };
    return statusProgress[task.status];
  };

  // Group comments by date
  const groupCommentsByDate = () => {
    const groups: { [key: string]: typeof sortedComments } = {};
    sortedComments.forEach(comment => {
      const dateKey = format(new Date(comment.createdAt), 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(comment);
    });
    return groups;
  };

  const commentGroups = groupCommentsByDate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0">
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

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Task Progress</span>
              <span>{getTaskProgress()}%</span>
            </div>
            <Progress value={getTaskProgress()} className="h-2" />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>Pending</span>
              <span>In Progress</span>
              <span>Completed</span>
              <span>Submitted</span>
              <span>Approved</span>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" className="flex-1">
          <TabsList className="w-full justify-start border-b border-border/50 rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger
              value="details"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 py-3"
            >
              <FileText className="w-4 h-4 mr-2" />
              Details
            </TabsTrigger>
            <TabsTrigger
              value="communication"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 py-3"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Communication ({task.comments.length})
            </TabsTrigger>
            <TabsTrigger
              value="attachments"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 py-3"
            >
              <Paperclip className="w-4 h-4 mr-2" />
              Attachments ({task.documents.length + (task.attachments?.length || 0)})
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 max-h-[50vh]">
            <TabsContent value="details" className="p-6 space-y-6 m-0">
              {/* Description */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Description
                </h4>
                <p className="text-sm leading-relaxed bg-secondary/20 p-4 rounded-lg">
                  {task.description || 'No description provided.'}
                </p>
              </div>

              <Separator />

              {/* Meta Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-secondary/20 p-3 rounded-lg">
                  <h5 className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Owner
                  </h5>
                  <Badge variant={task.owner as any} className="text-xs">
                    {task.owner === 'system' ? 'System' : ROLE_LABELS[task.owner as UserRole]}
                  </Badge>
                </div>
                <div className="bg-secondary/20 p-3 rounded-lg">
                  <h5 className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <Folder className="w-3 h-3" />
                    Phase
                  </h5>
                  <span className="text-sm font-medium">{PHASE_LABELS[task.phase]}</span>
                </div>
                <div className="bg-secondary/20 p-3 rounded-lg">
                  <h5 className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Created
                  </h5>
                  <span className="text-sm font-medium">{format(task.createdAt, 'MMM d, yyyy')}</span>
                </div>
                <div className="bg-secondary/20 p-3 rounded-lg">
                  <h5 className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <History className="w-3 h-3" />
                    Updated
                  </h5>
                  <span className="text-sm font-medium">{format(task.updatedAt, 'MMM d, yyyy')}</span>
                </div>
              </div>

              {task.approver && (
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                  <h5 className="text-xs font-medium text-muted-foreground mb-2">Approver</h5>
                  <Badge variant={task.approver as any}>
                    {ROLE_LABELS[task.approver]}
                  </Badge>
                </div>
              )}

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
            </TabsContent>

            <TabsContent value="communication" className="p-6 space-y-4 m-0">
              {/* Add Comment Section */}
              {canComment() ? (
                <div className="bg-secondary/20 rounded-lg p-4 border border-border/50">
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Add Feedback / Comment
                  </h4>
                  <Textarea
                    placeholder="Write your feedback or comment here..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[100px] resize-none mb-3"
                  />

                  {/* Attachment Preview */}
                  {commentAttachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {commentAttachments.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full text-xs">
                          <Paperclip className="w-3 h-3" />
                          <span className="max-w-[150px] truncate">{file.name}</span>
                          <span className="text-muted-foreground">({formatFileSize(file.size)})</span>
                          <button onClick={() => removeAttachment(index)} className="hover:text-destructive">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      className="hidden"
                      multiple
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Attach Files
                    </Button>
                    <Button
                      variant="accent"
                      size="sm"
                      onClick={handleSubmitComment}
                      disabled={!newComment.trim() && commentAttachments.length === 0}
                      className="ml-auto"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-lg border border-destructive/20">
                  You can only add comments on tasks assigned to your role.
                </div>
              )}

              <Separator />

              {/* Comments List - Grouped by Date */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Communication History
                </h4>

                {sortedComments.length === 0 ? (
                  <div className="text-center py-8 bg-secondary/20 rounded-lg border border-dashed border-border">
                    <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-sm text-muted-foreground">No comments yet</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">Be the first to add feedback</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(commentGroups).map(([dateKey, comments]) => (
                      <div key={dateKey}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-px bg-border flex-1" />
                          <span className="text-xs font-medium text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
                            {format(new Date(dateKey), 'EEEE, MMMM d, yyyy')}
                          </span>
                          <div className="h-px bg-border flex-1" />
                        </div>
                        <div className="space-y-3">
                          {comments.map((comment) => (
                            <div key={comment.id} className="bg-secondary/30 rounded-lg p-4 border-l-4 border-accent">
                              <div className="flex items-center gap-2 mb-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="text-xs bg-accent text-accent-foreground">
                                    {comment.userName.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <span className="text-sm font-medium">{comment.userName}</span>
                                  <Badge variant={comment.userRole as any} className="text-[9px] px-1.5 ml-2">
                                    {ROLE_LABELS[comment.userRole]}
                                  </Badge>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(comment.createdAt), 'h:mm a')}
                                </span>
                              </div>
                              <p className="text-sm text-foreground/90 pl-10 whitespace-pre-wrap">{comment.content}</p>

                              {/* Comment Attachments */}
                              {comment.attachments && comment.attachments.length > 0 && (
                                <div className="pl-10 mt-3 flex flex-wrap gap-2">
                                  {comment.attachments.map((attachment) => (
                                    <a
                                      key={attachment.id}
                                      href={attachment.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 bg-secondary/50 hover:bg-secondary/70 px-3 py-2 rounded-lg text-xs transition-colors"
                                    >
                                      <FileText className="w-4 h-4 text-accent" />
                                      <span className="max-w-[120px] truncate">{attachment.name}</span>
                                      <Download className="w-3 h-3 text-muted-foreground" />
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="attachments" className="p-6 space-y-4 m-0">
              {/* Task Documents */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <Paperclip className="w-4 h-4" />
                  Task Documents ({task.documents.length})
                </h4>
                {task.documents.length === 0 ? (
                  <div className="text-center py-6 bg-secondary/20 rounded-lg border border-dashed border-border">
                    <Paperclip className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">No documents attached</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {task.documents.map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-secondary/30 hover:bg-secondary/50 rounded-lg transition-colors"
                      >
                        <FileText className="w-5 h-5 text-accent" />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium truncate block">{doc.name}</span>
                          <span className="text-xs text-muted-foreground">
                            Uploaded {format(doc.uploadedAt, 'MMM d, yyyy')}
                          </span>
                        </div>
                        <Download className="w-4 h-4 text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Task Attachments */}
              {task.attachments && task.attachments.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Task Attachments ({task.attachments.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {task.attachments.map((attachment) => (
                        <a
                          key={attachment.id}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-secondary/30 hover:bg-secondary/50 rounded-lg transition-colors"
                        >
                          <FileText className="w-5 h-5 text-accent" />
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium truncate block">{attachment.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatFileSize(attachment.size)} • {format(attachment.uploadedAt, 'MMM d, yyyy')}
                            </span>
                          </div>
                          <Download className="w-4 h-4 text-muted-foreground" />
                        </a>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>

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

          {/* US Strategy Approval Actions - They are the gatekeeper */}
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

          {/* US Strategy can send approved tasks to client for their review */}
          {canSendToClient() && (
            <Button variant="accent" onClick={() => {
              // Mark task as ready for client review
              updateTask(task.id, {
                status: 'pending',
                owner: 'client',
                approver: 'client'
              });
            }}>
              <Send className="w-4 h-4 mr-2" />
              Send to Client
            </Button>
          )}

          {task.status === 'resubmit' && canEdit() && (
            <Button variant="warning" onClick={() => handleStatusChange('in-progress')}>
              <AlertCircle className="w-4 h-4 mr-2" />
              Revise Task
            </Button>
          )}

          {/* Role-specific info */}
          {currentUser?.role === 'us-strategy' && task.status !== 'submitted' && task.status !== 'approved' && (
            <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">
              Awaiting submission for review
            </div>
          )}

          <Button variant="ghost" onClick={() => onOpenChange(false)} className="ml-auto">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
