import React from 'react';

export const SealIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="10" width="18" height="11" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <path d="M7 10V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 6V8" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 13H18" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 17H18" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9 13V21" stroke="currentColor" strokeWidth="1.5" />
    <path d="M15 13V21" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const EdictIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="5" y="4" width="14" height="16" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
    <path d="M5 8H19" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5 16H19" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="3" cy="4" r="1" fill="currentColor" />
    <circle cx="3" cy="20" r="1" fill="currentColor" />
    <circle cx="21" cy="4" r="1" fill="currentColor" />
    <circle cx="21" cy="20" r="1" fill="currentColor" />
    <path d="M3 5V19" stroke="currentColor" strokeWidth="1.5" />
    <path d="M21 5V19" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const BambooIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="4" y="3" width="3" height="18" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="10.5" y="3" width="3" height="18" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="17" y="3" width="3" height="18" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2 8H22" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
    <path d="M2 16H22" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const FishTokenIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="16" cy="8" r="1" fill="currentColor" />
    <path d="M2 12L6 10" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2 12L6 14" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
