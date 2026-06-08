import { useState } from 'react';
import { WorldFragment } from '../../types';
import { 
  Database, 
  Sprout,
  Volume2,
  FileText,
  Image as ImageIcon,
  ArrowUpRight,
  Bookmark,
  Edit,
  Trash2,
  Lock
} from 'lucide-react';

interface ZeloTabProps {
  fragments: WorldFragment[];
  onSelectFragment?: (id: string) => void;
  setActiveTab?: (tab: any) => void;
  savedFragmentIds?: string[];
  onToggleSaveFragment?: (id: string) => void;
  onOpenEditModal?: (fragment: WorldFragment) => void;
  onDeleteFragment?: (id: string) => void;
  isAuthenticated?: boolean;
  onRequireAuth?: () => void;
}

export default function ZeloTab({ 
  fragments, 
  onSelectFragment,
  setActiveTab,
  savedFragmentIds = [],
  onToggleSaveFragment,
  onOpenEditModal,
  onDeleteFragment,
  isAuthenticated = true,
  onRequireAuth
}: ZeloTabProps) {
  
  const [zeloSubTab, setZeloSubTab] = useState<'meus-fragmentos' | 'salvos'>('meus-fragmentos');
  
  // User created registered fragments
  const userRegisteredFragments = fragments.filter(f => f.isUserCreated === true);

  // Saved fragments from other communities/authors (id in saved list and not user created)
  const savedFragments = fragments.filter(f => savedFragmentIds.includes(f.id) && f.isUserCreated !== true);

  // Stats calculations
  const totalSecured = fragments.length;

  if (!isAuthenticated) {
    return (
      <div className="w-full h-full flex items-center justify-center px-4 py-10 animate-in fade-in duration-300">
        <div className="w-full max-w-xl border border-dashed border-[#dac2b8]/20 rounded-2xl p-10 text-center space-y-5 bg-[#0a1120]/45">
          <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-light text-on-surface">Documentação disponível para contribuintes</h2>
            <p className="text-sm text-on-surface-variant/75 leading-relaxed max-w-md mx-auto">
              Entre para propor fragmentos, cuidar dos seus registros e acessar seu acervo salvo.
            </p>
          </div>
          <button
            type="button"
            onClick={onRequireAuth}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-on-primary hover:brightness-105 rounded-full text-sm font-semibold transition-all cursor-pointer"
          >
            <Sprout className="w-4 h-4" />
            Entrar para contribuir
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 space-y-10 animate-in fade-in duration-300">
      
      {/* Header Panel */}
      <div className="space-y-2 border-b border-[#dac2b8]/10 pb-5">
        <h2 className="font-serif text-3xl font-light text-on-surface">Documentação de Fragmentos</h2>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Gerencie seus fragmentos registrados e mantenha por perto as referências comunitárias salvas para consulta posterior.
        </p>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="glass-panel border border-[#dac2b8]/15 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-secondary/15 rounded-xl border border-secondary/20 flex items-center justify-center text-secondary shrink-0">
            <Database className="w-5 h-5 animate-pulse-slow" />
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase text-on-surface-variant/60 block font-semibold">Acervo de Fragmentos</span>
            <span className="font-serif text-2xl text-on-surface tracking-wide">{totalSecured} Registrados</span>
          </div>
        </div>

        <div className="glass-panel border border-[#dac2b8]/15 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/15 rounded-xl border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase text-on-surface-variant/60 block font-semibold">Fragmentos Próprios</span>
            <span className="font-serif text-2xl text-on-surface tracking-wide">{userRegisteredFragments.length} Seus</span>
          </div>
        </div>

      </div>

      {/* Aesthetic sub-navigation for tabs inside document section */}
      <div className="flex border-b border-[#dac2b8]/10 select-none">
        <button
          onClick={() => setZeloSubTab('meus-fragmentos')}
          className={`px-5 py-3 font-sans text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer relative flex items-center gap-2 ${
            zeloSubTab === 'meus-fragmentos' 
              ? 'text-primary' 
              : 'text-on-surface-variant/60 hover:text-on-surface hover:bg-[#dac2b8]/5'
          }`}
        >
          Meus Fragmentos Registrados
          <span className="bg-primary/20 text-primary border border-primary/20 text-[9px] px-1.5 py-0.2 rounded-full font-sans">
            {userRegisteredFragments.length}
          </span>
          {zeloSubTab === 'meus-fragmentos' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => setZeloSubTab('salvos')}
          className={`px-5 py-3 font-sans text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer relative flex items-center gap-2 ${
            zeloSubTab === 'salvos' 
              ? 'text-primary' 
              : 'text-on-surface-variant/60 hover:text-on-surface hover:bg-[#dac2b8]/5'
          }`}
        >
          Acervo Salvo (Outros)
          <span className="bg-[#ffb596]/15 border border-[#ffb596]/15 text-[#ffb596] text-[9px] px-1.5 py-0.2 rounded-full font-sans">
            {savedFragments.length}
          </span>
          {zeloSubTab === 'salvos' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      </div>

      {/* SUB TAB: USER REGISTERED FRAGMENTS */}
      {zeloSubTab === 'meus-fragmentos' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-2xl text-on-surface flex items-center gap-2">
                <Sprout className="w-6 h-6 text-emerald-400" />
                Meus Fragmentos Registrados
              </h3>
              <p className="text-xs text-on-surface-variant max-w-xl font-sans mt-0.5">
                Overview de todos os fragmentos de mundo propostos e publicados por você na comunidade.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userRegisteredFragments.length > 0 ? (
              userRegisteredFragments.map((f) => (
                <div 
                  key={f.id}
                  className="glass-panel border border-[#dac2b8]/20 rounded-2xl p-6 space-y-4 bg-[#0a1120]/60 flex flex-col justify-between"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-[8px] uppercase tracking-wider bg-[#10b981]/15 text-emerald-400 border border-emerald-500/25 px-2.5 py-0.5 rounded-full font-semibold">
                        {f.type === 'audio' ? 'Fragmento Sonoro' : f.type === 'visual' ? 'Fragmento Visual' : 'Fragmento Textual'}
                      </span>
                      <span className="text-[9px] font-mono text-on-surface-variant/40 shrink-0 select-text">Bairro: {f.territory}</span>
                    </div>

                    <div>
                      <h4 className="font-serif text-lg font-light text-on-surface leading-snug">{f.title}</h4>
                      <p className="text-[10px] font-mono text-on-surface-variant/40 mt-0.5">Registrado por: {f.source}</p>
                    </div>

                    <p className="text-xs text-on-surface-variant leading-relaxed select-text font-sans italic">
                      "{f.content}"
                    </p>
                    
                  </div>

                  <div className="pt-4 mt-2 border-t border-[#dac2b8]/10 flex items-center justify-between">
                    <span className="font-mono text-[9px] text-on-surface-variant/40">Inserido em {new Date(f.createdAt).toLocaleDateString()}</span>
                    <div className="flex items-center gap-2">
                      {onOpenEditModal && (
                        <button 
                          onClick={() => onOpenEditModal(f)}
                          className="px-4 py-1.5 bg-secondary/10 border border-secondary/25 hover:bg-secondary/20 text-secondary hover:text-secondary-bright text-xs font-semibold rounded-full flex items-center gap-1 cursor-pointer transition-all font-sans"
                        >
                          <Edit className="w-3 h-3" />
                          Editar
                        </button>
                      )}
                      {onDeleteFragment && (
                        <button 
                          onClick={() => onDeleteFragment(f.id)}
                          className="px-4 py-1.5 bg-error/10 border border-error/25 hover:bg-error/20 text-error hover:text-error-bright text-xs font-semibold rounded-full flex items-center gap-1 cursor-pointer transition-all font-sans"
                        >
                          <Trash2 className="w-3 h-3" />
                          Excluir
                        </button>
                      )}
                      {onSelectFragment && setActiveTab && (
                        <button 
                          onClick={() => {
                            onSelectFragment(f.id);
                            setActiveTab('nexo');
                          }}
                          className="px-4 py-1.5 bg-primary/10 border border-primary/25 hover:bg-primary/20 text-primary hover:text-primary-bright text-xs font-semibold rounded-full flex items-center gap-1 cursor-pointer transition-all font-sans"
                        >
                          Navegar Fragmento
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="md:col-span-2 border border-dashed border-[#dac2b8]/15 rounded-2xl p-12 text-center space-y-4">
                <Sprout className="w-10 h-10 text-emerald-400/40 mx-auto animate-pulse" />
                <p className="font-serif text-lg text-on-surface">Seu acervo de fragmentos está vazio</p>
                <p className="text-xs text-on-surface-variant/70 leading-relaxed max-w-sm mx-auto font-sans">
                  Você ainda não cadastrou nenhum fragmento de mundo na constelação. Clique no botão de mais "+" flutuante abaixo para registrar seu primeiro fragmento!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB TAB: SAVED DECOY COMMUNITIES FRAGMENTS (Acesso aos fragmentos salvos) */}
      {zeloSubTab === 'salvos' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <h3 className="font-serif text-2xl text-on-surface flex items-center gap-2">
              <Bookmark className="w-6 h-6 text-[#ffb596] fill-[#ffb596]/10" />
              Acervo Salvo de Outros Territórios
            </h3>
            <p className="text-xs text-on-surface-variant max-w-xl font-sans mt-0.5">
              Suas referências salvas de outros setores e subdivisões da comunidade para consulta e escuta posterior.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedFragments.length > 0 ? (
              savedFragments.map((f) => (
                <div 
                  key={f.id}
                  className="glass-panel border border-[#dac2b8]/15 rounded-2xl p-6 space-y-4 bg-[#0a1120]/40 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded bg-surface-container/30 flex items-center justify-center text-on-surface-variant border border-[#dac2b8]/10 shrink-0">
                          {f.type === 'audio' && <Volume2 className="w-3.5 h-3.5 text-blue-400" />}
                          {f.type === 'poetic' && <FileText className="w-3.5 h-3.5 text-emerald-400" />}
                          {f.type === 'visual' && <ImageIcon className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60 font-semibold select-none">
                          {f.type === 'audio' ? 'Fragmento Sonoro' : f.type === 'visual' ? 'Fragmento Visual' : 'Fragmento Textual'} • {f.territory}
                        </span>
                      </div>
                      
                      {onToggleSaveFragment && (
                        <button
                          onClick={() => onToggleSaveFragment(f.id)}
                          className="text-on-surface-variant/40 hover:text-error hover:bg-error/10 p-1.5 rounded-full transition-all cursor-pointer border border-transparent hover:border-error/20"
                          title="Remover dos salvos"
                        >
                          <Bookmark className="w-4 h-4 fill-[#ffb596] text-[#ffb596] hover:fill-none hover:text-on-surface-variant" />
                        </button>
                      )}
                    </div>

                    <div>
                      <h4 className="font-serif text-lg font-light text-on-surface">{f.title}</h4>
                      <p className="text-[10px] font-mono text-on-surface-variant/40">Origem: {f.source}</p>
                    </div>

                    <p className="text-xs text-on-surface-variant leading-relaxed select-text font-sans">
                      {f.content}
                    </p>
                  </div>

                  <div className="pt-4 mt-2 border-t border-[#dac2b8]/10 flex items-center justify-end">
                    {onSelectFragment && setActiveTab && (
                      <button 
                        onClick={() => {
                          onSelectFragment(f.id);
                          setActiveTab('nexo');
                        }}
                        className="px-4 py-2 bg-[#ffb596]/10 border border-[#ffb596]/20 hover:bg-[#ffb596]/20 text-[#ffb596] text-xs font-semibold rounded-full flex items-center gap-1.5 cursor-pointer transition-all font-sans"
                      >
                        Navegar na Constelação
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="md:col-span-2 border border-dashed border-[#dac2b8]/15 rounded-2xl p-12 text-center space-y-4">
                <Bookmark className="w-10 h-10 text-on-surface-variant/20 mx-auto" />
                <p className="font-serif text-lg text-on-surface">Nenhum fragmento salvo</p>
                <p className="text-xs text-on-surface-variant/70 leading-relaxed max-w-sm mx-auto font-sans">
                  Quando estiver navegando pela Constelação, abra o card de qualquer fragmento de mundo e salve-o para colecioná-los aqui neste acervo.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
