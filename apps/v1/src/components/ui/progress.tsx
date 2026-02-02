"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  indeterminate?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, indeterminate = false, ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : value}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-white/10",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300",
            indeterminate && "animate-progress-indeterminate w-1/3"
          )}
          style={indeterminate ? undefined : { width: `${percentage}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

interface ProgressWithLabelProps extends ProgressProps {
  label?: string;
  showPercentage?: boolean;
}

const ProgressWithLabel = React.forwardRef<HTMLDivElement, ProgressWithLabelProps>(
  ({ label, showPercentage = true, value = 0, max = 100, ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
      <div ref={ref} className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showPercentage && (
            <span className="font-medium">{Math.round(percentage)}%</span>
          )}
        </div>
        <Progress value={value} max={max} {...props} />
      </div>
    );
  }
);
ProgressWithLabel.displayName = "ProgressWithLabel";

export { Progress, ProgressWithLabel };
