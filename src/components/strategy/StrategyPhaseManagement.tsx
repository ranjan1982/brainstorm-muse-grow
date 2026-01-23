import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PHASE_LABELS, Phase } from '@/types';
import { ChevronRight, CheckCircle2, AlertCircle, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StrategyPhaseManagement() {
    const { clients, tasks, proceedToNextPhase } = useApp();

    const getPhaseStatus = (clientId: string, phase: Phase) => {
        const clientTasks = tasks.filter(t => t.clientId === clientId && t.phase === phase);
        if (clientTasks.length === 0) return 'not-started';

        const allCompleted = clientTasks.every(t => t.status === 'approved');
        return allCompleted ? 'completed' : 'in-progress';
    };

    const getPendingTasksCount = (clientId: string, phase: Phase) => {
        return tasks.filter(t => t.clientId === clientId && t.phase === phase && t.status !== 'approved').length;
    };

    const allPhases: Phase[] = ['onboarding', 'foundation', 'execution', 'ai', 'reporting', 'monitoring'];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Phase Management</h2>
                <p className="text-muted-foreground">Manage client progress through workflow phases</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Client Phase Progress</CardTitle>
                    <CardDescription>
                        Review and advance clients to their next workflow phase once current tasks are completed.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Client / Company</TableHead>
                                <TableHead>Current Phase</TableHead>
                                <TableHead>Progress Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clients.filter(c => c.isActive).map(client => {
                                const currentPhase = client.currentPhase || 'onboarding';
                                const status = getPhaseStatus(client.id, currentPhase);
                                const pendingCount = getPendingTasksCount(client.id, currentPhase);
                                const isCompleted = status === 'completed';
                                const currentPhaseIndex = allPhases.indexOf(currentPhase);
                                const hasNextPhase = currentPhaseIndex < allPhases.length - 1;

                                return (
                                    <TableRow key={client.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-[#0f172a]">{client.company}</span>
                                                <span className="text-xs text-muted-foreground">{client.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 font-semibold px-3 py-1 text-[11px] uppercase tracking-wider">
                                                {PHASE_LABELS[currentPhase]}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {isCompleted ? (
                                                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    All Tasks Completed
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {pendingCount} Tasks Pending
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                size="sm"
                                                className={cn(
                                                    "gap-2 font-black text-[10px] uppercase tracking-widest h-9 px-4",
                                                    isCompleted && hasNextPhase
                                                        ? "bg-[#14b8a6] hover:bg-[#0d9488] text-white shadow-md shadow-emerald-200"
                                                        : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                                                )}
                                                disabled={!isCompleted || !hasNextPhase}
                                                onClick={() => proceedToNextPhase(client.id)}
                                            >
                                                <PlayCircle className="w-3.5 h-3.5" />
                                                Proceed Next Phase
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {clients.filter(c => c.isActive).length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">
                                        No active clients found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-50 border-dashed border-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-[#64748b]">Strategic Note</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-[#475569] font-medium leading-relaxed">
                            Advancing a client to the next phase will automatically generate all relevant tasks for that phase based on the client's subscription tier. Ensure you have reviewed all current deliverables before proceeding.
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-amber-50 border-amber-100 border-dashed border-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-amber-800">Validation Required</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-amber-700 font-medium leading-relaxed">
                            The "Proceed" button remains locked until all tasks in the current active phase are marked as "Approved" by the designated approver.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
