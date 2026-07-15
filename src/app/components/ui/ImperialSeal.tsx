import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SealIcon } from './Icons';

interface ImperialSealProps {
  onSeal?: () => void;
  sealed?: boolean;
  disabled?: boolean;
  className?: string;
}

export function ImperialSeal({ onSeal, sealed = false, disabled = false, className = '' }: ImperialSealProps) {
  const [isPressing, setIsPressing] = useState(false);
  const [isSealed, setIsSealed] = useState(sealed);

  // Keep local state in sync if the parent prop flips (e.g. when an edict is
  // loaded that is already sealed). Without this, ImperialSeal would render
  // the "press to seal" UI for an already-sealed edict until the next mount.
  useEffect(() => {
    setIsSealed(sealed);
  }, [sealed]);

  const handleSeal = () => {
    if (disabled || isSealed) return;
    setIsPressing(true);
    setTimeout(() => {
      setIsPressing(false);
      setIsSealed(true);
      if (onSeal) onSeal();
    }, 700); // Wait for Phase 3 to finish
  };

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <AnimatePresence>
        {!isSealed && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ 
              y: isPressing ? 20 : 0, 
              opacity: disabled ? 0.5 : 1,
              scale: isPressing ? 0.97 : 1,
              rotateX: isPressing ? 0 : 5 // slightly tilted
            }}
            exit={{ y: -50, opacity: 0, transition: { duration: 0.3 } }}
            whileHover={!disabled && !isPressing ? { scale: 1.1, y: -5, boxShadow: "0 8px 32px rgba(212,168,67,0.3)" } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={handleSeal}
            className={`w-20 h-20 bg-white/90 rounded-sm shadow-xl flex items-center justify-center cursor-pointer border-2 border-[var(--color-accent-gold)] relative z-20 ${disabled ? 'cursor-not-allowed grayscale' : ''}`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Dragon Knob (Top of seal) */}
            <div className="absolute -top-6 w-12 h-8 bg-white/90 border-2 border-b-0 border-[var(--color-accent-gold)] rounded-t-lg flex items-center justify-center">
              <SealIcon className="w-6 h-6 text-[var(--color-accent-gold)]" />
            </div>
            
            {/* Seal Face */}
            <div className="w-[80%] h-[80%] border border-[var(--color-accent-vermillion)]/30 flex items-center justify-center">
               <span className="font-serif text-[var(--color-accent-vermillion)] text-xs font-bold opacity-50">待印</span>
            </div>

            {/* Shockwave on press */}
            {isPressing && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0.8 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 bg-[var(--color-accent-vermillion)] rounded-sm pointer-events-none"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* The stamped mark on the paper */}
      <AnimatePresence>
        {(isSealed || sealed) && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="absolute z-10 w-20 h-20 border-4 border-[var(--color-accent-vermillion)] flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] bg-[var(--color-accent-vermillion)]/5"
          >
            <span className="font-serif text-lg leading-tight text-center writing-vertical-rl text-[var(--color-accent-vermillion)] font-bold" style={{ textShadow: "0 0 2px rgba(200,37,6,0.5)" }}>
              受命于天<br/>既寿永昌
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
