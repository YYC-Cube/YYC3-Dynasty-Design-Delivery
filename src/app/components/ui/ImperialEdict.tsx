import React, { useState } from 'react';
import { motion } from 'motion/react';

interface ImperialEdictProps {
  title: string;
  type: '制书' | '敕书' | '敕牒';
  content: string;
  onClose?: () => void;
  children?: React.ReactNode;
}

export function ImperialEdict({ title, type, content, onClose, children }: ImperialEdictProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Auto open after a small delay
  React.useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 400); // Wait for drop-in
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="relative flex items-center justify-center max-w-[800px] w-full"
    >
      {/* Scroll Left Axis */}
      <motion.div 
        animate={{ rotate: isOpen ? -360 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="w-8 h-[640px] bg-[var(--color-scroll-wood)] rounded-l-full shadow-inner border-y border-l border-[var(--color-bamboo-dark)] relative z-20 flex items-center justify-center shrink-0"
      >
        <div className="w-full h-[95%] bg-[var(--color-scroll-wood-dark)] rounded-l-full border-r border-[var(--color-bg-primary)]/30"></div>
      </motion.div>

      {/* Main Edict Body */}
      <motion.div 
        initial={{ width: "0px" }}
        animate={{ width: isOpen ? "100%" : "0px" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="h-[640px] overflow-hidden relative shadow-2xl flex-1 flex flex-col bg-[var(--color-edict-silk)] bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')] border-y-4 border-[var(--color-accent-gold)]"
      >
        {/* Sky Header */}
        <div className="h-12 bg-[var(--color-edict-sky)] w-full flex items-center px-6 border-b border-[var(--color-accent-gold)]/50 justify-between shrink-0">
          <span className="font-serif text-[var(--color-accent-gold)]">{type}</span>
          {onClose && (
            <button onClick={onClose} className="text-[var(--color-text-primary)] hover:text-[var(--color-accent-gold)]">&times;</button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-12 overflow-y-auto custom-scrollbar min-w-[600px]">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="h-full flex flex-col"
          >
            <h2 className="text-3xl font-serif font-bold text-center text-[var(--color-edict-ink)] mb-8 border-b-2 border-[var(--color-accent-gold)]/30 pb-4">
              {title}
            </h2>
            <div className="font-serif text-lg leading-relaxed text-[var(--color-edict-ink)] whitespace-pre-wrap flex-1">
              {content}
            </div>

            <div className="mt-8 flex justify-end">
              {children}
            </div>
          </motion.div>
        </div>

        {/* Earth Footer */}
        <div className="h-8 bg-[var(--color-edict-sky)] w-full border-t border-[var(--color-accent-gold)]/50 shrink-0"></div>
      </motion.div>

      {/* Scroll Right Axis */}
      <motion.div 
        animate={{ rotate: isOpen ? 360 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="w-8 h-[640px] bg-[var(--color-scroll-wood)] rounded-r-full shadow-inner border-y border-r border-[var(--color-bamboo-dark)] relative z-20 flex items-center justify-center shrink-0"
      >
        <div className="w-full h-[95%] bg-[var(--color-scroll-wood-dark)] rounded-r-full border-l border-[var(--color-bg-primary)]/30"></div>
      </motion.div>
    </motion.div>
  );
}
