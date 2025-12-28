import { useState } from 'react';
import { Phase, PHASE_LABELS, UserRole, ROLE_LABELS } from '@/types';
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
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTaskDialog({ open, onOpenChange }: CreateTaskDialogProps) {
  const { currentUser, addTask } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    phase: 'onboarding' as Phase,
    owner: 'india-head' as UserRole | 'system',
    cadence: '' as '' | 'once' | 'monthly' | 'weekly' | 'ongoing',
  });

  const canCreateTask = () => {
    if (!currentUser) return false;
    return currentUser.role === 'us-strategy' || currentUser.role === 'india-head' || currentUser.role === 'admin';
  };

  const getAvailablePhases = (): Phase[] => {
    // Starter plan phases
    return ['onboarding', 'foundation', 'execution', 'reporting'];
  };

  const getAvailableOwners = (): (UserRole | 'system')[] => {
    if (currentUser?.role === 'us-strategy' || currentUser?.role === 'admin') {
      return ['us-strategy', 'india-head', 'india-junior', 'client'];
    }
    if (currentUser?.role === 'india-head') {
      return ['india-head', 'india-junior'];
    }
    return [];
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
      owner: formData.owner,
      cadence: formData.cadence || undefined,
    });

    toast.success('Task created successfully');
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      phase: 'onboarding',
      owner: 'india-head',
      cadence: '',
    });
    
    setIsSubmitting(false);
    onOpenChange(false);
  };

  if (!canCreateTask()) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the task..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Phase & Owner Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Phase</Label>
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

            <div className="space-y-2">
              <Label>Task Owner</Label>
              <Select 
                value={formData.owner} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, owner: v as UserRole }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableOwners().map((owner) => (
                    <SelectItem key={owner} value={owner}>
                      {owner === 'system' ? 'System' : ROLE_LABELS[owner as UserRole]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Cadence */}
          <div className="space-y-2">
            <Label>Cadence (Optional)</Label>
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
