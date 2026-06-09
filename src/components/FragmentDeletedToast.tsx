import { CheckCircle2, X } from 'lucide-react';

interface FragmentDeletedToastProps {
  fragmentTitle: string | null;
  onClose: () => void;
}

export default function FragmentDeletedToast({
  fragmentTitle,
  onClose
}: FragmentDeletedToastProps) {
  if (!fragmentTitle) return null;

  return (
    <div className="fixed bottom-24 md:bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 sm:left-auto sm:right-6 sm:w-full sm:translate-x-0 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="glass-panel border border-secondary/25 rounded-xl shadow-2xl bg-surface/90 p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-secondary/15 border border-secondary/25 text-secondary flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-sans text-sm font-semibold text-on-surface">
            Fragmento excluído
          </p>
          <p className="mt-0.5 text-xs text-on-surface-variant leading-relaxed">
            “{fragmentTitle}” foi removido da constelação local.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-on-surface-variant/60 hover:text-primary transition-colors p-1 rounded-full hover:bg-surface-container cursor-pointer"
          aria-label="Fechar confirmação"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
