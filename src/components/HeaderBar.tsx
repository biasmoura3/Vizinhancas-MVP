import React, { useState, useEffect } from 'react';
import { Bell, Heart, Flame, Shield, User } from 'lucide-react';

interface HeaderBarProps {
  currentTerritory: string;
}

export default function HeaderBar({ currentTerritory }: HeaderBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toISOString().substring(11, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const notifications = [
    { id: 1, text: 'Novo fragmento "Sussurros do Altiplano" sugerido.', time: 'há 5 min' },
    { id: 2, text: 'Sua sugestão de fragmento foi integrada.', time: 'há 1 hora' },
    { id: 3, text: 'Novos fragmentos próximos foram conectados na Constelação.', time: 'há 3 horas' }
  ];

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
          <span>{time || '15:10:00 UTC'}</span>
        </div>

        {/* Notifications Button */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-full bg-surface-container/40 hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all cursor-pointer relative shadow-sm border border-[#dac2b8]/10"
            aria-label="Notificações"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-tertiary border-2 border-[#0b1326] animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 glass-panel border border-[#dac2b8]/15 rounded-3xl text-left shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-top-3 duration-300 bg-[#121c2e]">
              <div className="flex items-center justify-between pb-3 border-b border-[#dac2b8]/10">
                <h3 className="font-sans font-semibold text-xs tracking-wider text-primary uppercase">Notificações</h3>
                <span className="text-[9px] bg-tertiary/10 text-tertiary px-2.5 py-0.5 rounded-full font-mono font-semibold">3 Ativas</span>
              </div>
              <div className="mt-3 divide-y divide-[#dac2b8]/10">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 text-xs">
                    <p className="text-on-surface opacity-90 leading-relaxed font-sans">{n.text}</p>
                    <span className="block text-[10px] text-on-surface-variant/60 font-mono mt-1">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User profile identifier (Email / Caretaker handle) */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#dac2b8]/15">
          <button className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-secondary p-[1px] cursor-pointer transition-transform hover:scale-105 active:scale-95 shadow-md">
            <div className="w-full h-full rounded-full bg-[#0b1326] flex items-center justify-center text-xs text-primary font-mono font-bold uppercase">
              OA
            </div>
          </button>
          <div className="hidden md:block text-left">
            <p className="text-xs font-sans font-semibold text-on-surface leading-tight">Ouvinte Atento</p>
            <span className="text-[10px] opacity-60 font-mono text-on-surface-variant uppercase tracking-wider">{currentTerritory}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
