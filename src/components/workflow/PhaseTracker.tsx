import { Phase, PHASE_LABELS } from '@/types';
import { mockTasks, getPhaseProgress } from '@/data/mockData';
import { CheckCircle2, Lock, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhaseTrackerProps {
  currentPhase?: Phase;
  onPhaseClick?: (phase: Phase) => void;
}

const phaseColors: Record<Phase, string> = {
  onboarding: 'bg-phase-onboarding',
  foundation: 'bg-phase-foundation',
  execution: 'bg-phase-execution',
  ai: 'bg-phase-ai',
  reporting: 'bg-phase-reporting',
  monitoring: 'bg-phase-monitoring',
};

const phaseIcons: Record<Phase, string> = {
  onboarding: '📋',
  foundation: '🏗️',
  execution: '🔄',
  ai: '🤖',
  reporting: '📊',
  monitoring: '🔍',
};

export function PhaseTracker({ currentPhase = 'onboarding', onPhaseClick }: PhaseTrackerProps) {
  const phases: Phase[] = ['onboarding', 'foundation', 'execution', 'ai', 'reporting', 'monitoring'];
  const progress = getPhaseProgress(mockTasks);
  
  // Determine which phases are unlocked (for Starter tier, AI and monitoring are locked)
  const unlockedPhases: Phase[] = ['onboarding', 'foundation', 'execution', 'reporting'];
  const lockedPhases: Phase[] = ['ai', 'monitoring'];

  return (
    <div className="w-full bg-card rounded-xl border border-border p-6 shadow-card">
      <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
        Workflow Progress
      </h3>
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-border rounded-full" />
        <div 
          className="absolute top-6 left-0 h-1 bg-accent rounded-full transition-all duration-500"
          style={{ width: `${(phases.indexOf(currentPhase) / (phases.length - 1)) * 100}%` }}
        />
        
        {/* Phase Nodes */}
        <div className="relative flex justify-between">
          {phases.map((phase, index) => {
            const { completed, total } = progress[phase];
            const isComplete = total > 0 && completed === total;
            const isActive = phase === currentPhase;
            const isLocked = lockedPhases.includes(phase);
            const isPast = phases.indexOf(phase) < phases.indexOf(currentPhase);
            
            return (
              <button
                key={phase}
                onClick={() => !isLocked && onPhaseClick?.(phase)}
                disabled={isLocked}
                className={cn(
                  "flex flex-col items-center gap-2 group transition-all duration-300",
                  isLocked ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-105"
                )}
              >
                {/* Node */}
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all duration-300 border-2",
                  isComplete 
                    ? `${phaseColors[phase]} text-white border-transparent shadow-lg`
                    : isActive
                      ? `bg-background ${phaseColors[phase].replace('bg-', 'border-')} shadow-md`
                      : isPast
                        ? `bg-muted border-border`
                        : isLocked
                          ? `bg-muted border-border`
                          : `bg-background border-border group-hover:border-accent`
                )}>
                  {isLocked ? (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  ) : isComplete ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <span>{phaseIcons[phase]}</span>
                  )}
                </div>
                
                {/* Label */}
                <div className="text-center">
                  <p className={cn(
                    "text-xs font-medium whitespace-nowrap",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {PHASE_LABELS[phase].split(' ')[0]}
                  </p>
                  {total > 0 && !isLocked && (
                    <p className="text-xs text-muted-foreground">
                      {completed}/{total}
                    </p>
                  )}
                  {isLocked && (
                    <p className="text-xs text-muted-foreground">
                      Upgrade
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
