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
import { TERRITORIES } from './data';
import { ensureFixedMapPositions, findOpenMapPosition, getFragmentMapPosition } from './utils/constellationLayout';
import { isSupabaseConfigured, supabase, supabaseConfigError } from './lib/supabase';
import {
  createRemoteFragment,
  createRemoteTerritory,
  deleteRemoteFragment,
  loadLocalFragments,
  loadLocalSavedFragmentIds,
  loadLocalTerritories,
  loadRemoteFragments,
  loadRemoteSavedFragmentIds,
  loadRemoteTerritories,
  saveRemoteFragment,
  saveLocalTerritories,
  unsaveRemoteFragment,
  updateRemoteFragment,
} from './services/fragmentsRepository';

type AuthMode = 'signIn' | 'signUp';

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
  const [territories, setTerritories] = useState<Territory[]>(() => loadLocalTerritories());
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('signUp');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [dataStatus, setDataStatus] = useState(isSupabaseConfigured ? 'Conectando ao armazenamento online...' : 'Modo local');

  const isRemoteMode = isSupabaseConfigured && Boolean(supabase);
  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Ouvinte Atento';
  const getAuthRedirectUrl = () => `${window.location.origin}${window.location.pathname}`;

  const normalizeTerritoryName = (value: string) => value.trim().replace(/\s+/g, ' ');

  const findExistingTerritory = (name: string) => {
    const normalizedName = normalizeTerritoryName(name).toLocaleLowerCase('pt-BR');
    return territories.find((territory) => {
      const normalizedId = territory.id.toLocaleLowerCase('pt-BR');
      const normalizedDisplayName = territory.name.toLocaleLowerCase('pt-BR');
      return normalizedId === normalizedName || normalizedDisplayName === normalizedName;
    });
  };

  const ensureTerritoryForFragment = async (territoryValue: string) => {
    const territoryName = normalizeTerritoryName(territoryValue) || currentTerritory;
    const existingTerritory = findExistingTerritory(territoryName);
    if (existingTerritory) return existingTerritory;

    const newTerritory: Territory = {
      id: territoryName,
      name: territoryName,
      coordinates: '',
      createdAt: new Date().toISOString(),
    };

    if (isRemoteMode && user) {
      return createRemoteTerritory(newTerritory);
    }

    return newTerritory;
  };

  const upsertTerritoryState = (territory: Territory) => {
    setTerritories((prev) => {
      const exists = prev.some((item) => item.id === territory.id);
      return exists
        ? prev.map((item) => item.id === territory.id ? { ...item, ...territory } : item)
        : [...prev, territory].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    });
  };

  const getAuthErrorMessage = (error: unknown) => {
    const fallback = 'Tente novamente em alguns instantes.';
    if (!(error instanceof Error)) return fallback;

    if (error.message.includes('Invalid path specified in request URL')) {
      return 'Ha um problema na configuracao da conexao. Avise a equipe para revisar o ambiente.';
    }

    if (error.message.includes('Invalid login credentials')) {
      return 'E-mail ou senha incorretos.';
    }

    if (error.message.includes('User already registered')) {
      return 'Este e-mail ja tem cadastro. Use a aba Entrar.';
    }

    if (error.message.includes('Email not confirmed')) {
      return 'Confirme seu e-mail pelo link enviado antes de entrar.';
    }

    return error.message || fallback;
  };

  const resendSignupConfirmation = async (email: string) => {
    if (!supabase) return;

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: getAuthRedirectUrl(),
      },
    });

    if (error) throw error;
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

  useEffect(() => {
    if (!isRemoteMode) {
      saveLocalTerritories(territories);
    }
  }, [territories, isRemoteMode]);

  const refreshRemoteData = async (activeUser: User | null) => {
    const [remoteTerritories, remoteFragments, remoteSavedIds] = await Promise.all([
      loadRemoteTerritories(),
      loadRemoteFragments(activeUser),
      loadRemoteSavedFragmentIds(activeUser),
    ]);

    setTerritories(remoteTerritories);
    setFragments(remoteFragments);
    setSavedFragmentIds(remoteSavedIds);
    setDataStatus(activeUser ? 'Armazenamento online conectado' : 'Armazenamento online ativo: entre para contribuir');
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
        setDataStatus('Falha ao carregar dados online; usando dados locais');
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
        setAuthPassword('');
      }
      window.setTimeout(() => {
        refreshRemoteData(activeUser).catch((error) => {
          console.error(error);
          setDataStatus('Erro ao sincronizar a sessao');
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

  const handleAuthModeChange = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthMessage(null);
    setAuthError(null);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthMessage(null);
    setAuthError(null);
    setAuthPassword('');
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

    if (isRemoteMode && user) {
      try {
        const fragmentTerritory = await ensureTerritoryForFragment(newFragData.territory);
        const preparedFragment = {
          ...newFragData,
          territory: fragmentTerritory.id,
          mediaLinks: newFragData.mediaLinks?.slice(0, 3) ?? [],
          connectedFragmentIds: newFragData.connectedFragmentIds?.slice(0, 5) ?? [],
          isOpenToConnections: newFragData.isOpenToConnections ?? false,
          mapPosition,
        };
        const createdFragment = await createRemoteFragment(preparedFragment, uniqueId, user);
        upsertTerritoryState(fragmentTerritory);
        setFragments(prev => ensureFixedMapPositions([createdFragment, ...prev]));
        setSelectedFragmentId(createdFragment.id);
        setCurrentTerritory(fragmentTerritory.id);
        setActiveTab('nexo');
      } catch (error) {
        console.error(error);
        alert('Nao foi possivel publicar o fragmento agora.');
      }
      return;
    }

    const fragmentTerritory = await ensureTerritoryForFragment(newFragData.territory);
    const preparedFragment = {
      ...newFragData,
      territory: fragmentTerritory.id,
      mediaLinks: newFragData.mediaLinks?.slice(0, 3) ?? [],
      connectedFragmentIds: newFragData.connectedFragmentIds?.slice(0, 5) ?? [],
      isOpenToConnections: newFragData.isOpenToConnections ?? false,
      mapPosition,
    };

    upsertTerritoryState(fragmentTerritory);
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
    setCurrentTerritory(fragmentTerritory.id);
    setActiveTab('nexo'); // Takes them to view it on the map!
  };

  const handleEditFragment = async (id: string, updatedData: Partial<Omit<WorldFragment, 'id' | 'createdAt'>>) => {
    if (isRemoteMode && user) {
      try {
        const fragmentTerritory = updatedData.territory
          ? await ensureTerritoryForFragment(updatedData.territory)
          : null;
        const preparedData = {
          ...updatedData,
          ...(fragmentTerritory ? { territory: fragmentTerritory.id } : {}),
          mediaLinks: updatedData.mediaLinks?.slice(0, 3),
          connectedFragmentIds: updatedData.connectedFragmentIds?.slice(0, 5),
        };
        const updatedFragment = await updateRemoteFragment(id, preparedData, user);
        if (fragmentTerritory) {
          upsertTerritoryState(fragmentTerritory);
          setCurrentTerritory(fragmentTerritory.id);
        }
        setFragments(prev => prev.map(f => 
          f.id === id ? updatedFragment : f
        ));
        setIsEditModalOpen(false);
        setFragmentToEdit(null);
      } catch (error) {
        console.error(error);
        alert('Nao foi possivel editar o fragmento agora.');
      }
      return;
    }

    const fragmentTerritory = updatedData.territory
      ? await ensureTerritoryForFragment(updatedData.territory)
      : null;
    const preparedData = {
      ...updatedData,
      ...(fragmentTerritory ? { territory: fragmentTerritory.id } : {}),
      mediaLinks: updatedData.mediaLinks?.slice(0, 3),
      connectedFragmentIds: updatedData.connectedFragmentIds?.slice(0, 5),
    };

    if (fragmentTerritory) {
      upsertTerritoryState(fragmentTerritory);
      setCurrentTerritory(fragmentTerritory.id);
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
        alert('Nao foi possivel excluir o fragmento agora.');
        return;
      }
    }

    setFragments(prev => prev
      .filter(f => f.id !== deletedId)
      .map(f => ({
        ...f,
        connectedFragmentIds: f.connectedFragmentIds?.filter(id => id !== deletedId),
      })));
    setSavedFragmentIds(prev => prev.filter(id => id !== deletedId));
    if (selectedFragmentId === deletedId) {
      setSelectedFragmentId(null);
    }
    setFragmentToDelete(null);
    setDeletedFragmentTitle(deletedTitle);
  };

  const handleResetData = () => {
    if (isRemoteMode) {
      alert('No modo online, a limpeza dos fragmentos precisa ser feita pela equipe tecnica.');
      return;
    }

    if (confirm('Tem certeza que deseja limpar todos os fragmentos locais?')) {
      localStorage.removeItem('situated_memories');
      localStorage.removeItem('saved_fragment_ids');
      localStorage.removeItem('vizinhancas_territories');
      setTerritories(TERRITORIES);
      setFragments([]);
      setSavedFragmentIds([]);
      setSelectedFragmentId(null);
      setActiveTab('nexo');
    }
  };

  const handleAuthSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase || !authEmail.trim() || !authPassword) return;
    const email = authEmail.trim();

    if (authMode === 'signUp' && !authName.trim()) {
      setAuthError('Informe seu nome para criar o cadastro.');
      return;
    }

    setAuthMessage(null);
    setAuthError(null);
    setIsAuthSubmitting(true);
    try {
      if (authMode === 'signUp') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: authPassword,
          options: {
            emailRedirectTo: getAuthRedirectUrl(),
            data: {
              display_name: authName.trim(),
            },
          },
        });

        if (error) throw error;
        if (data.session) {
          setAuthMessage('Cadastro criado. Voce ja esta conectado.');
          return;
        }

        if (data.user?.identities && data.user.identities.length === 0) {
          setAuthMode('signIn');
          setAuthError('Este e-mail ja tem cadastro. Use a aba Entrar com a senha cadastrada.');
          return;
        }

        if (data.user) {
          await resendSignupConfirmation(email);
          setAuthMode('signIn');
          setAuthMessage('Cadastro criado. Enviamos um link de confirmacao para seu e-mail; depois de confirmar, volte aqui e entre com sua senha.');
          return;
        }

        throw new Error('Nao foi possivel confirmar o cadastro agora.');
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: authPassword,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          await resendSignupConfirmation(email);
          setAuthMessage('Seu cadastro ainda precisa de confirmacao. Reenviamos o link para seu e-mail.');
          return;
        }

        throw error;
      }
      setAuthMessage('Entrada realizada.');
    } catch (error) {
      console.error(error);
      const errorMessage = getAuthErrorMessage(error);
      setAuthError(`Nao foi possivel concluir o acesso. ${errorMessage}`);
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleResendAuthConfirmation = async () => {
    if (!supabase || !authEmail.trim()) return;

    setAuthMessage(null);
    setAuthError(null);
    setIsAuthSubmitting(true);
    try {
      await resendSignupConfirmation(authEmail.trim());
      setAuthMode('signIn');
      setAuthMessage('Reenviamos o link de confirmacao para seu e-mail.');
    } catch (error) {
      console.error(error);
      const errorMessage = getAuthErrorMessage(error);
      setAuthError(`Nao foi possivel reenviar a confirmacao. ${errorMessage}`);
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setAuthPassword('');
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-background text-on-surface font-sans overflow-hidden antialiased relative">
      
      {/* Background celestial grid */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-surface-container-high/15 via-background to-background pointer-events-none opacity-80" />

      {/* Primary Top Header Bar containing platform label and profile */}
      <HeaderBar
        currentTerritory={currentTerritory}
        displayName={displayName}
        authLabel={isRemoteMode ? (user ? 'Sessao ativa' : 'Entrar para contribuir') : 'Modo local'}
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
                  <h3 className="text-sm font-semibold text-on-surface">Conexao de dados</h3>
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
                        <button
                          type="button"
                          onClick={openAuthModal}
                          className="px-5 py-2.5 bg-primary text-on-primary hover:brightness-105 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Criar conta ou entrar com senha
                        </button>
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
                      {supabaseConfigError ?? 'Configure o ambiente para ativar o armazenamento online.'}
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
                  <h3 className="text-sm font-semibold text-on-surface">Limpar Dados Locais</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Apaga os fragmentos e salvamentos guardados neste navegador, mantendo apenas os territórios de base.
                  </p>
                  <button
                    onClick={handleResetData}
                    className="mt-2 px-4 py-2.5 bg-error/15 border border-error/30 text-error hover:bg-error/25 rounded-full text-xs font-semibold max-w-sm transition-colors cursor-pointer cursor-pointer shadow-md"
                  >
                    Limpar Fragmentos Locais
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

          {/* TAB 5: HELP (Ajuda) */}
          {activeTab === 'ajuda' && (
            <div className="p-8 space-y-6 max-w-3xl mx-auto animate-in fade-in duration-300">
              <div className="space-y-1 border-b border-[#dac2b8]/10 pb-4">
                <h2 className="font-serif text-2xl text-on-surface">Ajuda</h2>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Um guia rapido para entrar na plataforma, navegar pela constelacao e cuidar dos seus fragmentos.
                </p>
              </div>

              <div className="glass-panel border border-[#dac2b8]/15 rounded-xl p-6 space-y-5">
                <div className="space-y-2">
                  <span className="font-mono text-[10px] uppercase text-primary block font-semibold">Como funciona a plataforma</span>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Vizinhanças e um espaco para reunir fragmentos de mundo: registros sonoros, imagens, poemas, relatos e pequenos sinais da vida local. Cada fragmento pertence a um territorio e pode se aproximar de outros, formando uma constelacao de memorias, afetos e conexoes comunitarias.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      title: 'Explorar a constelacao',
                      text: 'Use o mapa para descobrir fragmentos, perceber aproximacoes entre eles e navegar pelos territorios disponiveis.',
                    },
                    {
                      title: 'Propor fragmentos',
                      text: 'Envie um registro visual, poetico ou sonoro. Voce pode indicar o territorio, contar a origem do fragmento e sugerir conexoes.',
                    },
                    {
                      title: 'Guardar descobertas',
                      text: 'Salve fragmentos importantes para voltar depois e acompanhar aquilo que mais conversa com o seu percurso.',
                    },
                    {
                      title: 'Cuidar do acervo',
                      text: 'Consulte a documentacao, leia o manifesto e acompanhe as orientacoes de zelo para manter o espaco coletivo organizado.',
                    },
                  ].map((item) => (
                    <div key={item.title} className="rounded-lg border border-[#dac2b8]/10 bg-surface-container-low/45 p-4 space-y-2">
                      <h3 className="text-sm font-semibold text-on-surface">{item.title}</h3>
                      <p className="text-xs text-on-surface-variant/75 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-[#dac2b8]/10 space-y-3">
                  <span className="font-mono text-[10px] uppercase text-primary block font-semibold">Primeiros passos</span>
                  <ol className="space-y-2 text-xs text-on-surface-variant leading-relaxed list-decimal list-inside">
                    <li>Comece pela Constelacao para ver como os fragmentos estao distribuidos no mapa.</li>
                    <li>Abra um fragmento para ler seu conteudo, entender seu territorio e observar suas conexoes.</li>
                    <li>Use Propor Fragmento quando quiser acrescentar uma lembranca, imagem, som ou texto ao acervo.</li>
                    <li>Visite Documentacao e Manifesto para entender as regras de cuidado, autoria e uso comunitario.</li>
                  </ol>
                </div>
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
        territories={territories}
        fragments={fragments}
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
        fragments={fragments}
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
        mode={authMode}
        name={authName}
        email={authEmail}
        password={authPassword}
        isSubmitting={isAuthSubmitting}
        message={authMessage}
        error={authError}
        onModeChange={handleAuthModeChange}
        onNameChange={setAuthName}
        onEmailChange={setAuthEmail}
        onPasswordChange={setAuthPassword}
        onClose={closeAuthModal}
        onSubmit={handleAuthSubmit}
        onResendConfirmation={handleResendAuthConfirmation}
      />

    </div>
  );
}
