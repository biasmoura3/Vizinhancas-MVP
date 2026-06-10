import { ActiveTab } from '../types';
import {
  Compass,
  FileText,
  HelpCircle,
  Settings,
  ShieldCheck,
  Sprout,
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentTerritory: string;
  displayName?: string;
  isAuthenticated?: boolean;
  onOpenProposal: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  currentTerritory,
  displayName,
  isAuthenticated = false,
  onOpenProposal,
}: SidebarProps) {
  const primarySteps = [
    {
      id: 'nexo',
      title: 'Constelação',
      shortTitle: 'Constelação',
      subtitle: 'DESCOBERTA E AFETO',
      icon: Compass,
    },
    {
      id: 'zelo',
      title: 'Documentação',
      shortTitle: 'Docs',
      subtitle: 'ACERVO DE FRAGMENTOS',
      icon: ShieldCheck,
    },
    {
      id: 'manifesto',
      title: 'Manifesto',
      shortTitle: 'Manifesto',
      subtitle: 'PRINCÍPIOS DA VIZINHANÇA',
      icon: FileText,
    },
  ] as const;

  const utilitySteps = [
    {
      id: 'settings',
      title: 'Configurações',
      shortTitle: 'Config',
      icon: Settings,
    },
    {
      id: 'ajuda',
      title: 'Ajuda',
      shortTitle: 'Ajuda',
      icon: HelpCircle,
    },
  ] as const;

  const mobileSteps = [...primarySteps, ...utilitySteps];

  return (
    <aside className="order-2 md:order-1 w-full md:w-[307px] h-20 md:h-full flex md:flex-col bg-[#0b1326] border-t md:border-t-0 md:border-r border-[#dac2b8]/15 text-on-surface overflow-hidden shrink-0">
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

      <nav className="flex-1 min-w-0 px-1.5 py-2 md:px-5 md:py-8 overflow-x-auto md:overflow-y-auto" aria-label="Navegação principal">
        <div className="relative h-full md:h-auto md:pl-2">
          <div className="hidden md:block absolute left-[10px] top-6 bottom-6 w-px bg-[#dac2b8]/14 z-0" />

          <div className="h-full md:h-auto flex md:block items-stretch md:items-start justify-around gap-1 md:space-y-8 md:gap-0 relative z-10">
            {mobileSteps.map((step) => {
              const Icon = step.icon;
              const isActive = activeTab === step.id;
              const isUtilityStep = step.id === 'settings' || step.id === 'ajuda';

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveTab(step.id)}
                  className={`relative flex w-20 shrink-0 flex-col items-center justify-center gap-1.5 rounded-2xl px-1 py-1 text-center transition-all md:w-full md:flex-row md:items-start md:justify-start md:gap-4 md:rounded-none md:px-0 md:py-0 md:text-left focus:outline-none cursor-pointer group ${isUtilityStep ? 'md:hidden' : ''}`}
                  title={step.title}
                  aria-label={step.title}
                >
                  <div className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20 scale-105'
                      : 'bg-surface-container border-[#dac2b8]/20 text-on-surface-variant group-hover:border-primary/40 group-hover:text-on-surface'
                  }`}>
                    <Icon className="w-4.5 h-4.5 md:w-4 md:h-4" strokeWidth={1.8} />
                  </div>

                  <div className="min-w-0 md:flex-1">
                    <h4 className={`font-serif text-[10px] md:text-[15px] font-semibold leading-none md:leading-snug tracking-wide transition-colors ${
                      isActive ? 'text-primary' : 'text-on-surface group-hover:text-primary/95'
                    }`}>
                      <span className="md:hidden">{step.shortTitle ?? step.title}</span>
                      <span className="hidden md:inline">{step.title}</span>
                    </h4>
                    {'subtitle' in step && (
                      <p className="hidden md:block font-sans text-[11px] text-on-surface-variant/75 leading-snug mt-1">
                        {step.subtitle}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="hidden md:block border-t border-[#dac2b8]/15 px-4 py-5 space-y-4">
        <button
          type="button"
          onClick={onOpenProposal}
          className="w-full h-[52px] rounded-full bg-primary text-on-primary hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-primary/10 flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Sprout className="w-4 h-4" strokeWidth={1.8} />
          <span>Propor Fragmento</span>
        </button>

        <div className="space-y-1">
          {utilitySteps.map((step) => {
            const Icon = step.icon;
            const isActive = activeTab === step.id;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveTab(step.id)}
                className={`w-full h-12 px-4 flex items-center gap-4 rounded-lg text-left text-sm transition-colors cursor-pointer group ${
                  isActive ? 'text-primary bg-primary/[0.08]' : 'text-on-surface hover:text-primary hover:bg-surface-container/35'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" strokeWidth={1.8} />
                <span>{step.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
