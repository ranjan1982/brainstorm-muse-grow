import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-success text-success-foreground",
        warning: "border-transparent bg-warning text-warning-foreground",
        info: "border-transparent bg-info text-info-foreground",
        accent: "border-transparent bg-accent text-accent-foreground",
        pending: "border-transparent bg-muted text-muted-foreground",
        "in-progress": "border-transparent bg-info/20 text-info",
        completed: "border-transparent bg-accent/20 text-accent",
        submitted: "border-transparent bg-warning/20 text-warning",
        approved: "border-transparent bg-success/20 text-success",
        resubmit: "border-transparent bg-destructive/20 text-destructive",
        admin: "border-transparent bg-purple-500/20 text-purple-600",
        "us-strategy": "border-transparent bg-blue-500/20 text-blue-600",
        "seo-head": "border-transparent bg-emerald-500/20 text-emerald-600",
        "seo-junior": "border-transparent bg-teal-500/20 text-teal-600",
        client: "border-transparent bg-amber-500/20 text-amber-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
