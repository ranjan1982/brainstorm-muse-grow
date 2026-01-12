import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  ArrowRight,
  Settings2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WorkPhase } from '@/types/admin';

interface WorkPhaseManagementProps {
  phases: WorkPhase[];
  onAddPhase: (phase: Omit<WorkPhase, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdatePhase: (phaseId: string, updates: Partial<WorkPhase>) => void;
  onDeletePhase: (phaseId: string) => void;
}

export function WorkPhaseManagement({
  phases,
  onAddPhase,
  onUpdatePhase,
  onDeletePhase
}: WorkPhaseManagementProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPhase, setEditingPhase] = useState<WorkPhase | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    order: phases.length + 1,
    isActive: true,
    dependsOnPhase: '',
    autoTriggerOnComplete: false
  });

  const sortedPhases = [...phases].sort((a, b) => a.order - b.order);

  const handleOpenDialog = (phase?: WorkPhase) => {
    if (phase) {
      setEditingPhase(phase);
      setFormData({
        name: phase.name,
        description: phase.description,
        order: phase.order,
        isActive: phase.isActive,
        dependsOnPhase: phase.dependsOnPhase || '',
        autoTriggerOnComplete: phase.autoTriggerOnComplete
      });
    } else {
      setEditingPhase(null);
      setFormData({
        name: '',
        description: '',
        order: phases.length + 1,
        isActive: true,
        dependsOnPhase: '',
        autoTriggerOnComplete: false
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingPhase) {
      onUpdatePhase(editingPhase.id, {
        ...formData,
        dependsOnPhase: formData.dependsOnPhase || undefined
      });
    } else {
      onAddPhase({
        ...formData,
        dependsOnPhase: formData.dependsOnPhase || undefined
      });
    }
    setIsDialogOpen(false);
    setEditingPhase(null);
  };

  const getPhaseName = (phaseId: string) => {
    return phases.find(p => p.id === phaseId)?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Work Phases</h2>
          <p className="text-muted-foreground">Configure workflow phases and dependencies</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Phase
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configured Phases ({sortedPhases.length})</CardTitle>
          <CardDescription>
            Phases define the workflow stages. Tasks are auto-created when dependencies complete.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedPhases.map((phase, index) => (
              <div key={phase.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GripVertical className="w-4 h-4 cursor-grab" />
                  <span className="text-sm font-mono w-6">{phase.order}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{phase.name}</p>
                    <Badge variant={phase.isActive ? 'default' : 'secondary'}>
                      {phase.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    {phase.autoTriggerOnComplete && (
                      <Badge variant="outline" className="text-xs">
                        Auto-trigger
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{phase.description}</p>
                  
                  {phase.dependsOnPhase && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <span>Depends on:</span>
                      <ArrowRight className="w-3 h-3" />
                      <span className="font-medium">{getPhaseName(phase.dependsOnPhase)}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(phase)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onDeletePhase(phase.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {sortedPhases.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No phases configured. Add your first workflow phase.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Phase Dependency Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="w-5 h-5" />
            Phase Dependency Flow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 flex-wrap">
            {sortedPhases.map((phase, index) => (
              <div key={phase.id} className="flex items-center gap-2">
                <div className={`px-3 py-2 rounded-lg border ${phase.isActive ? 'bg-primary/10 border-primary' : 'bg-muted'}`}>
                  <span className="text-sm font-medium">{phase.name}</span>
                </div>
                {index < sortedPhases.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingPhase ? 'Edit Phase' : 'Add New Phase'}</DialogTitle>
            <DialogDescription>
              Configure the workflow phase settings
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Phase Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Onboarding & Intake"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the purpose of this phase..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Order</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Depends On</Label>
                <Select
                  value={formData.dependsOnPhase}
                  onValueChange={(value) => setFormData({ ...formData, dependsOnPhase: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {phases.filter(p => p.id !== editingPhase?.id).map(phase => (
                      <SelectItem key={phase.id} value={phase.id}>
                        {phase.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Active</Label>
                <p className="text-xs text-muted-foreground">Enable this phase in workflows</p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-trigger Tasks</Label>
                <p className="text-xs text-muted-foreground">Create tasks when dependency completes</p>
              </div>
              <Switch
                checked={formData.autoTriggerOnComplete}
                onCheckedChange={(checked) => setFormData({ ...formData, autoTriggerOnComplete: checked })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingPhase ? 'Update' : 'Create'} Phase</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
