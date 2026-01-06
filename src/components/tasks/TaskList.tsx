import { Task, Phase, PHASE_LABELS, ROLE_LABELS } from '@/types';
import { TaskCard } from './TaskCard';
import { TaskDetailModal } from './TaskDetailModal';
import { CreateTaskDialog } from './CreateTaskDialog';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TaskListProps {
  phase?: Phase;
}

export function TaskList({ phase }: TaskListProps) {
  const { currentUser, currentClient, getClientTasksForTier } = useApp();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  const canCreateTask = () => {
    if (!currentUser) return false;
    return currentUser.role === 'us-strategy' || currentUser.role === 'india-head' || currentUser.role === 'admin';
  };

  const handleViewDetails = (task: Task) => {
    setSelectedTask(task);
    setDetailModalOpen(true);
  };

  // Get client ID
  const clientId = currentUser?.role === 'client' ? currentUser.id : currentClient?.id;

  // Get tasks for the phase
  const getFilteredTasks = (): Task[] => {
    const tierTasks = getClientTasksForTier(clientId);
    let filtered = phase ? tierTasks.filter(t => t.phase === phase) : tierTasks;
    
    // For clients, only show tasks owned by client
    if (currentUser?.role === 'client') {
      filtered = filtered.filter(t => t.owner === 'client');
    }
    
    // Sort: Assigned to current user first, then by status
    filtered.sort((a, b) => {
      const aAssigned = a.owner === currentUser?.role ? 0 : 1;
      const bAssigned = b.owner === currentUser?.role ? 0 : 1;
      
      if (aAssigned !== bAssigned) return aAssigned - bAssigned;
      
      // Then by status priority
      const statusOrder: Record<string, number> = {
        'pending': 0,
        'resubmit': 1,
        'in-progress': 2,
        'submitted': 3,
        'completed': 4,
        'approved': 5
      };
      return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
    });
    
    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">
            {phase ? PHASE_LABELS[phase] : 'All Tasks'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} 
            {currentUser?.role && ` • Showing tasks for ${ROLE_LABELS[currentUser.role]}`}
          </p>
        </div>
        {canCreateTask() && (
          <Button 
            variant="default" 
            onClick={() => setCreateDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">
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
          filteredTasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onViewDetails={handleViewDetails}
              showBucket
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
