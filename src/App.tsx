import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import Sidebar from './components/Sidebar';
import HeaderBar from './components/HeaderBar';
import CanvasMap from './components/CanvasMap';
import ProposalModal from './components/ProposalModal';
import EditFragmentModal from './components/EditFragmentModal';
import DeleteFragmentModal from './components/DeleteFragmentModal';
import FragmentDeletedToast from './components/FragmentDeletedToast';
import AuthModal from './components/AuthModal';

import ManifestoTab from './components/tabs/ManifestoTab';
import ZeloTab from './components/tabs/ZeloTab';

import { ActiveTab, Territory, WorldFragment } from './types';
import { INITIAL_FRAGMENTS, TERRITORIES } from './data';
import { ensureFixedMapPositions, findOpenMapPosition, getFragmentMapPosition } from './utils/constellationLayout';
import { isSupabaseConfigured, supabase, supabaseConfigError } from './lib/supabase';
import {
  createRemoteFragment,
  deleteRemoteFragment,
  loadLocalFragments,
  loadLocalSavedFragmentIds,
  loadRemoteFragments,
  loadRemoteSavedFragmentIds,
  loadRemoteTerritories,
  saveRemoteFragment,
  unsaveRemoteFragment,
  updateRemoteFragment,
} from './services/fragmentsRepository';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('nexo'); // Defaulting to the map step
  const [currentTerritory, setCurrentTerritory] = useState<string>('Setor 7G');
  const [selectedFragmentId, setSelectedFragmentId] = useState<string | null>(null);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [fragmentToEdit, setFragmentToEdit] = useState<WorldFragment | null>(null);
  const [fragmentToDelete, setFragmentToDelete] = useState<WorldFragment | null>(null);
  const [deletedFragmentTitle, setDeletedFragmentTitle] = useState<string | null>(null);
  const [fragments, setFragments] = useState<WorldFragment[]>(() => loadLocalFragments());
  const [savedFragmentIds, setSavedFragmentIds] = useState<string[]>(() => loadLocalSavedFragmentIds());
  const [territories, setTerritories] = useState<Territory[]>(TERRITORIES);
  const [user, setUser] = useState<User | null>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [dataStatus, setDataStatus] = useState(isSupabaseConfigured ? 'Conectando ao Supabase...' : 'Modo local');

  const isRemoteMode = isSupabaseConfigured && Boolean(supabase);
  const displayName = user?.email?.split('@')[0] || 'Ouvinte Atento';
  const getAuthErrorMessage = (error: unknown) => {
    const fallback = 'Tente novamente em alguns instantes.';
    if (!(error instanceof Error)) return fallback;

    if (error.message.includes('Invalid path specified in request URL')) {
      return 'Confira se VITE_SUPABASE_URL esta usando a URL raiz do projeto Supabase, sem /auth/v1 ou outros caminhos.';
    }

    return error.message || fallback;
  };

  useEffect(() => {
    if (!isRemoteMode) {
      localStorage.setItem('situated_memories', JSON.stringify(fragments));
    }
  }, [fragments, isRemoteMode]);

  useEffect(() => {
    if (!isRemoteMode) {
      localStorage.setItem('saved_fragment_ids', JSON.stringify(savedFragmentIds));
    }
  }, [savedFragmentIds, isRemoteMode]);

  const refreshRemoteData = async (activeUser: User | null) => {
    const [remoteTerritories, remoteFragments, remoteSavedIds] = await Promise.all([
      loadRemoteTerritories(),
      loadRemoteFragments(activeUser),
      loadRemoteSavedFragmentIds(activeUser),
    ]);

    setTerritories(remoteTerritories);
    setFragments(remoteFragments);
    setSavedFragmentIds(remoteSavedIds);
    setDataStatus(activeUser ? 'Conectado ao Supabase' : 'Supabase conectado: entre para contribuir');
  };

  useEffect(() => {
    if (!isRemoteMode || !supabase) return;

    let isMounted = true;

    const bootRemoteData = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const activeUser = data.session?.user ?? null;
        if (!isMounted) return;
        setUser(activeUser);
        await refreshRemoteData(activeUser);
      } catch (error) {
        console.error(error);
        if (!isMounted) return;
        setDataStatus('Falha ao carregar Supabase; usando dados locais');
        setTerritories(TERRITORIES);
        setFragments(loadLocalFragments());
        setSavedFragmentIds(loadLocalSavedFragmentIds());
      }
    };

    bootRemoteData();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const activeUser = session?.user ?? null;
      setUser(activeUser);
      if (activeUser) {
        setIsAuthModalOpen(false);
        setAuthMessage(null);
        setAuthError(null);
      }
      window.setTimeout(() => {
        refreshRemoteData(activeUser).catch((error) => {
          console.error(error);
          setDataStatus('Erro ao sincronizar sessão Supabase');
        });
      }, 0);
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [isRemoteMode]);

  useEffect(() => {
    if (!deletedFragmentTitle) return;

    const toastTimeout = window.setTimeout(() => {
      setDeletedFragmentTitle(null);
    }, 4000);

    return () => window.clearTimeout(toastTimeout);
  }, [deletedFragmentTitle]);

  const openAuthModal = () => {
    if (!isRemoteMode) return;
    setAuthMessage(null);
    setAuthError(null);
    setIsAuthModalOpen(true);
  };

  const handleOpenProposalFlow = () => {
    if (isRemoteMode && !user) {
      openAuthModal();
      return;
    }

    setIsProposalModalOpen(true);
  };

  const handleToggleSaveFragment = async (id: string) => {
    if (isRemoteMode) {
      if (!user) {
        openAuthModal();
        return;
      }

      const isSaved = savedFragmentIds.includes(id);
      try {
        if (isSaved) {
          await unsaveRemoteFragment(id, user);
          setSavedFragmentIds(prev => prev.filter(x => x !== id));
        } else {
          await saveRemoteFragment(id, user);
          setSavedFragmentIds(prev => [...prev, id]);
        }
      } catch (error) {
        console.error(error);
        alert('Não foi possível atualizar o acervo salvo agora.');
      }
      return;
    }

    setSavedFragmentIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleAddFragment = async (newFragData: Omit<WorldFragment, 'id' | 'createdAt'>) => {
    if (isRemoteMode && !user) {
      openAuthModal();
      return;
    }

    const uniqueId = `frag-${Date.now()}`;
    const mapPosition = findOpenMapPosition(fragments.map(getFragmentMapPosition));
    const preparedFragment = {
      ...newFragData,
      mediaLinks: newFragData.mediaLinks?.slice(0, 3) ?? [],
      mapPosition,
    };

    if (isRemoteMode && user) {
      try {
        const createdFragment = await createRemoteFragment(preparedFragment, uniqueId, user);
        setFragments(prev => ensureFixedMapPositions([createdFragment, ...prev]));
        setSelectedFragmentId(createdFragment.id);
        setActiveTab('nexo');
      } catch (error) {
        console.error(error);
        alert('Não foi possível publicar o fragmento no Supabase.');
      }
      return;
    }

    setFragments(prev => {
      const newFragment: WorldFragment = {
        ...preparedFragment,
        id: uniqueId,
        createdAt: new Date().toISOString(),
        isUserCreated: true
      };

      return [newFragment, ...prev];
    });
    setSelectedFragmentId(uniqueId);
    setActiveTab('nexo'); // Takes them to view it on the map!
  };

  const handleEditFragment = async (id: string, updatedData: Partial<Omit<WorldFragment, 'id' | 'createdAt'>>) => {
    const preparedData = {
      ...updatedData,
      mediaLinks: updatedData.mediaLinks?.slice(0, 3),
    };

    if (isRemoteMode && user) {
      try {
        const updatedFragment = await updateRemoteFragment(id, preparedData, user);
        setFragments(prev => prev.map(f => 
          f.id === id ? updatedFragment : f
        ));
        setIsEditModalOpen(false);
        setFragmentToEdit(null);
      } catch (error) {
        console.error(error);
        alert('Não foi possível editar o fragmento no Supabase.');
      }
      return;
    }

    setFragments(prev => prev.map(f => 
      f.id === id ? { ...f, ...preparedData } : f
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

  const handleDeleteFragment = (id: string) => {
    // Only allow deletion if user created it
    const fragment = fragments.find(f => f.id === id);
    if (fragment && fragment.isUserCreated) {
      setFragmentToDelete(fragment);
    }
  };

  const handleConfirmDeleteFragment = async () => {
    if (!fragmentToDelete) return;

    const deletedId = fragmentToDelete.id;
    const deletedTitle = fragmentToDelete.title;

    if (isRemoteMode) {
      try {
        await deleteRemoteFragment(deletedId);
      } catch (error) {
        console.error(error);
        alert('Não foi possível excluir o fragmento no Supabase.');
        return;
      }
    }

    setFragments(prev => prev.filter(f => f.id !== deletedId));
    setSavedFragmentIds(prev => prev.filter(id => id !== deletedId));
    if (selectedFragmentId === deletedId) {
      setSelectedFragmentId(null);
    }
    setFragmentToDelete(null);
    setDeletedFragmentTitle(deletedTitle);
  };

  const handleResetData = () => {
    if (isRemoteMode) {
      alert('No modo Supabase, restaure os dados executando o seed do projeto no painel ou CLI do Supabase.');
      return;
    }

    if (confirm('Tem certeza que deseja restaurar os fragmentos originais do Altiplano?')) {
      localStorage.removeItem('situated_memories');
      setFragments(ensureFixedMapPositions(INITIAL_FRAGMENTS));
      setSelectedFragmentId(null);
      setActiveTab('nexo');
    }
  };

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase || !authEmail.trim()) return;

    setAuthMessage(null);
    setAuthError(null);
    setIsAuthSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: authEmail.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}${window.location.pathname}`,
          shouldCreateUser: true,
        },
      });

      if (error) throw error;
      setAuthMessage('Enviamos um link de acesso para seu e-mail. Abra o link nesta mesma janela para concluir a entrada.');
    } catch (error) {
      console.error(error);
      const errorMessage = getAuthErrorMessage(error);
      setAuthError(`Não foi possível enviar o link de acesso. ${errorMessage}`);
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-background text-on-surface font-sans overflow-hidden antialiased relative">
      
      {/* Background celestial grid */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-surface-container-high/15 via-background to-background pointer-events-none opacity-80" />

      {/* Primary Top Header Bar containing platform label and profile */}
      <HeaderBar
        currentTerritory={currentTerritory}
        displayName={displayName}
        authLabel={isRemoteMode ? (user ? 'Sessão Supabase' : 'Entrar para contribuir') : 'Modo local'}
        isAuthenticated={!isRemoteMode || Boolean(user)}
        onAuthClick={openAuthModal}
      />

      {/* Main Structural Body */}
      <div className="flex-1 w-full flex overflow-hidden z-10">
        
        {/* Left Drawer Menu Bar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onOpenModal={handleOpenProposalFlow}
          currentTerritory={currentTerritory}
          displayName={displayName}
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
                  territories={territories}
                />
              </div>
            </div>
          )}

          {/* TAB 2: STEWARD AUDITS (Zelo) */}
          {activeTab === 'zelo' && (
            <ZeloTab 
              fragments={fragments} 
              onSelectFragment={setSelectedFragmentId}
              setActiveTab={setActiveTab}
              savedFragmentIds={savedFragmentIds}
              onToggleSaveFragment={handleToggleSaveFragment}
              onOpenEditModal={handleOpenEditModal}
              onDeleteFragment={handleDeleteFragment}
              isAuthenticated={!isRemoteMode || Boolean(user)}
              onRequireAuth={openAuthModal}
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
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-on-surface">Conexão Supabase</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {dataStatus}
                  </p>
                  {isRemoteMode ? (
                    user ? (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <span className="text-xs text-on-surface-variant font-mono">{user.email}</span>
                        <button
                          onClick={handleSignOut}
                          className="px-4 py-2 bg-surface-container border border-[#dac2b8]/20 text-on-surface hover:bg-surface-container-high rounded-full text-xs font-semibold max-w-sm transition-colors cursor-pointer"
                        >
                          Sair
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <form onSubmit={handleSignIn} className="flex flex-col sm:flex-row gap-3">
                          <input
                            type="email"
                            value={authEmail}
                            onChange={(event) => setAuthEmail(event.target.value)}
                            placeholder="seu-email@exemplo.com"
                            className="flex-1 bg-surface-container-low/60 rounded-full border border-[#dac2b8]/20 px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                          />
                          <button
                            type="submit"
                            disabled={isAuthSubmitting}
                            className="px-5 py-2.5 bg-primary text-on-primary hover:brightness-105 rounded-full text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                          >
                            {isAuthSubmitting ? 'Enviando...' : 'Entrar por e-mail'}
                          </button>
                        </form>
                        {authMessage && (
                          <p className="text-xs leading-relaxed text-secondary bg-secondary/10 border border-secondary/15 rounded-xl px-4 py-3">
                            {authMessage}
                          </p>
                        )}
                        {authError && (
                          <p className="text-xs leading-relaxed text-error bg-error/10 border border-error/15 rounded-xl px-4 py-3">
                            {authError}
                          </p>
                        )}
                      </div>
                    )
                  ) : (
                    <p className="text-xs text-on-surface-variant/70 leading-relaxed">
                      {supabaseConfigError ?? 'Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para ativar armazenamento remoto.'}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-[#dac2b8]/10 space-y-2">
                  <h3 className="text-sm font-semibold text-on-surface">Territórios Carregados</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {territories.length} territórios disponíveis para a constelação e seus filtros.
                  </p>
                </div>

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
        onClick={handleOpenProposalFlow}
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

      <DeleteFragmentModal
        isOpen={fragmentToDelete !== null}
        fragment={fragmentToDelete}
        onCancel={() => setFragmentToDelete(null)}
        onConfirm={handleConfirmDeleteFragment}
      />

      <FragmentDeletedToast
        fragmentTitle={deletedFragmentTitle}
        onClose={() => setDeletedFragmentTitle(null)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        email={authEmail}
        isSubmitting={isAuthSubmitting}
        message={authMessage}
        error={authError}
        onEmailChange={setAuthEmail}
        onClose={() => setIsAuthModalOpen(false)}
        onSubmit={handleSignIn}
      />

    </div>
  );
}
