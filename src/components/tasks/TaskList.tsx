import { Task, Phase, PHASE_LABELS, UserRole } from '@/types';
import { TaskCard } from './TaskCard';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface TaskListProps {
  phase?: Phase;
  showAllPhases?: boolean;
}

export function TaskList({ phase, showAllPhases = false }: TaskListProps) {
  const { tasks, currentUser } = useApp();
  const [selectedPhase, setSelectedPhase] = useState<Phase>(phase || 'onboarding');
  
  const phases: Phase[] = ['onboarding', 'foundation', 'execution', 'ai', 'reporting', 'monitoring'];
  const starterUnlocked: Phase[] = ['onboarding', 'foundation', 'execution', 'reporting'];
  
  const getFilteredTasks = (p: Phase) => {
    let filtered = tasks.filter(t => t.phase === p);
    
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

  if (showAllPhases) {
    return (
      <Tabs value={selectedPhase} onValueChange={(v) => setSelectedPhase(v as Phase)} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto flex-nowrap bg-secondary/50 p-1 rounded-xl mb-6">
          {phases.map((p) => {
            const counts = getPhaseTaskCounts(p);
            const isLocked = !starterUnlocked.includes(p);
            return (
              <TabsTrigger 
                key={p} 
                value={p}
                disabled={isLocked}
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg flex items-center gap-2 whitespace-nowrap"
              >
                {PHASE_LABELS[p].split('&')[0].trim()}
                {!isLocked && counts.total > 0 && (
                  <Badge variant="secondary" className="ml-1 text-[10px] px-1.5">
                    {counts.approved}/{counts.total}
                  </Badge>
                )}
                {isLocked && (
                  <Badge variant="outline" className="ml-1 text-[10px] px-1.5">
                    🔒
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
        
        {phases.map((p) => (
          <TabsContent key={p} value={p} className="mt-0">
            <div className="grid gap-4">
              {getFilteredTasks(p).length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-lg font-medium mb-2">No tasks in this phase</p>
                  <p className="text-sm">Tasks will appear here as they are created.</p>
                </div>
              ) : (
                getFilteredTasks(p).map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    );
  }

  const filteredTasks = phase ? getFilteredTasks(phase) : tasks;

  return (
    <div className="grid gap-4">
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg font-medium mb-2">No tasks found</p>
          <p className="text-sm">Tasks will appear here as they are created.</p>
        </div>
      ) : (
        filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))
      )}
    </div>
  );
}
