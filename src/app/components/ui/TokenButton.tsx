import React from 'react';
import { cn } from './utils';

export interface TokenButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const TokenButton = React.forwardRef<HTMLButtonElement, TokenButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded bg-[var(--color-bg-secondary)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-[2px]",
          {
            "border border-[var(--color-accent-gold)] text-[var(--color-accent-gold)] hover:shadow-[0_0_12px_rgba(212,175,55,0.4)]": variant === 'primary',
            "border border-[var(--color-text-secondary)] text-[var(--color-text-primary)] hover:border-[var(--color-text-primary)] hover:shadow-[0_0_8px_rgba(232,227,215,0.2)]": variant === 'secondary',
            "border border-[var(--color-accent-vermillion)] text-[var(--color-accent-vermillion)] hover:shadow-[0_0_12px_rgba(200,37,6,0.4)]": variant === 'danger',
            "border border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/5": variant === 'ghost',
            "h-8 px-3 text-xs": size === 'sm',
            "h-10 px-4 py-2 text-sm": size === 'md',
            "h-12 px-6 py-3 text-base": size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);

TokenButton.displayName = "TokenButton";
