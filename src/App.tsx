import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import HeaderBar from './components/HeaderBar';
import CanvasMap from './components/CanvasMap';
import ProposalModal from './components/ProposalModal';
import EditFragmentModal from './components/EditFragmentModal';

import ManifestoTab from './components/tabs/ManifestoTab';
import ZeloTab from './components/tabs/ZeloTab';

import { ActiveTab, WorldFragment, StewardshipStatus } from './types';
import { INITIAL_FRAGMENTS } from './data';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('nexo'); // Defaulting to the map step
  const [currentTerritory, setCurrentTerritory] = useState<string>('Setor 7G');
  const [selectedFragmentId, setSelectedFragmentId] = useState<string | null>(null);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [fragmentToEdit, setFragmentToEdit] = useState<WorldFragment | null>(null);
  // Fragments reactive state
  const [fragments, setFragments] = useState<WorldFragment[]>(() => {
    const saved = localStorage.getItem('situated_memories');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_FRAGMENTS;
  });

  // Saved fragments from other communities/authors state
  const [savedFragmentIds, setSavedFragmentIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('saved_fragment_ids');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    // Pre-save alti-1 and memb-3 for demo context on startup
    return ['alti-1', 'memb-3'];
  });

  // Keep local storage synchronized
  useEffect(() => {
    localStorage.setItem('situated_memories', JSON.stringify(fragments));
  }, [fragments]);

  useEffect(() => {
    localStorage.setItem('saved_fragment_ids', JSON.stringify(savedFragmentIds));
  }, [savedFragmentIds]);

  const handleToggleSaveFragment = (id: string) => {
    setSavedFragmentIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleAddFragment = (newFragData: Omit<WorldFragment, 'id' | 'createdAt' | 'status'>) => {
    const uniqueId = `frag-${Date.now()}`;
    const newFragment: WorldFragment = {
      ...newFragData,
      id: uniqueId,
      status: 'Zelo Concedido', // Proposto e integrado imediatamente sem barreira de aprovação
      createdAt: new Date().toISOString(),
      isUserCreated: true
    };

    setFragments(prev => [newFragment, ...prev]);
    setSelectedFragmentId(uniqueId);
    setActiveTab('nexo'); // Takes them to view it on the map!
  };

  const handleEditFragment = (id: string, updatedData: Partial<Omit<WorldFragment, 'id' | 'createdAt' | 'status'>>) => {
    setFragments(prev => prev.map(f => 
      f.id === id ? { ...f, ...updatedData } : f
    ));
    setIsEditModalOpen(false);
    setFragmentToEdit(null);
  };

  const handleOpenEditModal = (fragment: WorldFragment) => {
    // Only allow editing if user created it
    if (fragment.isUserCreated) {
      setFragmentToEdit(fragment);
      setIsEditModalOpen(true);
    }
  };

  const handleUpdateStatus = (id: string, newStatus: StewardshipStatus) => {
    setFragments(prev => prev.map(f => 
      f.id === id ? { ...f, status: newStatus } : f
    ));
  };

  const handleSelectTerritory = (territoryId: string) => {
    setCurrentTerritory(territoryId);
  };

  const handleDeleteFragment = (id: string) => {
    // Only allow deletion if user created it
    const fragmentToDelete = fragments.find(f => f.id === id);
    if (fragmentToDelete && fragmentToDelete.isUserCreated) {
      if (confirm(`Tem certeza que deseja excluir "${fragmentToDelete.title}"?`)) {
        setFragments(prev => prev.filter(f => f.id !== id));
        if (selectedFragmentId === id) {
          setSelectedFragmentId(null);
        }
      }
    }
  };

  const handleResetData = () => {
    if (confirm('Tem certeza que deseja restaurar os fragmentos originais do Altiplano?')) {
      localStorage.removeItem('situated_memories');
      setFragments(INITIAL_FRAGMENTS);
      setSelectedFragmentId(null);
      setActiveTab('nexo');
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-background text-on-surface font-sans overflow-hidden antialiased relative">
      
      {/* Background celestial grid */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-surface-container-high/15 via-background to-background pointer-events-none opacity-80" />

      {/* Primary Top Header Bar containing platform label, notifications, and profile */}
      <HeaderBar currentTerritory={currentTerritory} />

      {/* Main Structural Body */}
      <div className="flex-1 w-full flex overflow-hidden z-10">
        
        {/* Left Drawer Menu Bar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onOpenModal={() => setIsProposalModalOpen(true)}
          currentTerritory={currentTerritory}
        />

        {/* Content Panel Area */}
        <main className="flex-1 h-full overflow-y-auto relative flex flex-col bg-surface-container-lowest/15">
          
          {/* TAB 1: CONSTELLATION MAP (Nexo) */}
          {activeTab === 'nexo' && (
            <div className="w-full h-full flex flex-col animate-in fade-in duration-300 relative">
              {/* Map Canvas Component */}
              <div className="flex-1 relative">
                <CanvasMap 
                  fragments={fragments} 
                  selectedId={selectedFragmentId}
                  onSelectNode={setSelectedFragmentId}
                  savedFragmentIds={savedFragmentIds}
                  onToggleSaveFragment={handleToggleSaveFragment}
                />
              </div>
            </div>
          )}

          {/* TAB 2: STEWARD AUDITS (Zelo) */}
          {activeTab === 'zelo' && (
            <ZeloTab 
              fragments={fragments} 
              onUpdateFragmentStatus={handleUpdateStatus} 
              currentTerritory={currentTerritory}
              onSelectTerritory={handleSelectTerritory}
              onSelectFragment={setSelectedFragmentId}
              setActiveTab={setActiveTab}
              savedFragmentIds={savedFragmentIds}
              onToggleSaveFragment={handleToggleSaveFragment}
              onOpenEditModal={handleOpenEditModal}
              onDeleteFragment={handleDeleteFragment}
            />
          )}

          {/* TAB 3: METHOD VALUES (Manifesto) */}
          {activeTab === 'manifesto' && (
            <ManifestoTab />
          )}

          {/* TAB 4: CONFIGURATIONS (Configurações) */}
          {activeTab === 'settings' && (
            <div className="p-8 space-y-6 max-w-2xl mx-auto animate-in fade-in duration-300">
              <div className="space-y-1 border-b border-[#dac2b8]/10 pb-4">
                <h2 className="font-serif text-2xl text-on-surface">Configurações do Sistema</h2>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Ajustes simples para o funcionamento da plataforma e dos dados locais.
                </p>
              </div>

              <div className="glass-panel border border-[#dac2b8]/15 rounded-xl p-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-on-surface">Restaurar Dados Originais</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Apaga todos os fragmentos criados por você e restaura os fragmentos originais de exemplo.
                  </p>
                  <button
                    onClick={handleResetData}
                    className="mt-2 px-4 py-2.5 bg-error/15 border border-error/30 text-error hover:bg-error/25 rounded-full text-xs font-semibold max-w-sm transition-colors cursor-pointer cursor-pointer shadow-md"
                  >
                    Restaurar Todos os Fragmentos
                  </button>
                </div>

                <div className="pt-4 border-t border-[#dac2b8]/10 space-y-2 text-xs">
                  <span className="font-semibold block text-on-surface">Sobre o Uso dos Fragmentos</span>
                  <p className="text-on-surface-variant/70 leading-relaxed font-sans">
                    Todos os fragmentos de mundo coletados na plataforma <strong>Vizinhanças</strong> são de propriedade comunitária dos próprios moradores. É proibida a cópia ou uso comercial desse acervo de fragmentos.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SUPPORT (Suporte) */}
          {activeTab === 'suporte' && (
            <div className="p-8 space-y-6 max-w-2xl mx-auto animate-in fade-in duration-300">
              <div className="space-y-1 border-b border-[#dac2b8]/10 pb-4">
                <h2 className="font-serif text-2xl text-on-surface">Canais de Suporte e Ajuda</h2>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Entre em contato conosco se precisar de ajuda ou quiser relatar algum problema.
                </p>
              </div>

              <div className="glass-panel border border-[#dac2b8]/15 rounded-xl p-6 space-y-4">
                <div className="space-y-2">
                  <span className="font-mono text-[10px] uppercase text-primary block font-semibold">Fale com os Organizadores</span>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Se você notar algum problema técnico na plataforma, algum erro em fragmento inserido ou quiser propor novos territórios, envie uma mensagem para nós pelo e-mail abaixo.
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-[#dac2b8]/10 text-xs font-mono space-y-1 text-on-surface-variant/60">
                  <p>Localização: Setor 7G de Vizinhanças</p>
                  <p>E-mail de Contato: biasoura04@gmail.com</p>
                  <p>Status do Sistema: ● Online e Estável</p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* FLOATING ACTION BUTTON */}
      <button 
        onClick={() => setIsProposalModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary hover:brightness-110 active:scale-95 text-on-primary flex items-center justify-center cursor-pointer shadow-2xl hover:rotate-90 transition-all z-30 font-semibold"
        title="Propor Novo Fragmento de Mundo"
      >
        <span className="material-symbols-outlined text-4xl leading-none select-none">add</span>
      </button>

      {/* Dynamic proposal modal handler */}
      <ProposalModal 
        isOpen={isProposalModalOpen} 
        onClose={() => setIsProposalModalOpen(false)}
        onSubmit={handleAddFragment}
        currentTerritory={currentTerritory}
      />

      {/* Dynamic edit fragment modal handler */}
      <EditFragmentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setFragmentToEdit(null);
        }}
        onSubmit={handleEditFragment}
        fragment={fragmentToEdit}
      />

    </div>
  );
}
