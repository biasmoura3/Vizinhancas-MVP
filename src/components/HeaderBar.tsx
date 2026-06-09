import React, { useState, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

interface HeaderBarProps {
  currentTerritory: string;
  displayName?: string;
  authLabel?: string;
  isAuthenticated?: boolean;
  onAuthClick?: () => void;
  onHelpClick?: () => void;
  isHelpActive?: boolean;
}

const spaceTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'Etc/GMT+3',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  hourCycle: 'h23'
});

export default function HeaderBar({
  currentTerritory,
  displayName,
  authLabel,
  isAuthenticated = true,
  onAuthClick,
  onHelpClick,
  isHelpActive = false,
}: HeaderBarProps) {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(`${spaceTimeFormatter.format(now)} GMT-3`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full min-h-16 glass-panel border-b border-[#dac2b8]/15 px-3 sm:px-6 py-2 flex items-center justify-between gap-3 text-on-surface z-40 shrink-0 relative bg-surface-container-lowest/30 backdrop-blur-md">
      {/* Platform Brand */}
      <div className="flex min-w-0 items-center gap-2 select-none">
        <span className="material-symbols-outlined text-primary text-2xl animate-pulse shrink-0">grain</span>
        <h1 className="font-serif font-light text-xl sm:text-2xl tracking-wide text-on-surface truncate">
          Vizinhanças
        </h1>
      </div>

      {/* Auxiliary Actions & Profiles */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        {/* Real-time Clock */}
        <div className="hidden sm:flex flex-col items-end text-right font-mono text-[10px] opacity-75 mr-2">
          <span className="text-secondary font-semibold uppercase tracking-wider">Espaço-Tempo</span>
          <span>{time || '15:10:00 GMT-3'}</span>
        </div>

        {isAuthenticated && displayName ? (
          <div className="flex items-center gap-2.5 pl-3 border-l border-[#dac2b8]/15">
            <button className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-secondary p-[1px] cursor-pointer transition-transform hover:scale-105 active:scale-95 shadow-md">
              <div className="w-full h-full rounded-full bg-[#0b1326] flex items-center justify-center text-xs text-primary font-mono font-bold uppercase">
                {displayName.slice(0, 2)}
              </div>
            </button>
            <div className="hidden md:block text-left">
              <p className="text-xs font-sans font-semibold text-on-surface leading-tight">{displayName}</p>
              <span className="text-[10px] opacity-60 font-mono text-on-surface-variant uppercase tracking-wider">{authLabel ?? currentTerritory}</span>
            </div>
          </div>
        ) : onAuthClick ? (
          <button
            type="button"
            onClick={onAuthClick}
            className="pl-3 border-l border-[#dac2b8]/15 flex items-center gap-2 text-xs font-semibold text-on-primary bg-primary hover:brightness-105 rounded-full px-3 sm:px-4 py-2.5 transition-all cursor-pointer shadow-md"
          >
            <span className="material-symbols-outlined text-base leading-none">login</span>
            <span className="hidden min-[360px]:inline">Entrar para contribuir</span>
          </button>
        ) : (
          <div className="pl-3 border-l border-[#dac2b8]/15 hidden sm:block text-right font-mono text-[10px] opacity-75 uppercase tracking-wider">
            {authLabel}
          </div>
        )}

        {onHelpClick && (
          <button
            type="button"
            onClick={onHelpClick}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
              isHelpActive
                ? 'bg-primary text-on-primary border-primary shadow-md shadow-primary/20'
                : 'bg-surface-container/35 border-[#dac2b8]/20 text-on-surface-variant hover:border-primary/40 hover:text-primary hover:bg-surface-container/60'
            }`}
            title="Ajuda"
            aria-label="Ajuda"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
}
