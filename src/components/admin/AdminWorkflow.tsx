
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';
import { TaskTemplate, PhaseConfig, PHASE_LABELS, SubscriptionTier } from '@/types';
import { toast } from 'sonner';
import { Plus, Trash2, Edit2, GripVertical, Check } from 'lucide-react';

export function AdminWorkflow() {
    const { taskTemplates, addTaskTemplate, updateTaskTemplate, deleteTaskTemplate, phaseConfigs, updatePhaseConfig } = useApp();

    // Task Template State
    const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
    const [taskState, setTaskState] = useState<Partial<TaskTemplate>>({
        phase: 'execution',
        isActive: true,
        cadence: 'monthly',
        tiers: ['starter', 'growth', 'enterprise']
    });
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

    // Phase Config State - minimal implementation for enabling/disabling

    const handleSaveTask = () => {
        if (!taskState.title || !taskState.taskId) {
            toast.error('Title and ID are required');
            return;
        }

        if (editingTaskId) {
            updateTaskTemplate(editingTaskId, taskState);
            toast.success('Task template updated');
        } else {
            // Auto generate ID if missing? Just enforce manual for now or auto
            addTaskTemplate(taskState as any);
            toast.success('New task template created');
        }
        setIsTaskDialogOpen(false);
        setEditingTaskId(null);
        setTaskState({ phase: 'execution', isActive: true, cadence: 'monthly', tiers: ['starter', 'growth', 'enterprise'] });
    };

    const openEditTask = (task: TaskTemplate) => {
        setTaskState(task);
        setEditingTaskId(task.id);
        setIsTaskDialogOpen(true);
    };

    const togglePhaseActive = (id: string, current: boolean) => {
        updatePhaseConfig(id, { isActive: !current });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Workflow Configuration</h2>
                    <p className="text-muted-foreground">Manage phases and automated tasks</p>
                </div>
            </div>

            <Tabs defaultValue="tasks" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="phases">Workflow Phases</TabsTrigger>
                    <TabsTrigger value="tasks">Task Templates</TabsTrigger>
                </TabsList>

                <TabsContent value="phases" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Phases</CardTitle>
                            <CardDescription>Enable or disable workflow phases</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]"></TableHead>
                                        <TableHead>Phase Name</TableHead>
                                        <TableHead>Slug</TableHead>
                                        <TableHead>Order</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {phaseConfigs.sort((a, b) => a.order - b.order).map((phase) => (
                                        <TableRow key={phase.id}>
                                            <TableCell><GripVertical className="w-4 h-4 text-muted-foreground" /></TableCell>
                                            <TableCell className="font-medium">{phase.name}</TableCell>
                                            <TableCell className="font-mono text-xs">{phase.slug}</TableCell>
                                            <TableCell>{phase.order}</TableCell>
                                            <TableCell>
                                                <Switch
                                                    checked={phase.isActive}
                                                    onCheckedChange={() => togglePhaseActive(phase.id, phase.isActive)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="tasks" className="space-y-4">
                    <div className="flex justify-end">
                        <Button onClick={() => { setIsTaskDialogOpen(true); setEditingTaskId(null); setTaskState({ phase: 'execution', isActive: true, cadence: 'monthly', tiers: ['starter', 'growth', 'enterprise'] }); }}>
                            <Plus className="w-4 h-4 mr-2" /> Add Task Template
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Task Title</TableHead>
                                        <TableHead>Phase</TableHead>
                                        <TableHead>Cadence</TableHead>
                                        <TableHead>Tiers</TableHead>
                                        <TableHead className="w-[100px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {taskTemplates.map((task) => (
                                        <TableRow key={task.id}>
                                            <TableCell className="font-mono text-xs font-medium">{task.taskId}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span>{task.title}</span>
                                                    {task.description && <span className="text-xs text-muted-foreground truncate max-w-[300px]">{task.description}</span>}
                                                </div>
                                            </TableCell>
                                            <TableCell><Badge variant="outline">{PHASE_LABELS[task.phase]}</Badge></TableCell>
                                            <TableCell className="capitalize">{task.cadence}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-1">
                                                    {task.tiers.map(t => (
                                                        <span key={t} className="w-2 h-2 rounded-full bg-primary" title={t} />
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEditTask(task)}><Edit2 className="w-4 h-4" /></Button>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => { if (confirm('Delete this template?')) deleteTaskTemplate(task.id); }}><Trash2 className="w-4 h-4" /></Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingTaskId ? 'Edit Task Template' : 'New Task Template'}</DialogTitle>
                        <DialogDescription>Define standard tasks for workflow automation</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Task Code (ID)</Label>
                                <Input value={taskState.taskId || ''} onChange={e => setTaskState({ ...taskState, taskId: e.target.value.toUpperCase() })} placeholder="e.g. ST-EXE-005" />
                            </div>
                            <div className="space-y-2">
                                <Label>Workflow Phase</Label>
                                <Select value={taskState.phase} onValueChange={(v: any) => setTaskState({ ...taskState, phase: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {phaseConfigs.map(p => (
                                            <SelectItem key={p.slug} value={p.slug}>{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Task Title</Label>
                            <Input value={taskState.title || ''} onChange={e => setTaskState({ ...taskState, title: e.target.value })} />
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <textarea
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={taskState.description || ''}
                                onChange={e => setTaskState({ ...taskState, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Cadence</Label>
                                <Select value={taskState.cadence} onValueChange={(v: any) => setTaskState({ ...taskState, cadence: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="once">Once</SelectItem>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                        <SelectItem value="ongoing">Ongoing</SelectItem>
                                        <SelectItem value="quarterly">Quarterly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Assigned Role</Label>
                                <Select value={taskState.owner || 'us-strategy'} onValueChange={(v: any) => setTaskState({ ...taskState, owner: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="us-strategy">US Strategy</SelectItem>
                                        <SelectItem value="seo-head">India Head</SelectItem>
                                        <SelectItem value="seo-junior">India Junior</SelectItem>
                                        <SelectItem value="system">System (Auto)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2 border-t">
                            <Label>Applicable Subscription Tiers</Label>
                            <div className="flex gap-4">
                                {(['starter', 'growth', 'enterprise'] as SubscriptionTier[]).map(tier => (
                                    <div key={tier} className="flex items-center space-x-2">
                                        <Switch
                                            checked={taskState.tiers?.includes(tier)}
                                            onCheckedChange={(checked) => {
                                                const currentOptions = taskState.tiers || [];
                                                if (checked) {
                                                    setTaskState({ ...taskState, tiers: [...currentOptions, tier] });
                                                } else {
                                                    setTaskState({ ...taskState, tiers: currentOptions.filter(t => t !== tier) });
                                                }
                                            }}
                                        />
                                        <Label className="capitalize">{tier}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <Switch checked={taskState.isActive} onCheckedChange={c => setTaskState({ ...taskState, isActive: c })} />
                            <Label>Active Template</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSaveTask}>Save Template</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
