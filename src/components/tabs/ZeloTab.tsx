import { useState } from 'react';
import { WorldFragment, StewardshipStatus } from '../../types';
import { TERRITORIES } from '../../data';
import { 
  ShieldCheck, 
  MapPin, 
  Eye, 
  Activity, 
  Database, 
  GitCommit,
  UserCheck2,
  CheckCircle,
  Sprout,
  Volume2,
  FileText,
  Image as ImageIcon,
  ArrowUpRight,
  Bookmark,
  Plus
} from 'lucide-react';
import FragmentViewer from '../../components/FragmentViewer';

interface ZeloTabProps {
  fragments: WorldFragment[];
  onUpdateFragmentStatus: (id: string, status: StewardshipStatus) => void;
  currentTerritory: string;
  onSelectTerritory: (territoryId: string) => void;
  onSelectFragment?: (id: string) => void;
  setActiveTab?: (tab: any) => void;
  savedFragmentIds?: string[];
  onToggleSaveFragment?: (id: string) => void;
}

export default function ZeloTab({ 
  fragments, 
  onUpdateFragmentStatus, 
  currentTerritory,
  onSelectTerritory,
  onSelectFragment,
  setActiveTab,
  savedFragmentIds = [],
  onToggleSaveFragment
}: ZeloTabProps) {
  
  const [zeloSubTab, setZeloSubTab] = useState<'indice' | 'meus-fragmentos' | 'salvos'>('indice');

  // Display fragments filtered by current territory
  const filteredFragments = fragments.filter(f => f.territory === currentTerritory);
  
  // User created registered fragments
  const userRegisteredFragments = fragments.filter(f => f.isUserCreated === true);

  // Saved fragments from other communities/authors (id in saved list and not user created)
  const savedFragments = fragments.filter(f => savedFragmentIds.includes(f.id) && f.isUserCreated !== true);

  // Stats calculations
  const totalSecured = fragments.length;
  const totalConnections = fragments.reduce((acc, f) => acc + f.connections.length, 0) / 2;
  const totalTerritories = TERRITORIES.length;

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 space-y-10 animate-in fade-in duration-300">
      
      {/* Header Panel */}
      <div className="space-y-2 border-b border-[#dac2b8]/10 pb-5">
        <h2 className="font-serif text-3xl font-light text-on-surface">Documentação & Índice de Fragmentos</h2>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Navegue pelos fragmentos de mundo comunitários. Gerencie seus fragmentos registrados e explore as conexões e teias tecidas na Constelação.
        </p>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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
            <GitCommit className="w-5 h-5" />
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase text-on-surface-variant/60 block font-semibold">Teias Conectadas</span>
            <span className="font-serif text-2xl text-on-surface tracking-wide">{totalConnections} Conexões</span>
          </div>
        </div>

        <div className="glass-panel border border-[#dac2b8]/15 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-tertiary/15 rounded-xl border border-tertiary/20 flex items-center justify-center text-tertiary shrink-0">
            <MapPin className="w-5 h-5 text-tertiary" />
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase text-on-surface-variant/60 block font-semibold">Setores Mapeados</span>
            <span className="font-serif text-2xl text-on-surface tracking-wide">{totalTerritories} Áreas</span>
          </div>
        </div>
      </div>

      {/* Aesthetic sub-navigation for tabs inside document section */}
      <div className="flex border-b border-[#dac2b8]/10 select-none">
        <button
          onClick={() => setZeloSubTab('indice')}
          className={`px-5 py-3 font-sans text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer relative ${
            zeloSubTab === 'indice' 
              ? 'text-primary' 
              : 'text-on-surface-variant/60 hover:text-on-surface hover:bg-[#dac2b8]/5'
          }`}
        >
          Índice do Território
          {zeloSubTab === 'indice' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
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

      {/* RENDER CONTENT DYNAMICALLY BASED ON SUB TAB */}
      {zeloSubTab === 'indice' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
          
          {/* LEFT COLUMN: ACTIVE COORDINATION ANCHORS */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-serif text-xl text-on-surface">Divisão por Área Ativa</h3>
            </div>

            <div className="space-y-3">
              {TERRITORIES.map((t) => {
                const isActive = t.id === currentTerritory;
                const fragmentCount = fragments.filter(f => f.territory === t.id).length;
                return (
                  <div 
                    key={t.id}
                    onClick={() => onSelectTerritory(t.id)}
                    className={`px-6 py-4 rounded-2xl border transition-all text-left flex items-center justify-between cursor-pointer ${
                      isActive 
                        ? 'bg-primary/5 border-primary/60 ring-1 ring-primary/35 text-on-surface shadow-md' 
                        : 'bg-surface-container/30 border-[#dac2b8]/10 text-on-surface-variant hover:border-[#dac2b8]/20'
                    }`}
                  >
                    <div className="space-y-1">
                      <h4 className="font-serif text-sm font-semibold text-on-surface flex items-center gap-2">
                        {t.name}
                        {isActive && <span className="w-2 h-2 rounded-full bg-secondary text-secondary-bright animate-ping" />}
                      </h4>
                      <p className="font-mono text-[9px] text-on-surface-variant/60">{t.coordinates}</p>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[10px] shrink-0 ml-4">
                      <Activity className="w-3.5 h-3.5 text-secondary" />
                      <span>{fragmentCount} fragmentos</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: DOCUMENTARY CATALOGUE */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-[#ffb596]" />
              <h3 className="font-serif text-xl text-on-surface">Catálogo de Fragmentos de {currentTerritory}</h3>
            </div>

            <div className="space-y-4">
              {filteredFragments.length > 0 ? (
                filteredFragments.map((f) => (
                  <div 
                    key={f.id}
                    className="glass-panel border border-[#dac2b8]/15 rounded-2xl p-5 space-y-4 animate-in slide-in-from-right duration-300 bg-[#0a1120]/40"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-surface-container/50 flex items-center justify-center text-on-surface-variant mt-1 shrink-0 border border-[#dac2b8]/10">
                          {f.type === 'audio' && <Volume2 className="w-4 h-4 text-blue-400" />}
                          {f.type === 'poetic' && <FileText className="w-4 h-4 text-emerald-400" />}
                          {f.type === 'visual' && <ImageIcon className="w-4 h-4 text-amber-400" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[8px] uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-semibold">
                              {f.type === 'audio' ? 'Fragmento Sonoro' : f.type === 'visual' ? 'Fragmento Visual' : 'Fragmento Textual'}
                            </span>
                            {f.isUserCreated && (
                              <span className="font-sans text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 leading-none">
                                <Sprout className="w-2.5 h-2.5" />
                                Seu Fragmento
                              </span>
                            )}
                          </div>
                          <h4 className="font-serif text-base font-normal text-on-surface pt-1.5">{f.title}</h4>
                        </div>
                      </div>
                    </div>

                    {f.imageUrl && (
                      <div className="relative w-full h-28 rounded-lg overflow-hidden border border-[#dac2b8]/10">
                        <FragmentViewer url={f.imageUrl} alt={f.title} className="w-full h-full object-cover" />
                      </div>
                    )}

                    <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3 select-text font-sans">{f.content}</p>

                    <div className="flex items-center justify-between pt-3 border-t border-[#dac2b8]/10">
                      <div className="text-[10px] font-mono text-on-surface-variant/60">
                        <span>Origem: {f.source}</span>
                      </div>

                      {onSelectFragment && setActiveTab && (
                        <button 
                          onClick={() => {
                            onSelectFragment(f.id);
                            setActiveTab('nexo');
                          }}
                          className="px-4 py-2 bg-primary hover:brightness-105 active:scale-95 text-on-primary text-xs font-semibold rounded-full flex items-center gap-1.5 cursor-pointer transition-all shadow-md font-sans"
                        >
                          Ver na Constelação
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="border border-dashed border-[#dac2b8]/10 rounded-2xl p-8 text-center space-y-3">
                  <CheckCircle className="w-8 h-8 text-secondary/60 mx-auto" />
                  <p className="font-serif text-base text-on-surface">Sem fragmentos para {currentTerritory}</p>
                  <p className="text-xs text-on-surface-variant/70 leading-relaxed max-w-xs mx-auto font-sans">
                    Nenhum fragmento de mundo foi inserido ou conectado a esta área ainda. Proponha um novo fragmento clicando no botão "+" flutuante.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB: USER REGISTERED FRAGMENTS (Seus fragmentos registrados com conexões) */}
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
                    
                    {/* TRACED CONNECTIONS BLOCK (quero que sejam exibidas as conexões traçadas com os seus fragmentos) */}
                    <div className="pt-3 border-t border-[#dac2b8]/10 space-y-2">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-primary block font-bold flex items-center gap-1.5 select-none">
                        <GitCommit className="w-3.5 h-3.5 text-primary" />
                        Conexões Traçadas ({f.connections.length})
                      </span>
                      
                      {f.connections.length > 0 ? (
                        <div className="flex flex-col gap-1.5 select-none">
                          {fragments
                            .filter(other => f.connections.includes(other.id))
                            .map((other) => {
                              return (
                                <div 
                                  key={other.id}
                                  onClick={() => {
                                    if (onSelectFragment && setActiveTab) {
                                      onSelectFragment(other.id);
                                      setActiveTab('nexo');
                                    }
                                  }}
                                  className="group flex items-center justify-between px-3 py-2 bg-[#0b1326]/40 border border-[#dac2b8]/10 hover:border-primary/40 rounded-xl cursor-pointer hover:bg-[#0b1326]/80 transition-all"
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <span className="text-xs shrink-0 select-none">🔗</span>
                                    <div className="truncate">
                                      <span className="text-[11px] text-on-surface font-medium block truncate leading-none pt-0.5">{other.title}</span>
                                      <span className="text-[8px] font-mono text-on-surface-variant/50 uppercase leading-none">
                                        {other.source} • {other.territory}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 text-[9px] text-[#ffb596] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 font-sans ml-2">
                                    <span>Ir para</span>
                                    <ArrowUpRight className="w-3 h-3" />
                                  </div>
                                </div>
                              );
                            })
                          }
                        </div>
                      ) : (
                        <div className="text-[10px] italic text-on-surface-variant/50 font-sans pl-1 select-none">
                          Sem amarras traçadas ainda. Abra a constelação e faça conexões!
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-[#dac2b8]/10 flex items-center justify-between">
                    <span className="font-mono text-[9px] text-on-surface-variant/40">Inserido em {new Date(f.createdAt).toLocaleDateString()}</span>
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
              Suas referências salvas de outros setores e subdivisões da comunidade. Use para aproximar fragmentos de mundo e inspirar novas conexões.
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
