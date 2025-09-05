import { useEffect, useRef } from "react";

export const AppModal = ({
  title,
  subtitle,
  onClose,
  children,
  actions,
  size = "md",
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    // Focus dialog for accessibility
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const sizeClass =
    size === "sm" ? "max-w-md" : size === "lg" ? "max-w-3xl" : "max-w-2xl";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className={`relative bg-black/95 border border-primary-300/20 rounded-2xl w-full ${sizeClass} shadow-2xl max-h-[85vh] flex flex-col`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-6 py-4 border-b border-primary-300/20 bg-black/95 rounded-t-2xl">
          <div>
            <h2
              id="modal-title"
              className="text-xl font-semibold text-primary-300"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-primary-300/70 mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            className="text-primary-300/70 hover:text-primary-300 transition-colors p-1 rounded-lg hover:bg-white/10"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
        {actions && (
          <div className="sticky bottom-0 z-10 px-6 py-3 border-t border-primary-300/20 bg-black/95 rounded-b-2xl flex justify-end gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppModal;
