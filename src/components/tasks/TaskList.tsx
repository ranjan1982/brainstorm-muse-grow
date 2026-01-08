import { Task, Phase, PHASE_LABELS, ROLE_LABELS, STATUS_LABELS } from '@/types';
import { TaskDetailModal } from './TaskDetailModal';
import { CreateTaskDialog } from './CreateTaskDialog';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Building2, Filter } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TaskListProps {
  phase?: Phase;
}

interface TaskWithClient extends Task {
  clientId: string;
}

export function TaskList({ phase }: TaskListProps) {
  const { currentUser, tasks, clients } = useApp();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const canCreateTask = () => {
    if (!currentUser) return false;
    return currentUser.role === 'us-strategy' || currentUser.role === 'india-head' || currentUser.role === 'admin';
  };

  const handleViewDetails = (task: Task) => {
    setSelectedTask(task);
    setDetailModalOpen(true);
  };

  // Get client name by clientId
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.company || 'Unknown Client';
  };

  // Get all tasks (not filtered by client)
  const getFilteredTasks = (): TaskWithClient[] => {
    let filtered = tasks as TaskWithClient[];

    // Filter by phase if specified
    if (phase) {
      filtered = filtered.filter(t => t.phase === phase);
    }

    // Filter by selected client (if not 'all')
    if (selectedClientId !== 'all') {
      filtered = filtered.filter(t => t.clientId === selectedClientId);
    }

    // Filter by selected status (if not 'all')
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(t => t.status === selectedStatus);
    }

    // For clients, only show their own tasks
    if (currentUser?.role === 'client') {
      filtered = filtered.filter(t => t.clientId === currentUser.id && t.owner === 'client');
    }

    // Sort: Submitted tasks first, then assigned to current user, then other statuses
    filtered.sort((a, b) => {
      // Priority 1: Submitted for Review tasks at the very top
      if (a.status === 'submitted' && b.status !== 'submitted') return -1;
      if (a.status !== 'submitted' && b.status === 'submitted') return 1;

      // Priority 2: Assigned to current user
      const aAssigned = a.owner === currentUser?.role ? 0 : 1;
      const bAssigned = b.owner === currentUser?.role ? 0 : 1;
      if (aAssigned !== bAssigned) return aAssigned - bAssigned;

      // Priority 3: Other status orders
      const statusOrder: Record<string, number> = {
        'resubmit': 0,
        'pending': 1,
        'in-progress': 2,
        'completed': 3,
        'approved': 4,
        'submitted': -1 // Not strictly needed because of the explicit check above but good for completeness
      };
      return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
    });

    return filtered;
  };

  const filteredTasks = getFilteredTasks();
  const activeClients = clients.filter(c => c.isActive);

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'in-progress':
        return 'secondary';
      case 'pending':
      case 'resubmit':
        return 'destructive';
      case 'submitted':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">
            {phase ? PHASE_LABELS[phase] : 'All Tasks'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Client Filter - Only show for non-client users */}
          {currentUser?.role !== 'client' && (
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger className="w-[250px]">
                <Building2 className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {activeClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
      </div>

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
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Task ID</TableHead>
                <TableHead>Task Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Month/Cadence</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-mono text-xs">{task.taskId}</TableCell>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(task.status)}>
                      {STATUS_LABELS[task.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {ROLE_LABELS[task.owner as keyof typeof ROLE_LABELS] || task.owner}
                    </Badge>
                  </TableCell>
                  <TableCell>{getClientName(task.clientId)}</TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {task.cadence === 'monthly'
                        ? new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(task.createdAt))
                        : task.cadence?.charAt(0).toUpperCase() + task.cadence?.slice(1) || 'Once'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(task)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

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
