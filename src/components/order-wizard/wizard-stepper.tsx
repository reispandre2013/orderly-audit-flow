import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WizardStep {
  id: string;
  label: string;
  description?: string;
}

interface WizardStepperProps {
  steps: WizardStep[];
  currentIndex: number;
  onStepClick?: (index: number) => void;
}

export function WizardStepper({ steps, currentIndex, onStepClick }: WizardStepperProps) {
  return (
    <ol className="flex flex-col gap-2 lg:flex-row lg:items-stretch lg:gap-0">
      {steps.map((step, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;
        const clickable = onStepClick && index <= currentIndex;
        return (
          <li key={step.id} className="flex flex-1 items-center gap-3 lg:flex-col lg:items-start lg:gap-1">
            <button
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onStepClick?.(index)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors lg:w-full",
                isCurrent && "border-primary bg-primary-soft",
                isDone && "border-border bg-card",
                !isCurrent && !isDone && "border-dashed border-border bg-card/50",
                clickable && "hover:border-primary/60",
              )}
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  isDone && "bg-status-delivered text-status-delivered-foreground",
                  isCurrent && "bg-primary text-primary-foreground",
                  !isCurrent && !isDone && "bg-secondary text-muted-foreground",
                )}
              >
                {isDone ? <Check className="size-4" /> : index + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "block text-sm font-semibold",
                    isCurrent ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step.label}
                </span>
                {step.description && (
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {step.description}
                  </span>
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
