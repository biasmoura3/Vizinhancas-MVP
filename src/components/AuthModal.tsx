import React from 'react';
import { LogIn, Mail, X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  email: string;
  isSubmitting: boolean;
  message?: string | null;
  error?: string | null;
  onEmailChange: (email: string) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
}

export default function AuthModal({
  isOpen,
  email,
  isSubmitting,
  message,
  error,
  onEmailChange,
  onClose,
  onSubmit,
}: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#040810]/75 backdrop-blur-sm">
      <div className="w-full max-w-md glass-panel border border-[#dac2b8]/20 rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.72)] bg-[#0a1120]/95 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-[#dac2b8]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/25 text-primary flex items-center justify-center">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl text-on-surface leading-tight">Entrar para contribuir</h2>
              <p className="text-xs text-on-surface-variant/75 mt-1">Use seu e-mail para receber um link de acesso.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-transparent hover:border-[#dac2b8]/20 hover:bg-surface-container/50 text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-all cursor-pointer"
            aria-label="Fechar entrada"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <label className="block space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant/70 font-semibold">E-mail</span>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/45" />
              <input
                type="email"
                value={email}
                onChange={(event) => onEmailChange(event.target.value)}
                placeholder="seu-email@exemplo.com"
                className="w-full bg-surface-container-low/70 rounded-full border border-[#dac2b8]/20 pl-11 pr-4 py-3 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                autoComplete="email"
                autoFocus
                required
              />
            </div>
          </label>

          {message && (
            <p className="text-xs leading-relaxed text-secondary bg-secondary/10 border border-secondary/15 rounded-xl px-4 py-3">
              {message}
            </p>
          )}

          {error && (
            <p className="text-xs leading-relaxed text-error bg-error/10 border border-error/15 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-primary text-on-primary hover:brightness-105 rounded-full text-sm font-semibold transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait"
          >
            {isSubmitting ? 'Enviando...' : 'Receber link de acesso'}
          </button>
        </form>
      </div>
    </div>
  );
}
