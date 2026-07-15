import React from 'react';
import { cn } from './utils';

interface NodeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  icon?: React.ReactNode;
  active?: boolean;
  status?: 'online' | 'offline' | 'error' | 'warning';
}

export function NodeCard({ className, title, icon, active, status = 'online', children, ...props }: NodeCardProps) {
  return (
    <div
      className={cn(
        "relative rounded border bg-[var(--color-bg-secondary)] p-4 transition-all duration-300",
        active ? "border-[var(--color-accent-gold)] shadow-[0_0_16px_rgba(212,175,55,0.2)]" : "border-[var(--color-text-secondary)]/30",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {icon && <span className="text-[var(--color-accent-gold)]">{icon}</span>}
          <h3 className="font-serif text-lg font-bold text-[var(--color-text-primary)] tracking-wider">{title}</h3>
        </div>
        <div className="flex items-center">
          <span className={cn(
            "h-2 w-2 rounded-full",
            {
              "bg-[var(--color-accent-emerald)] animate-pulse shadow-[0_0_8px_var(--color-accent-emerald)]": status === 'online',
              "bg-[var(--color-text-secondary)]": status === 'offline',
              "bg-[var(--color-accent-vermillion)] shadow-[0_0_8px_var(--color-accent-vermillion)]": status === 'error',
              "bg-[var(--color-accent-gold)] shadow-[0_0_8px_var(--color-accent-gold)]": status === 'warning',
            }
          )} />
        </div>
      </div>
      <div className="text-sm font-sans text-[var(--color-text-secondary)]">
        {children}
      </div>
    </div>
  );
}
