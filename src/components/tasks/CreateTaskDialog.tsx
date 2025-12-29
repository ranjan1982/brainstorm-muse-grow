import { useState, useRef } from 'react';
import { Phase, PHASE_LABELS, UserRole, ROLE_LABELS, Attachment } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useApp } from '@/context/AppContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Loader2, Paperclip, X, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTaskDialog({ open, onOpenChange }: CreateTaskDialogProps) {
  const { currentUser, addTask } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    phase: 'onboarding' as Phase,
    assignTo: 'india-head' as UserRole,
    approver: 'us-strategy' as UserRole,
    cadence: '' as '' | 'once' | 'monthly' | 'weekly' | 'ongoing',
  });

  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const canCreateTask = () => {
    if (!currentUser) return false;
    return currentUser.role === 'us-strategy' || currentUser.role === 'india-head' || currentUser.role === 'admin';
  };

  const getAvailablePhases = (): Phase[] => {
    return ['onboarding', 'foundation', 'execution', 'reporting'];
  };

  const getAssignableUsers = (): UserRole[] => {
    if (currentUser?.role === 'us-strategy' || currentUser?.role === 'admin') {
      return ['us-strategy', 'india-head', 'india-junior', 'client'];
    }
    if (currentUser?.role === 'india-head') {
      return ['india-head', 'india-junior'];
    }
    return [];
  };

  const getApprovers = (): UserRole[] => {
    return ['us-strategy', 'client'];
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: Attachment[] = Array.from(files).map(file => ({
      id: `attachment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file), // In real app, this would be uploaded to storage
      uploadedAt: new Date(),
    }));

    setAttachments(prev => [...prev, ...newAttachments]);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (attachmentId: string) => {
    setAttachments(prev => prev.filter(a => a.id !== attachmentId));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addTask({
      title: formData.title.trim(),
      description: formData.description.trim(),
      phase: formData.phase,
      owner: formData.assignTo,
      approver: formData.approver,
      cadence: formData.cadence || undefined,
      attachments: attachments,
    });

    toast.success('Task created successfully');
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      phase: 'onboarding',
      assignTo: 'india-head',
      approver: 'us-strategy',
      cadence: '',
    });
    setAttachments([]);
    
    setIsSubmitting(false);
    onOpenChange(false);
  };

  if (!canCreateTask()) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-accent" />
            Create New Task
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              placeholder="Enter task title..."
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Task Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the task in detail..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Phase (Work Phase) */}
          <div className="space-y-2">
            <Label>Add to Work Phase</Label>
            <Select 
              value={formData.phase} 
              onValueChange={(v) => setFormData(prev => ({ ...prev, phase: v as Phase }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getAvailablePhases().map((phase) => (
                  <SelectItem key={phase} value={phase}>
                    {PHASE_LABELS[phase].split('&')[0].trim()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assign To */}
          <div className="space-y-2">
            <Label>Assign Task To</Label>
            <Select 
              value={formData.assignTo} 
              onValueChange={(v) => setFormData(prev => ({ ...prev, assignTo: v as UserRole }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getAssignableUsers().map((role) => (
                  <SelectItem key={role} value={role}>
                    {ROLE_LABELS[role]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Approver */}
          <div className="space-y-2">
            <Label>Task Approver</Label>
            <Select 
              value={formData.approver} 
              onValueChange={(v) => setFormData(prev => ({ ...prev, approver: v as UserRole }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getApprovers().map((role) => (
                  <SelectItem key={role} value={role}>
                    {ROLE_LABELS[role]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Who will approve this task when completed
            </p>
          </div>

          {/* Cadence */}
          <div className="space-y-2">
            <Label>Task Cadence (Optional)</Label>
            <Select 
              value={formData.cadence} 
              onValueChange={(v) => setFormData(prev => ({ ...prev, cadence: v as any }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cadence..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None (One-time)</SelectItem>
                <SelectItem value="once">Once</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className="space-y-3">
              {/* Attachment List */}
              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((attachment) => (
                    <div 
                      key={attachment.id}
                      className="flex items-center justify-between p-2 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{attachment.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(attachment.size)}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => removeAttachment(attachment.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Upload Button */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.png,.jpg,.jpeg,.gif"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="w-4 h-4 mr-2" />
                  Add Attachments
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  Supported: PDF, DOC, XLS, PPT, Images (max 10MB each)
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            variant="accent" 
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.title.trim()}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
