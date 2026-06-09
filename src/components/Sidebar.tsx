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
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  onOpenModal, 
  currentTerritory,
  displayName = 'Ouvinte Atento'
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
    <aside className="w-80 h-full flex flex-col glass-panel border-r border-[#dac2b8]/15 text-on-surface overflow-hidden shrink-0">
      {/* Caretaker / Resident Profile Header */}
      <div className="px-6 py-8 border-b border-[#dac2b8]/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined font-light text-2xl" style={{ fontVariationSettings: "'FILL' 1, 'wght' 200" }}>hearing</span>
          </div>
          <div>
            <h2 className="font-sans font-semibold text-base text-primary tracking-wide">{displayName}</h2>
            <p className="font-mono text-[10px] text-on-surface-variant opacity-80 uppercase tracking-wider">Território: {currentTerritory}</p>
          </div>
        </div>
      </div>

      {/* Stepper Navigation Options */}
      <div className="flex-1 px-6 py-8 overflow-y-auto">
        
        <div className="relative pl-2">
          {/* Vertical continuous line */}
          <div className="absolute left-[15px] top-6 bottom-6 w-[2px] bg-[#dac2b8]/10 z-0" />

          <div className="space-y-8 relative z-10">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = activeTab === step.id;
              
              return (
                <div key={step.id} className="relative flex gap-4 text-left group">
                  {/* Stepper Node (Circle) */}
                  <button
                    onClick={() => setActiveTab(step.id)}
                    className="shrink-0 flex items-start pt-0.5 focus:outline-none cursor-pointer"
                  >
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                      isActive 
                        ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20 scale-110' 
                        : 'bg-surface-container border-[#dac2b8]/20 text-on-surface-variant hover:border-primary/40 hover:text-on-surface'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Stepper Label & Description */}
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => setActiveTab(step.id)}
                      className="w-full text-left bg-transparent border-none p-0 focus:outline-none cursor-pointer"
                    >
                      <h4 className={`font-serif text-sm font-semibold tracking-wide transition-colors ${
                        isActive ? 'text-primary' : 'text-on-surface hover:text-primary/95'
                      }`}>
                        {step.title}
                      </h4>
                      <p className="font-sans text-[11px] text-on-surface-variant/75 leading-snug mt-1">
                        {step.subtitle}
                      </p>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Workspace Action buttons */}
      <div className="px-4 py-6 border-t border-[#dac2b8]/10 space-y-3 bg-surface-container-low/40">
        <button
          onClick={onOpenModal}
          className="w-full py-3.5 px-4 bg-primary text-on-primary font-sans font-medium rounded-full flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-primary/10"
        >
          <Sprout className="w-4 h-4" />
          <span className="text-sm">Propor Fragmento</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-left transition-all ${
            activeTab === 'settings' 
              ? 'bg-surface-container-high text-primary font-medium' 
              : 'text-on-surface-variant hover:bg-surface-container/40 hover:text-on-surface'
          }`}
        >
          <Settings className="w-4 h-4 mr-1" />
          <span className="font-sans text-xs tracking-wide">Configurações</span>
        </button>

        <button
          onClick={() => setActiveTab('ajuda')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-left transition-all ${
            activeTab === 'ajuda' 
              ? 'bg-surface-container-high text-primary font-medium' 
              : 'text-on-surface-variant hover:bg-surface-container/40 hover:text-on-surface'
          }`}
        >
          <HelpCircle className="w-4 h-4 mr-1" />
          <span className="font-sans text-xs tracking-wide">Ajuda</span>
        </button>
      </div>
    </aside>
  );
}
