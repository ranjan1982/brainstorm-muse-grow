import { Task, Phase, PHASE_LABELS, SUBSCRIPTION_TIER_LABELS } from '@/types';
import { TaskCard } from './TaskCard';
import { TaskDetailModal } from './TaskDetailModal';
import { CreateTaskDialog } from './CreateTaskDialog';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Crown, Star, Zap } from 'lucide-react';

interface TaskListProps {
  phase?: Phase;
  showAllPhases?: boolean;
}

export function TaskList({ phase, showAllPhases = false }: TaskListProps) {
  const { currentUser, currentClient, getClientTasksForTier, getClientSubscription, getTaskTemplatesForTier } = useApp();
  const [selectedPhase, setSelectedPhase] = useState<Phase>(phase || 'onboarding');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  const phases: Phase[] = ['onboarding', 'foundation', 'execution', 'ai', 'reporting', 'monitoring'];
  
  // Get current client's subscription tier
  const clientId = currentUser?.role === 'client' ? currentUser.id : currentClient?.id;
  const subscription = clientId ? getClientSubscription(clientId) : undefined;
  const currentTier = subscription?.tier || 'starter';
  
  // Get available templates for this tier to determine which phases are unlocked
  const availableTemplates = getTaskTemplatesForTier(currentTier);
  const unlockedPhases = new Set(availableTemplates.map(t => t.phase));
  
  // Get tier icon
  const getTierIcon = () => {
    switch (currentTier) {
      case 'enterprise': return <Crown className="w-4 h-4" />;
      case 'growth': return <Zap className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };
  
  const canCreateTask = () => {
    if (!currentUser) return false;
    return currentUser.role === 'us-strategy' || currentUser.role === 'india-head' || currentUser.role === 'admin';
  };

  const handleViewDetails = (task: Task) => {
    setSelectedTask(task);
    setDetailModalOpen(true);
  };

  const getFilteredTasks = (p: Phase) => {
    // Get tasks filtered by client and their subscription tier
    const tierTasks = getClientTasksForTier(clientId);
    let filtered = tierTasks.filter(t => t.phase === p);
    
    // Filter by role visibility
    if (currentUser) {
      switch (currentUser.role) {
        case 'client':
          // Client sees all tasks but can only act on their own
          break;
        case 'india-junior':
          // Junior sees tasks assigned to them or India team tasks
          filtered = filtered.filter(t => 
            t.assignedTo === currentUser.id || 
            t.owner === 'india-head' || 
            t.owner === 'india-junior'
          );
          break;
        case 'india-head':
          // Head sees all India team tasks
          filtered = filtered.filter(t => 
            t.owner === 'india-head' || 
            t.owner === 'india-junior' ||
            t.status === 'approved'
          );
          break;
        case 'us-strategy':
          // US Strategy sees submitted tasks + their own
          break;
        case 'admin':
          // Admin sees everything
          break;
      }
    }
    
    return filtered;
  };
  
  const getPhaseTaskCounts = (p: Phase) => {
    const phaseTasks = getFilteredTasks(p);
    const pending = phaseTasks.filter(t => t.status === 'pending' || t.status === 'resubmit').length;
    const inProgress = phaseTasks.filter(t => t.status === 'in-progress' || t.status === 'submitted').length;
    const approved = phaseTasks.filter(t => t.status === 'approved').length;
    return { total: phaseTasks.length, pending, inProgress, approved };
  };
  
  // Get template count for each phase based on tier
  const getPhaseTemplateCount = (p: Phase) => {
    return availableTemplates.filter(t => t.phase === p).length;
  };

  if (showAllPhases) {
    return (
      <>
        {/* Tier indicator */}
        <div className="flex items-center gap-2 mb-4 p-3 bg-secondary/30 rounded-lg">
          <div className="flex items-center gap-2 text-sm font-medium">
            {getTierIcon()}
            <span className="text-muted-foreground">Subscription:</span>
            <Badge variant={currentTier === 'enterprise' ? 'default' : currentTier === 'growth' ? 'secondary' : 'outline'}>
              {SUBSCRIPTION_TIER_LABELS[currentTier]}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground ml-2">
            ({availableTemplates.length} task templates available)
          </span>
        </div>
        
        <Tabs value={selectedPhase} onValueChange={(v) => setSelectedPhase(v as Phase)} className="w-full">
          <div className="flex items-center justify-between mb-6 gap-4">
            <TabsList className="flex-1 justify-start overflow-x-auto flex-nowrap bg-secondary/50 p-1 rounded-xl">
              {phases.map((p) => {
                const counts = getPhaseTaskCounts(p);
                const templateCount = getPhaseTemplateCount(p);
                const isLocked = !unlockedPhases.has(p);
                return (
                  <TabsTrigger 
                    key={p} 
                    value={p}
                    disabled={isLocked}
                    className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg flex items-center gap-2 whitespace-nowrap"
                  >
                    {PHASE_LABELS[p].split('&')[0].trim()}
                    {!isLocked && (
                      <Badge variant="secondary" className="ml-1 text-[10px] px-1.5">
                        {counts.total > 0 ? `${counts.approved}/${counts.total}` : `0/${templateCount}`}
                      </Badge>
                    )}
                    {isLocked && (
                      <Badge variant="outline" className="ml-1 text-[10px] px-1.5 opacity-50">
                        🔒
                      </Badge>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            
            {canCreateTask() && (
              <Button 
                variant="accent" 
                onClick={() => setCreateDialogOpen(true)}
                className="shrink-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            )}
          </div>
          
          {phases.map((p) => (
            <TabsContent key={p} value={p} className="mt-0">
              <div className="grid gap-4">
                {getFilteredTasks(p).length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="text-lg font-medium mb-2">No tasks in this phase</p>
                    <p className="text-sm">Tasks will appear here as they are created.</p>
                    {canCreateTask() && (
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setCreateDialogOpen(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Task
                      </Button>
                    )}
                  </div>
                ) : (
                  getFilteredTasks(p).map((task) => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      onViewDetails={handleViewDetails}
                    />
                  ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <TaskDetailModal
          task={selectedTask}
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
        />

        <CreateTaskDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        />
      </>
    );
  }

  const allTierTasks = getClientTasksForTier(clientId);
  const filteredTasks = phase ? getFilteredTasks(phase) : allTierTasks;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Tasks</h3>
        {canCreateTask() && (
          <Button 
            variant="accent" 
            size="sm"
            onClick={() => setCreateDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        )}
      </div>
      <div className="grid gap-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg font-medium mb-2">No tasks found</p>
            <p className="text-sm">Tasks will appear here as they are created.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onViewDetails={handleViewDetails}
            />
          ))
        )}
      </div>

      <TaskDetailModal
        task={selectedTask}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
      />

      <CreateTaskDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  );
}
