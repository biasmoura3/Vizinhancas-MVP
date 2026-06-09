import { AlertTriangle, Trash2, X } from 'lucide-react';
import { WorldFragment } from '../types';

interface DeleteFragmentModalProps {
  fragment: WorldFragment | null;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteFragmentModal({
  fragment,
  isOpen,
  onCancel,
  onConfirm
}: DeleteFragmentModalProps) {
  if (!isOpen || !fragment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-surface/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg max-h-[calc(100vh-2rem)] glass-panel border border-error/20 rounded-xl shadow-2xl flex flex-col my-4 sm:my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <button
          onClick={onCancel}
          className="absolute top-5 right-5 text-on-surface-variant hover:text-primary transition-colors z-10 p-2 cursor-pointer bg-surface-container/60 hover:bg-surface-container rounded-full border border-outline-variant/10"
          aria-label="Fechar confirmação"
        >
          <X className="w-5 h-5" />
        </button>

        <header className="px-4 sm:px-8 pt-6 sm:pt-8 pb-5 pr-16 border-b border-outline-variant/10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-error/15 border border-error/25 text-error flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="font-serif text-2xl sm:text-3xl font-light text-on-surface tracking-wide">
              Excluir Fragmento
            </h1>
            <p className="font-mono text-[10px] text-error tracking-[0.2em] uppercase opacity-90 mt-1 font-semibold">
              AÇÃO PERMANENTE
            </p>
          </div>
        </header>

        <div className="px-4 sm:px-8 py-5 sm:py-6 space-y-4 overflow-y-auto">
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Você está prestes a excluir o fragmento abaixo do seu acervo. Depois da confirmação, ele será removido da constelação local.
          </p>

          <div className="bg-surface-container-low/60 border border-outline/20 rounded-lg p-4 space-y-1">
            <span className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant/50 font-semibold">
              Fragmento selecionado
            </span>
            <h2 className="font-serif text-xl font-light text-on-surface leading-snug">
              {fragment.title}
            </h2>
            <p className="text-[10px] font-mono text-on-surface-variant/45">
              Registrado por: {fragment.source}
            </p>
          </div>
        </div>

        <footer className="px-4 sm:px-8 py-4 sm:py-5 bg-surface-container-low/75 border-t border-outline-variant/10 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-3.5 bg-surface-container border border-outline/25 text-on-surface font-sans font-semibold flex items-center justify-center hover:bg-surface-container-high active:scale-95 transition-all text-sm rounded-full cursor-pointer"
          >
            Manter Fragmento
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto px-6 py-3.5 bg-error/15 border border-error/30 text-error hover:bg-error/25 font-sans font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all text-sm rounded-full cursor-pointer shadow-lg shadow-error/10"
          >
            <Trash2 className="w-4 h-4 shrink-0" />
            <span>Excluir Definitivamente</span>
          </button>
        </footer>
      </div>
    </div>
  );
}
