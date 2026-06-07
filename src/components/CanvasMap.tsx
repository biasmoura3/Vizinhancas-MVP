import React, { useState, useRef, useEffect } from 'react';
import { WorldFragment } from '../types';
import { 
  Sprout, 
  Map, 
  Volume2, 
  FileText, 
  Image as ImageIcon, 
  Locate,
  X,
  Bookmark
} from 'lucide-react';
import FragmentViewer from './FragmentViewer';

interface CanvasMapProps {
  fragments: WorldFragment[];
  selectedId: string | null;
  onSelectNode: (id: string | null) => void;
  savedFragmentIds?: string[];
  onToggleSaveFragment?: (id: string) => void;
}

interface NodePosition {
  id: string;
  x: number; // percentage width (0-100)
  y: number; // percentage height (0-100)
}

export default function CanvasMap({
  fragments,
  selectedId,
  onSelectNode,
  savedFragmentIds = [],
  onToggleSaveFragment
}: CanvasMapProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [filterTerritory, setFilterTerritory] = useState<string>('todos');
  const containerRef = useRef<HTMLDivElement>(null);

  // States for Obsidian-like background dragging/panning
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });

  // Audio playback and synthesis state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioIntervalRef = useRef<any>(null);
  const synthNodesRef = useRef<{ ctx: AudioContext | null; oscillator: OscillatorNode | null; gain: GainNode | null; filter: BiquadFilterNode | null }>({
    ctx: null,
    oscillator: null,
    gain: null,
    filter: null
  });

  const startSynthesizer = (frag: WorldFragment) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      const baseFreq = frag.id === 'alti-1' ? 220 : frag.id === 'vento-8' ? 280 : 180;
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();

      synthNodesRef.current = { ctx, oscillator: osc, gain, filter };
      setIsPlayingAudio(true);

      const waveform = frag.audioWaveform || [5, 10, 15, 20];
      let step = 0;
      
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      
      audioIntervalRef.current = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            stopSynthesizer();
            return 0;
          }
          
          if (synthNodesRef.current.oscillator && synthNodesRef.current.ctx) {
            const currentWaveVal = waveform[step % waveform.length];
            const pitchAdjust = (currentWaveVal / 25) * 110;
            const targetFreq = baseFreq + pitchAdjust;
            synthNodesRef.current.oscillator.frequency.exponentialRampToValueAtTime(
              targetFreq, 
              synthNodesRef.current.ctx.currentTime + 0.25
            );
            step += 1;
          }
          
          return prev + 3;
        });
      }, 330);

    } catch (e) {
      console.error("Synthesizer failed to start:", e);
    }
  };

  const stopSynthesizer = () => {
    try {
      const { ctx, oscillator, gain } = synthNodesRef.current;
      if (gain && ctx) {
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
        setTimeout(() => {
          if (oscillator) {
            try { oscillator.stop(); } catch (e) {}
          }
          if (ctx && ctx.state !== 'closed') {
            try { ctx.close(); } catch (e) {}
          }
        }, 250);
      }
    } catch (e) {
      console.error(e);
    }
    
    if (audioIntervalRef.current) {
      clearInterval(audioIntervalRef.current);
      audioIntervalRef.current = null;
    }
    setIsPlayingAudio(false);
    setAudioProgress(0);
  };

  // Hardcoded node positions for initial fragments, with fallback random offsets for added items
  const [positions, setPositions] = useState<NodePosition[]>([
    { id: 'alti-1', x: 30, y: 25 },
    { id: 'poet-2', x: 74, y: 35 },
    { id: 'memb-3', x: 50, y: 64 },
    { id: 'mang-4', x: 18, y: 72 },
    { id: 'flor-5', x: 82, y: 75 },
    { id: 'vale-6', x: 46, y: 42 },
    { id: 'linc-7', x: 88, y: 55 },
    { id: 'vento-8', x: 14, y: 40 }
  ]);

  // If new fragments are added dynamically, generate safe positions for them
  useEffect(() => {
    const existingIds = positions.map(p => p.id);
    const newFragments = fragments.filter(f => !existingIds.includes(f.id));
    
    if (newFragments.length > 0) {
      const updatedPositions = [...positions];
      newFragments.forEach((f) => {
        // Place new nodes in random vacant zones
        updatedPositions.push({
          id: f.id,
          x: 20 + Math.floor(Math.random() * 60),
          y: 20 + Math.floor(Math.random() * 60)
        });
      });
      setPositions(updatedPositions);
    }
  }, [fragments, positions]);

  // Gets unique territory options
  const territories = ['todos', ...Array.from(new Set(fragments.map(f => f.territory)))];

  const handleNodeClick = (id: string) => {
    if (hasDragged) return; // Prevent action if user was dragging
    onSelectNode(id);
  };

  // Helper to find a node's physical position
  const getPos = (id: string) => {
    return positions.find(p => p.id === id) || { x: 50, y: 50 };
  };

  // Dragging event handlers for the background
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only drag with left click
    const target = e.target as HTMLElement;
    if (target.closest('.glass-panel') || target.closest('button')) {
      return;
    }

    setIsDragging(true);
    setHasDragged(false);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      offsetX: offset.x,
      offsetY: offset.y
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      setHasDragged(true);
    }
    
    setOffset({
      x: dragStartRef.current.offsetX + dx,
      y: dragStartRef.current.offsetY + dy
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const target = e.target as HTMLElement;
    if (target.closest('.glass-panel') || target.closest('button')) {
      return;
    }

    setIsDragging(true);
    setHasDragged(false);
    dragStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      offsetX: offset.x,
      offsetY: offset.y
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragStartRef.current.x;
    const dy = touch.clientY - dragStartRef.current.y;
    
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      setHasDragged(true);
    }
    
    setOffset({
      x: dragStartRef.current.offsetX + dx,
      y: dragStartRef.current.offsetY + dy
    });
  };

  // Find currently active details info
  const activeFragment = fragments.find(f => f.id === selectedId) || null;
  const activePos = activeFragment ? getPos(activeFragment.id) : null;

  // Auto-play / synthesis control when selectedId changes
  useEffect(() => {
    if (activeFragment && activeFragment.type === 'audio') {
      startSynthesizer(activeFragment);
    } else {
      stopSynthesizer();
    }
    return () => {
      stopSynthesizer();
    };
  }, [selectedId]);

  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden text-on-surface select-none">
      
      {/* Top filter overlay on map - Outside panning wrapper so it is fixed */}
      <div className="absolute top-4 left-6 z-30 flex gap-2 max-w-full overflow-x-auto pb-1">
        {territories.map((ter) => (
          <button
            key={ter}
            onClick={() => setFilterTerritory(ter)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize font-mono transition-all shrink-0 cursor-pointer border ${
              filterTerritory === ter 
                ? 'bg-secondary text-on-secondary border-secondary/50 shadow-md' 
                : 'bg-surface-container/85 border-[#dac2b8]/15 hover:border-[#dac2b8]/40 text-on-surface-variant'
            }`}
          >
            {ter === 'todos' ? 'Todos' : ter}
          </button>
        ))}
      </div>

      {/* Map Interactive Canvas Container */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        className={`flex-1 w-full relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-surface-container-low/20 via-[#0b1326] to-[#040810] overflow-hidden select-none transition-colors duration-200 ${
          isDragging ? 'cursor-grabbing bg-slate-950/20' : 'cursor-grab'
        }`}
      >
        
        {/* PANNABLE WRAPPER: Translates the entire network together organically */}
        <div 
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px)`,
          }}
          className="absolute inset-0 select-none transition-transform duration-75 ease-out"
        >
          {/* FLOATING TEXTURED NODES (Sleek Obsidian view) */}
          {fragments.map((frag) => {
            const isFilterMatch = filterTerritory === 'todos' || frag.territory === filterTerritory;
            if (!isFilterMatch) return null;

            const pos = getPos(frag.id);
            const isSelected = selectedId === frag.id;
            const isHovered = hoveredNodeId === frag.id;
            // Clean title truncation for highly polished Obsidian visual mapping
            const cleanTitle = frag.title.replace(/^"/, '').replace(/"$/, '');
            const displayTitle = cleanTitle.length > 20 
              ? `${cleanTitle.substring(0, 18)}...` 
              : cleanTitle;

            return (
              <div
                key={frag.id}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute z-20"
              >
                <div className="relative flex flex-col items-center">
                  {/* Node representation - clean circular bead/dot like Obsidian */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNodeClick(frag.id);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    onMouseEnter={() => setHoveredNodeId(frag.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-300 cursor-pointer border flex items-center justify-center relative ${
                      isSelected
                        ? 'bg-primary border-[#ffb596] scale-125 shadow-[0_0_15px_#ffb596]'
                        : isHovered
                          ? 'bg-[#ffb596] border-[#ffb596]/80 scale-110 shadow-[0_0_10px_rgba(255,181,150,0.5)]'
                          : frag.type === 'audio'
                            ? 'bg-blue-400 border-blue-400/30'
                            : frag.type === 'visual'
                              ? 'bg-amber-400 border-amber-400/30'
                              : 'bg-emerald-400 border-emerald-400/30'
                    }`}
                    style={{
                      boxShadow: isSelected 
                        ? '0 0 15px #ffb596, inset 0 0 4px rgba(255,255,255,0.8)' 
                        : isHovered 
                          ? '0 0 8px rgba(255,181,150,0.5)' 
                          : 'none'
                    }}
                  />

                  {/* Subtitle label below */}
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNodeClick(frag.id);
                    }}
                    className={`absolute top-5 font-sans text-[11px] font-medium tracking-wide text-center cursor-pointer select-none transition-all duration-200 whitespace-nowrap px-1.5 py-0.5 rounded ${
                      isSelected
                        ? 'text-primary font-semibold'
                        : isHovered
                          ? 'text-[#ffb596]'
                          : 'text-on-surface-variant/80'
                    }`}
                    style={{
                      textShadow: '0 2px 4px rgba(0,0,0,0.9)'
                    }}
                  >
                    {displayTitle}
                  </span>
                </div>
              </div>
            );
          })}

          {/* DETAILS OVERLAY POPUP: Renders directly anchored in the position of the selected fragment */}
          {activeFragment && activePos && (
            <div
              style={{
                left: `${activePos.x}%`,
                top: `${activePos.y}%`,
                // Smart coordinate translation to prevent container border overflow
                transform: `translate(${activePos.x > 55 ? 'calc(-100% - 24px)' : '24px'}, ${activePos.y > 60 ? '-80%' : '-25%'})`
              }}
              onMouseDown={(e) => e.stopPropagation()} // allows text selection/interaction inside card without invoking drag
              className="absolute z-40 w-80 max-w-[calc(100vw-3rem)] max-h-[80vh] overflow-y-auto glass-panel border border-[#dac2b8]/25 rounded-2xl shadow-[0_12px_42px_rgba(0,0,0,0.85)] p-5 animate-in zoom-in-95 duration-200 select-text cursor-default space-y-4 bg-[#0a1120]/95 backdrop-blur-md"
            >
              {/* Popover Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-[#dac2b8]/15 text-xs font-mono text-primary uppercase select-none">
                <span className="flex items-center gap-1.5 font-semibold">
                  {activeFragment.type === 'audio' && <Volume2 className="w-3.5 h-3.5 text-blue-400 animate-pulse" />}
                  {activeFragment.type === 'poetic' && <FileText className="w-3.5 h-3.5 text-emerald-400" />}
                  {activeFragment.type === 'visual' && <ImageIcon className="w-3.5 h-3.5 text-amber-400" />}
                  {activeFragment.type === 'audio' && <span>Fragmento Sonoro</span>}
                  {activeFragment.type === 'poetic' && <span>Fragmento Textual</span>}
                  {activeFragment.type === 'visual' && <span>Fragmento Visual</span>}
                </span>
                <div className="flex items-center gap-1.5 pt-0.5">
                  {onToggleSaveFragment && activeFragment.isUserCreated !== true && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSaveFragment(activeFragment.id);
                      }}
                      title={savedFragmentIds.includes(activeFragment.id) ? "Remover dos salvos" : "Salvar de outras comunidades"}
                      className={`w-6 h-6 flex items-center justify-center rounded-full transition-all cursor-pointer ${
                        savedFragmentIds.includes(activeFragment.id)
                          ? 'bg-secondary/40 text-[#ffb596] border border-[#ffb596]/45'
                          : 'bg-surface-container/20 hover:bg-[#dac2b8]/15 text-on-surface-variant hover:text-primary border border-transparent'
                      }`}
                    >
                      <Bookmark className={`w-3 h-3 ${savedFragmentIds.includes(activeFragment.id) ? 'fill-[#ffb596]' : ''}`} />
                    </button>
                  )}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectNode(null);
                    }}
                    className="text-on-surface-variant hover:text-on-surface text-sm cursor-pointer hover:rotate-90 transition-transform w-6 h-6 flex items-center justify-center rounded-full bg-surface-container/20 hover:bg-surface-container/50 border border-transparent"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Image Frame if image is available */}
              {activeFragment.imageUrl && (
                <div className="relative w-full h-36 rounded-lg overflow-hidden border border-[#dac2b8]/10 group">
                  <FragmentViewer url={activeFragment.imageUrl} alt={activeFragment.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1120] to-transparent opacity-65 pointer-events-none" />
                </div>
              )}

              <h3 className="font-serif text-base leading-snug font-normal text-on-surface">
                {activeFragment.title}
              </h3>

              {/* Generative Audio Synthesizer Controls */}
              {activeFragment.type === 'audio' && (
                <div className="bg-[#0b1326]/60 border border-[#dac2b8]/10 rounded-xl p-3.5 space-y-2.5 select-none">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isPlayingAudio) {
                          stopSynthesizer();
                        } else {
                          startSynthesizer(activeFragment);
                        }
                      }}
                      className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center cursor-pointer hover:brightness-110 active:scale-95 transition-all shadow-md"
                    >
                      {isPlayingAudio ? (
                        <span className="w-2.5 h-2.5 bg-on-primary rounded-sm" />
                      ) : (
                        <span className="border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-on-primary ml-0.5" />
                      )}
                    </button>
                    
                    <div className="flex-1 ml-3">
                      <div className="flex items-center justify-between text-[9px] font-mono opacity-60">
                        <span>{isPlayingAudio ? 'PRODUZINDO TIMBRE...' : 'SINTETIZADOR DISPONÃVEL'}</span>
                        <span>{activeFragment.audioDuration || '00:15'}</span>
                      </div>
                      <div className="w-full bg-surface-container/40 rounded-full h-1 mt-1 overflow-hidden">
                        <div 
                          className="bg-primary h-full transition-all duration-300"
                          style={{ width: `${audioProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dynamic waveform visualizer bar graph */}
                  <div className="flex justify-between items-end h-8 gap-0.5">
                    {(activeFragment.audioWaveform || [4, 8, 12, 16, 20, 15, 10, 8, 4]).map((barVal, index) => {
                      const waveStateHeight = `${(barVal / 25) * 100}%`;
                      return (
                        <div
                          key={index}
                          className={`flex-1 rounded-sm transition-all duration-300 ${
                            isPlayingAudio 
                              ? 'bg-[#ffb596]/80 animate-pulse' 
                              : 'bg-on-surface-variant/20'
                          }`}
                          style={{
                            height: isPlayingAudio 
                              ? `calc(${waveStateHeight} + ${Math.sin(audioProgress / 3 + index) * 18}%)`
                              : waveStateHeight,
                            animationDelay: `${index * 35}ms`
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              <p className="text-xs text-on-surface-variant leading-relaxed select-text font-sans">
                {activeFragment.content}
              </p>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-on-surface-variant border-t border-[#dac2b8]/10 pt-3">
                <div>
                  <span className="opacity-55 block uppercase font-bold text-[8px]">Origem</span>
                  <span className="text-on-surface block font-sans font-medium mt-0.5">{activeFragment.source}</span>
                </div>
                <div>
                  <span className="opacity-55 block uppercase font-bold text-[8px]">RegiÃ£o</span>
                  <span className="text-on-surface block font-sans font-semibold mt-0.5">{activeFragment.territory}</span>
                </div>
              </div>

              {activeFragment.isUserCreated !== true ? (
                <div className="border-t border-[#dac2b8]/10 pt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onToggleSaveFragment) onToggleSaveFragment(activeFragment.id);
                    }}
                    className={`w-full py-2 px-3 rounded-xl font-sans text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all border ${
                      savedFragmentIds.includes(activeFragment.id)
                        ? 'bg-secondary/15 text-[#ffb596] border-secondary/30 hover:bg-secondary/25'
                        : 'bg-surface-container-high/40 hover:bg-surface-container-high text-on-surface border-[#dac2b8]/15 hover:border-[#dac2b8]/35'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${savedFragmentIds.includes(activeFragment.id) ? 'fill-current' : ''}`} />
                    <span>
                      {savedFragmentIds.includes(activeFragment.id) 
                        ? 'Remover do Acervo de Fragmentos' 
                        : 'Salvar no Acervo de Fragmentos'}
                    </span>
                  </button>
                </div>
              ) : (
                <div className="border-t border-[#dac2b8]/10 pt-3 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 justify-center py-1.5 bg-[#10b981]/5 rounded-xl border border-emerald-500/15 select-none">
                  <Sprout className="w-3.5 h-3.5 animate-pulse" />
                  <span className="font-sans font-medium">Seu fragmento registrado!</span>
                </div>
              )}

            </div>
          )}
        </div>

        {/* HUD control bar fixed overlay */}
        <div className="absolute bottom-4 left-6 right-6 z-30 flex items-center justify-between pointer-events-none">
          <div className="bg-[#0b1326]/85 border border-[#dac2b8]/15 text-on-surface-variant text-[10px] font-mono px-4 py-2.5 rounded-full flex items-center gap-2.5 backdrop-blur shadow-xl pointer-events-auto select-none">
            <Locate className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span>ConstelaÃ§Ã£o â€¢ Arraste o fundo para navegar â€¢ Clique para detalhes</span>
          </div>

          {(offset.x !== 0 || offset.y !== 0) && (
            <button
              onClick={() => setOffset({ x: 0, y: 0 })}
              className="bg-[#0b1326]/85 border border-[#dac2b8]/15 hover:border-primary/40 text-primary text-[10px] font-semibold px-4 py-2.5 rounded-full flex items-center gap-2 backdrop-blur shadow-xl pointer-events-auto cursor-pointer hover:bg-primary/5 transition-all"
            >
              <Map className="w-3.5 h-3.5" />
              <span>Centralizar Vista</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
