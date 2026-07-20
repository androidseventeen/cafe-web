import { useEffect } from 'react';
import { createPortal } from 'react-dom';

// Renders its content into <div id="portal"> (see public/index.html) via
// ReactDOM.createPortal, so a modal escapes the admin layout's stacking and
// overflow context. Closes on Esc, backdrop click, or the ✕ button; locks
// background scroll while open.
export default function Modal({ title, onClose, children, footer }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const portalTarget = document.getElementById('portal');
  if (!portalTarget) return null;

  return createPortal(
    // Close only on a press that both starts and ends on the backdrop, so a
    // text selection that drags outside the dialog doesn't dismiss it.
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 py-10"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-3xl rounded-lg border-2 border-black bg-brand-grey shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-dashed border-black/40 px-8 py-5">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-2xl leading-none text-neutral-500 transition hover:text-black"
          >
            ×
          </button>
        </div>

        <div className="px-8 py-6">{children}</div>

        {footer && (
          <div className="flex justify-end gap-3 border-t border-dashed border-black/40 px-8 py-5">
            {footer}
          </div>
        )}
      </div>
    </div>,
    portalTarget
  );
}
