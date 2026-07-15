import { useEffect, MouseEvent } from 'react';

/**
 * Close a modal/dialog when:
 *  1. The user presses Escape (matches native <dialog> behaviour) — handled
 *     via a document-level listener so focus doesn't have to be inside the
 *     overlay.
 *  2. The user clicks the backdrop — caller spreads `onBackdropClick` on the
 *     overlay div; we only close when `e.target === e.currentTarget`, so
 *     clicks inside the content don't bubble-close.
 *
 * Caller pattern:
 *   const onBackdropClick = useModalDismiss(onClose);
 *   <div className="overlay" onClick={onBackdropClick}>
 *     <div className="content">...</div>
 *   </div>
 *
 * Pass `enabled = false` to disable both behaviours (e.g. when modal is closed).
 */
export function useModalDismiss(onClose: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose, enabled]);

  return (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
}
