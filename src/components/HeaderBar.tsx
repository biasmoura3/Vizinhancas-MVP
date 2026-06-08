import React, { useState, useEffect } from 'react';

interface HeaderBarProps {
  currentTerritory: string;
  displayName?: string;
  authLabel?: string;
}

const spaceTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'Etc/GMT+3',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  hourCycle: 'h23'
});

export default function HeaderBar({ currentTerritory, displayName = 'Ouvinte Atento', authLabel }: HeaderBarProps) {
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
    <header className="w-full h-16 glass-panel border-b border-[#dac2b8]/15 px-6 flex items-center justify-between text-on-surface z-40 shrink-0 relative bg-surface-container-lowest/30 backdrop-blur-md">
      {/* Platform Brand */}
      <div className="flex items-center gap-2 select-none">
        <span className="material-symbols-outlined text-primary text-2xl animate-pulse">grain</span>
        <h1 className="font-serif font-light text-2xl tracking-wide text-on-surface">
          Vizinhanças
        </h1>
      </div>

      {/* Auxiliary Actions & Profiles */}
      <div className="flex items-center gap-4">
        {/* Real-time Clock */}
        <div className="hidden sm:flex flex-col items-end text-right font-mono text-[10px] opacity-75 mr-2">
          <span className="text-secondary font-semibold uppercase tracking-wider">Espaço-Tempo</span>
          <span>{time || '15:10:00 GMT-3'}</span>
        </div>

        {/* User profile identifier (Email / Caretaker handle) */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#dac2b8]/15">
          <button className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-secondary p-[1px] cursor-pointer transition-transform hover:scale-105 active:scale-95 shadow-md">
            <div className="w-full h-full rounded-full bg-[#0b1326] flex items-center justify-center text-xs text-primary font-mono font-bold uppercase">
              OA
            </div>
          </button>
          <div className="hidden md:block text-left">
            <p className="text-xs font-sans font-semibold text-on-surface leading-tight">{displayName}</p>
            <span className="text-[10px] opacity-60 font-mono text-on-surface-variant uppercase tracking-wider">{authLabel ?? currentTerritory}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
