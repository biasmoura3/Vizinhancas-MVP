import { ActiveTab } from '../types';
import {
  Compass,
  ShieldCheck,
  FileText,
  Settings,
  HelpCircle,
  Sprout
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenModal: () => void;
  currentTerritory: string;
  displayName?: string;
  isAuthenticated?: boolean;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  onOpenModal,
  currentTerritory,
  displayName,
  isAuthenticated = false
}: SidebarProps) {
  const steps = [
    {
      id: 'nexo',
      title: 'Constelação',
      subtitle: 'DESCOBERTA E AFETO',
      icon: Compass
    },
    {
      id: 'zelo',
      title: 'Documentação',
      subtitle: 'ACERVO DE FRAGMENTOS',
      icon: ShieldCheck
    },
    {
      id: 'manifesto',
      title: 'Manifesto',
      subtitle: 'PRINCÍPIOS DA VIZINHANÇA',
      icon: FileText
    }
  ] as const;

  return (
    <aside className="order-2 md:order-1 w-full md:w-80 h-20 md:h-full flex md:flex-col glass-panel border-t md:border-t-0 md:border-r border-[#dac2b8]/15 text-on-surface overflow-hidden shrink-0">
      <div className={isAuthenticated && displayName ? 'hidden md:block px-6 py-8 border-b border-[#dac2b8]/10' : 'hidden'}>
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

      <nav className="flex-1 min-w-0 px-2 py-2 md:px-6 md:py-8 overflow-x-auto md:overflow-y-auto" aria-label="Navegação principal">
        <div className="relative md:pl-2 h-full md:h-auto">
          <div className="hidden md:block absolute left-[15px] top-6 bottom-6 w-[2px] bg-[#dac2b8]/10 z-0" />

          <div className="h-full md:h-auto flex md:block items-center gap-1 md:space-y-8 md:gap-0 relative z-10">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = activeTab === step.id;

              return (
                <div key={step.id} className="relative flex gap-2 md:gap-4 text-left group shrink-0">
                  <button
                    onClick={() => setActiveTab(step.id)}
                    className="shrink-0 flex items-start pt-0.5 focus:outline-none cursor-pointer"
                    title={step.title}
                    aria-label={step.title}
                  >
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20 scale-110'
                        : 'bg-surface-container border-[#dac2b8]/20 text-on-surface-variant hover:border-primary/40 hover:text-on-surface'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </button>

                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => setActiveTab(step.id)}
                      className="w-full text-left bg-transparent border-none p-0 pr-2 md:pr-0 focus:outline-none cursor-pointer"
                    >
                      <h4 className={`font-serif text-xs md:text-sm font-semibold tracking-wide whitespace-nowrap transition-colors ${
                        isActive ? 'text-primary' : 'text-on-surface hover:text-primary/95'
                      }`}>
                        {step.title}
                      </h4>
                      <p className="hidden md:block font-sans text-[11px] text-on-surface-variant/75 leading-snug mt-1">
                        {step.subtitle}
                      </p>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="px-2 py-2 md:px-4 md:py-6 border-l md:border-l-0 md:border-t border-[#dac2b8]/10 flex md:block items-center gap-2 md:space-y-3 bg-surface-container-low/40 overflow-x-auto">
        <button
          onClick={onOpenModal}
          className="w-11 h-11 md:w-full md:h-auto md:py-3.5 md:px-4 bg-primary text-on-primary font-sans font-medium rounded-full flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-primary/10 shrink-0"
          title="Propor Fragmento"
          aria-label="Propor Fragmento"
        >
          <Sprout className="w-4 h-4" />
          <span className="hidden md:inline text-sm">Propor Fragmento</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`w-11 h-11 md:w-full md:h-auto flex items-center justify-center md:justify-start gap-3 md:px-4 md:py-3 rounded-full text-left transition-all shrink-0 ${
            activeTab === 'settings'
              ? 'bg-surface-container-high text-primary font-medium'
              : 'text-on-surface-variant hover:bg-surface-container/40 hover:text-on-surface'
          }`}
          title="Configurações"
          aria-label="Configurações"
        >
          <Settings className="w-4 h-4 md:mr-1" />
          <span className="hidden md:inline font-sans text-xs tracking-wide">Configurações</span>
        </button>

        <button
          onClick={() => setActiveTab('ajuda')}
          className={`w-11 h-11 md:w-full md:h-auto flex items-center justify-center md:justify-start gap-3 md:px-4 md:py-3 rounded-full text-left transition-all shrink-0 ${
            activeTab === 'ajuda'
              ? 'bg-surface-container-high text-primary font-medium'
              : 'text-on-surface-variant hover:bg-surface-container/40 hover:text-on-surface'
          }`}
          title="Ajuda"
          aria-label="Ajuda"
        >
          <HelpCircle className="w-4 h-4 md:mr-1" />
          <span className="hidden md:inline font-sans text-xs tracking-wide">Ajuda</span>
        </button>
      </div>
    </aside>
  );
}
