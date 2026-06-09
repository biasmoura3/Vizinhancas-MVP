import { ActiveTab } from '../types';
import {
  Compass,
  ShieldCheck,
  FileText,
  Settings
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentTerritory: string;
  displayName?: string;
  isAuthenticated?: boolean;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  currentTerritory,
  displayName,
  isAuthenticated = false
}: SidebarProps) {
  const steps = [
    {
      id: 'nexo',
      title: 'Constelação',
      shortTitle: 'Constelação',
      subtitle: 'DESCOBERTA E AFETO',
      icon: Compass
    },
    {
      id: 'zelo',
      title: 'Documentação',
      shortTitle: 'Docs',
      subtitle: 'ACERVO DE FRAGMENTOS',
      icon: ShieldCheck
    },
    {
      id: 'manifesto',
      title: 'Manifesto',
      shortTitle: 'Manifesto',
      subtitle: 'PRINCÍPIOS DA VIZINHANÇA',
      icon: FileText
    },
    {
      id: 'settings',
      title: 'Configurações',
      shortTitle: 'Config',
      subtitle: 'AJUSTES DA PLATAFORMA',
      icon: Settings
    }
  ] as const;

  return (
    <aside className="order-2 md:order-1 w-full md:w-80 h-20 md:h-full flex md:flex-col glass-panel border-t md:border-t-0 md:border-r border-outline/20 text-on-surface overflow-hidden shrink-0">
      <div className={isAuthenticated && displayName ? 'hidden md:block px-6 py-8 border-b border-outline/15' : 'hidden'}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined font-light text-2xl" style={{ fontVariationSettings: "'FILL' 1, 'wght' 200" }}>hearing</span>
          </div>
          <div className="min-w-0">
            <h2 className="font-sans font-semibold text-base text-primary tracking-wide truncate">{displayName}</h2>
            <p className="font-mono text-[10px] text-on-surface-variant opacity-80 uppercase tracking-wider truncate">Território: {currentTerritory}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 min-w-0 px-1.5 py-2 md:px-6 md:py-8 overflow-x-auto md:overflow-y-auto" aria-label="Navegação principal">
        <div className="relative md:pl-2 h-full md:h-auto">
          <div className="hidden md:block absolute left-[15px] top-6 bottom-6 w-[2px] bg-outline/20 z-0" />

          <div className="h-full md:h-auto flex md:block items-stretch md:items-start justify-around gap-1 md:space-y-8 md:gap-0 relative z-10">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = activeTab === step.id;

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveTab(step.id)}
                  className="relative flex w-20 md:w-full shrink-0 flex-col items-center justify-center gap-1.5 rounded-2xl px-1 py-1 text-center transition-all md:flex-row md:items-start md:justify-start md:gap-4 md:rounded-none md:px-0 md:py-0 md:text-left focus:outline-none cursor-pointer group"
                  title={step.title}
                  aria-label={step.title}
                >
                  <div className={`w-9 h-9 md:w-8 md:h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20 scale-105 md:scale-110'
                      : 'bg-surface-container border-outline/25 text-on-surface-variant group-hover:border-primary/40 group-hover:text-on-surface'
                  }`}>
                    <Icon className="w-4.5 h-4.5 md:w-4 md:h-4" />
                  </div>

                  <div className="min-w-0 md:flex-1">
                    <h4 className={`font-serif text-[10px] md:text-sm font-semibold leading-none md:leading-snug tracking-wide transition-colors ${
                      isActive ? 'text-primary' : 'text-on-surface group-hover:text-primary/95'
                    }`}>
                      <span className="md:hidden">{step.shortTitle ?? step.title}</span>
                      <span className="hidden md:inline">{step.title}</span>
                    </h4>
                    <p className="hidden md:block font-sans text-[11px] text-on-surface-variant/75 leading-snug mt-1">
                      {step.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </aside>
  );
}
