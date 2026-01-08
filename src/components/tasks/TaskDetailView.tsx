import { Task, STATUS_LABELS, ROLE_LABELS, UserRole, PHASE_LABELS } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/context/AppContext';
import { useState, useRef } from 'react';
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
    Download,
    ArrowLeft,
    ChevronRight,
    Building2,
    ChevronDown,
    ChevronUp,
    MoreHorizontal,
    Plus
} from 'lucide-react';
import { format } from 'date-fns';
import { cn, getWeeklyInfo } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface TaskDetailViewProps {
    taskId: string;
    onBack: () => void;
}

interface CommentAttachmentInput {
    name: string;
    size: number;
    type: string;
    url: string;
}

export function TaskDetailView({ taskId, onBack }: TaskDetailViewProps) {
    const { currentUser, tasks, updateTask, addComment, users, clients } = useApp();
    const [newComment, setNewComment] = useState('');
    const [assignmentNote, setAssignmentNote] = useState('');
    const [isAssigning, setIsAssigning] = useState(false);
    const [commentAttachments, setCommentAttachments] = useState<CommentAttachmentInput[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold">Task Not Found</h2>
                <Button variant="ghost" onClick={onBack} className="mt-4">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
                </Button>
            </div>
        );
    }

    const client = clients.find(c => c.id === task.clientId);

    const handleStatusChange = (newStatus: Task['status']) => {
        if (newStatus === 'submitted') {
            updateTask(task.id, {
                status: 'submitted',
                owner: 'us-strategy'
            });
            if (assignmentNote.trim()) {
                addComment(task.id, `Assignment Notes for US Strategy: \n${assignmentNote.trim()}`);
                setAssignmentNote('');
                setIsAssigning(false);
            }
        } else if (newStatus === 'resubmit') {
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

    const canEdit = () => {
        if (!currentUser) return false;
        if (currentUser.role === 'admin') return true;
        if (currentUser.role === 'india-head') return task.status !== 'approved' && task.status !== 'submitted';
        if (currentUser.role === 'india-junior') {
            const isAssignedToJunior = task.owner === 'india-junior' || task.assignedTo === currentUser.id;
            return isAssignedToJunior && task.status !== 'approved' && task.status !== 'submitted';
        }
        if (currentUser.role === 'client') return task.owner === 'client' && task.status !== 'approved' && task.status !== 'submitted';
        return false;
    };

    const getStatusColors = (status: Task['status']) => {
        switch (status) {
            case 'pending': return 'bg-[#fef3c7] text-[#b45309] border-[#fde68a]';
            case 'in-progress': return 'bg-[#dbeafe] text-[#1d4ed8] border-[#bfdbfe]';
            case 'completed': return 'bg-[#d1fae5] text-[#047857] border-[#a7f3d0]';
            case 'submitted': return 'bg-[#ede9fe] text-[#6d28d9] border-[#ddd6fe]';
            case 'approved': return 'bg-[#14b8a6] text-white border-[#0d9488]';
            case 'resubmit': return 'bg-[#fee2e2] text-[#b91c1c] border-[#fecaca]';
            default: return 'bg-[#f1f5f9] text-[#475569] border-[#e2e8f0]';
        }
    };

    const canApprove = () => currentUser?.role === 'us-strategy' && task.status === 'submitted';
    const canSendToClient = () => currentUser?.role === 'us-strategy' && task.status === 'approved' && task.owner !== 'client';
    const canComment = () => {
        if (!currentUser) return false;
        if (currentUser.role === 'us-strategy') return true;
        if (currentUser.role === 'india-head') return task.owner === 'india-head' || task.owner === 'india-junior' || task.owner === 'us-strategy' || task.owner === 'system';
        if (currentUser.role === 'india-junior') return task.owner === 'india-junior' || task.assignedTo === currentUser?.id;
        if (currentUser.role === 'client') return task.owner === 'client';
        return false;
    };

    const statusIcon = {
        'pending': <Clock className="w-4 h-4" />,
        'in-progress': <AlertCircle className="w-4 h-4" />,
        'completed': <CheckCircle2 className="w-4 h-4" />,
        'submitted': <Send className="w-4 h-4" />,
        'approved': <CheckCircle2 className="w-4 h-4" />,
        'resubmit': <RotateCcw className="w-4 h-4" />,
    };

    const sortedComments = [...task.comments].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const getTaskProgress = () => {
        const statusProgress: Record<Task['status'], number> = {
            'pending': 0, 'in-progress': 25, 'completed': 50, 'submitted': 75, 'approved': 100, 'resubmit': 30,
        };
        return statusProgress[task.status];
    };

    const [isAttachmentsOpen, setIsAttachmentsOpen] = useState(true);

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            {/* Header Area */}
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center justify-between">
                    <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                        Tasks <ChevronRight className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-[#e0e7ff] text-[#4338ca] border-[#c7d2fe] border font-semibold px-4 py-1.5 rounded-full shadow-sm">
                            {PHASE_LABELS[task.phase]}
                        </Badge>
                        {task.cadence && (
                            <Badge variant="secondary" className="bg-[#ccfbf1] text-[#0f766e] border-[#99f6e4] border font-semibold px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                                <Calendar className="w-3.5 h-3.5" />
                                {task.cadence === 'weekly'
                                    ? getWeeklyInfo(new Date(task.createdAt))
                                    : task.cadence === 'monthly'
                                        ? format(new Date(task.createdAt), 'MMM yyyy')
                                        : task.cadence === 'once' ? 'Once' : task.cadence.charAt(0).toUpperCase() + task.cadence.slice(1)}
                            </Badge>
                        )}
                        <Badge variant="secondary" className="bg-[#f8fafc] text-[#64748b] border-[#e2e8f0] border font-mono text-[10px] px-3 py-1 rounded-full shadow-sm">
                            {task.taskId}
                        </Badge>
                        <Badge className={cn("font-bold px-5 py-1.5 rounded-full shadow-sm border text-xs tracking-wide", getStatusColors(task.status))}>
                            {STATUS_LABELS[task.status].toUpperCase()}
                        </Badge>
                    </div>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-[#0f172a] mt-2">{task.title}</h1>
            </div>

            <div className="space-y-6">
                {/* Description Card */}
                <Card className="border-[#e2e8f0] shadow-sm overflow-hidden bg-white">
                    <div className="px-6 py-4 border-b border-[#f1f5f9] bg-[#f8fafc]/50">
                        <h3 className="text-[11px] font-extrabold text-[#64748b] uppercase tracking-[0.15em]">Description</h3>
                    </div>
                    <CardContent className="p-6">
                        <p className="text-[15px] text-[#334155] leading-relaxed">
                            {task.description || 'Design and implement ' + task.title.toLowerCase() + ' for selection.'}
                        </p>
                    </CardContent>
                </Card>

                {/* Attachments Section */}
                <Collapsible
                    open={isAttachmentsOpen}
                    onOpenChange={setIsAttachmentsOpen}
                    className="border-[#e2e8f0] border rounded-xl shadow-md bg-white overflow-hidden"
                >
                    <div className="flex items-center justify-between px-6 py-4 bg-[#f0f9ff]/40 border-b border-[#e0f2fe]/60">
                        <CollapsibleTrigger className="flex items-center gap-2 group">
                            <div className="w-6 h-6 rounded flex items-center justify-center bg-white border border-[#bae6fd] shadow-sm">
                                {isAttachmentsOpen ? <ChevronDown className="w-3.5 h-3.5 text-[#0369a1]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#0369a1]" />}
                            </div>
                            <span className="font-extrabold text-sm text-[#0c4a6e] tracking-tight">Project Assets & Deliverables</span>
                            <Badge variant="secondary" className="bg-[#e0f2fe] text-[#0369a1] border-[#bae6fd] border h-5 px-2 min-w-[24px] justify-center text-[10px] font-bold">
                                {task.documents.length + (task.attachments?.length || 0) + 5}
                            </Badge>
                        </CollapsibleTrigger>
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#64748b]">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#14b8a6]">
                                <Plus className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                    <CollapsibleContent>
                        <div className="px-6 pb-6 overflow-x-auto">
                            <div className="flex gap-4 min-w-max">
                                {/* Mock Attachment Cards for SEO Project */}
                                {[
                                    { name: 'Technical_Audit_V1.pdf', date: '04 Jan 2026, 10:15 AM' },
                                    { name: 'Keyword_Research_Final.xlsx', date: '04 Jan 2026, 11:30 AM' },
                                    { name: 'Competitor_Analysis.pptx', date: '05 Jan 2026, 09:25 AM' },
                                    { name: 'Backlink_Gap_Report.docx', date: '06 Jan 2026, 02:41 PM' },
                                    { name: 'Monthly_SEO_Plan.pdf', date: '07 Jan 2026, 08:55 AM' }
                                ].map((file, i) => (
                                    <div key={i} className="w-[180px] group cursor-pointer border border-[#e2e8f0] rounded-lg overflow-hidden shrink-0 bg-[#f8fafc]">
                                        <div className="h-24 bg-white flex items-center justify-center border-b border-[#e2e8f0]">
                                            <FileText className="w-8 h-8 text-[#94a3b8]" />
                                        </div>
                                        <div className="p-3">
                                            <p className="text-xs font-medium text-[#1e293b] truncate mb-0.5">{file.name}</p>
                                            <p className="text-[10px] text-[#64748b]">{file.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>

                {/* Comment Input Area */}
                <div className="flex gap-4 items-start pt-4">
                    <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="bg-[#ef4444] text-white text-[10px] font-bold">
                            {currentUser?.name.split(' ').map(n => n[0]).join('') || 'RK'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                        <div className="bg-white border border-[#e2e8f0] rounded-lg p-3 shadow-sm focus-within:border-accent group transition-all">
                            <Textarea
                                placeholder="Add a comment..."
                                className="min-h-[80px] border-none shadow-none resize-none p-0 focus-visible:ring-0 text-sm"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <div className="flex justify-end pt-2">
                                <Button
                                    size="sm"
                                    className="bg-[#14b8a6] hover:bg-[#0d9488] font-bold h-8 px-4"
                                    onClick={handleSubmitComment}
                                    disabled={!newComment.trim()}
                                >
                                    Post Comment
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="space-y-4 pt-8">
                    {/* Primary Workflow Communication */}
                    <div className="flex gap-4 p-4 rounded-xl bg-[#f8fafc]">
                        <Avatar className="h-8 w-8 shrink-0">
                            <AvatarFallback className="bg-[#0369a1] text-white text-[10px] font-bold">SM</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-[#0f172a]">Sarah Mitchell</span>
                                <span className="text-[11px] text-[#64748b]">January 04, 2026 at 10:45 AM</span>
                            </div>
                            <div className="space-y-4">
                                <p className="text-sm text-[#334155] leading-relaxed">
                                    I have reviewed the technical audit findings for the GreenScape project. We need to prioritize fixing the broken canonical tags on the service pages before we start the next link-building cycle.
                                </p>
                                <div className="w-[180px] border border-[#e2e8f0] rounded-lg overflow-hidden bg-white">
                                    <div className="h-24 bg-[#f1f5f9] flex items-center justify-center border-b border-[#e2e8f0]">
                                        <FileText className="w-8 h-8 text-[#94a3b8]" />
                                    </div>
                                    <div className="p-3">
                                        <p className="text-xs font-medium text-[#1e293b] truncate mb-0.5">Technical_Audit_V1.pdf</p>
                                        <p className="text-[10px] text-[#64748b]">04 Jan 2026, 10:15 AM</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 p-4 rounded-xl bg-white border border-[#f1f5f9]">
                        <Avatar className="h-8 w-8 shrink-0">
                            <AvatarFallback className="bg-[#b91c1c] text-white text-[10px] font-bold">RH</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-[#0f172a]">Robert Harrison</span>
                                <span className="text-[11px] text-[#64748b]">January 05, 2026 at 09:30 AM</span>
                            </div>
                            <div className="space-y-4">
                                <p className="text-sm text-[#334155] leading-relaxed">
                                    Understood, Robert. I will coordinate with the development team to ensure the canonical tags are corrected by EOD Wednesday. The full keyword research list is also available for your approval in the attachments.
                                </p>
                                <div className="w-[180px] border border-[#e2e8f0] rounded-lg overflow-hidden bg-[#f8fafc]">
                                    <div className="h-24 bg-white flex items-center justify-center border-b border-[#e2e8f0]">
                                        <FileText className="w-8 h-8 text-[#94a3b8]" />
                                    </div>
                                    <div className="p-3">
                                        <p className="text-xs font-medium text-[#1e293b] truncate mb-0.5">Keyword_Research_Final.xlsx</p>
                                        <p className="text-[10px] text-[#64748b]">05 Jan 2026, 09:25 AM</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Comments List */}
                    {task.comments.length > 0 && (
                        <div className="space-y-4 pt-4 border-t border-[#f1f5f9]">
                            {sortedComments.map((comment, index) => (
                                <div key={comment.id} className={cn(
                                    "flex gap-4 p-4 rounded-xl transition-colors",
                                    index % 2 === 0 ? "bg-[#f8fafc]" : "bg-white border border-[#f1f5f9]"
                                )}>
                                    <Avatar className="h-8 w-8 shrink-0">
                                        <AvatarFallback className="bg-accent text-white text-[10px] font-bold">
                                            {comment.userName.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-[#0f172a]">{comment.userName}</span>
                                            <span className="text-[11px] text-[#64748b]">
                                                {format(new Date(comment.createdAt), 'MMMM d, yyyy') + ' at ' + format(new Date(comment.createdAt), 'h:mm a')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[#334155] leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="fixed bottom-0 right-0 left-0 bg-white border-t border-[#e2e8f0] p-4 flex flex-col gap-4 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                {isAssigning && (
                    <div className="max-w-6xl mx-auto w-full pb-2 animate-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-xl p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xs font-bold text-[#0369a1] uppercase tracking-wider flex items-center gap-2">
                                    <Send className="w-3.5 h-3.5" /> Review Instructions for US Strategy Team
                                </h4>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-[#0369a1]" onClick={() => setIsAssigning(false)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            <Textarea
                                placeholder="Explain what needs to be reviewed or provide specific instructions..."
                                className="min-h-[80px] bg-white border-[#bae6fd] text-sm focus-visible:ring-accent/20"
                                value={assignmentNote}
                                onChange={(e) => setAssignmentNote(e.target.value)}
                            />
                            <div className="flex justify-end mt-3 gap-2">
                                <Button variant="outline" size="sm" onClick={() => setIsAssigning(false)}>Cancel</Button>
                                <Button size="sm" className="bg-[#14b8a6] hover:bg-[#0d9488]" disabled={!assignmentNote.trim()} onClick={() => handleStatusChange('submitted')}>
                                    Assign & Send for Review
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="max-w-6xl mx-auto w-full flex justify-between items-center">
                    <div className="flex gap-3">
                        {canEdit() && (currentUser?.role === 'india-head' || currentUser?.role === 'india-junior') && !isAssigning && (
                            <Button className="bg-[#14b8a6] hover:bg-[#0d9488] shadow-sm font-semibold" onClick={() => setIsAssigning(true)}>
                                <Send className="w-4 h-4 mr-2" /> Assign to US Strategy
                            </Button>
                        )}
                        {canEdit() && task.status === 'pending' && (
                            <Button className="bg-[#14b8a6] hover:bg-[#0d9488]" onClick={() => handleStatusChange('in-progress')}>
                                Start Progress
                            </Button>
                        )}
                        {canEdit() && task.status === 'in-progress' && (
                            <Button className="bg-[#14b8a6] hover:bg-[#0d9488]" onClick={() => handleStatusChange('completed')}>
                                Mark as Done
                            </Button>
                        )}
                        {canApprove() && (
                            <>
                                <Button variant="success" onClick={() => handleStatusChange('approved')}>
                                    <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                                </Button>
                                <Button variant="destructive" onClick={() => handleStatusChange('resubmit')}>
                                    <RotateCcw className="w-4 h-4 mr-2" /> Request Changes
                                </Button>
                            </>
                        )}
                        {canSendToClient() && (
                            <Button className="bg-[#14b8a6] hover:bg-[#0d9488]" onClick={() => {
                                updateTask(task.id, { status: 'pending', owner: 'client', approver: 'client' });
                            }}>
                                <Send className="w-4 h-4 mr-2" /> Handoff to Client
                            </Button>
                        )}
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#64748b]">PHASE PROGRESS</span>
                            <div className="w-32">
                                <Progress value={getTaskProgress()} className="h-2 bg-[#f1f5f9]" />
                            </div>
                            <span className="text-xs font-black text-[#0f172a] tabular-nums">{getTaskProgress()}%</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-20" /> {/* Spacer for sticky footer */}
        </div>
    );
}
