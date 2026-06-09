import React, { useState, useRef } from 'react';
import { Territory, WorldFragment } from '../types';
import {
  Sprout,
  Map as MapIcon,
  Volume2,
  FileText,
  Image as ImageIcon,
  Locate,
  X,
  Bookmark,
  Link2
} from 'lucide-react';
import FragmentViewer from './FragmentViewer';
import { getFragmentMapPosition } from '../utils/constellationLayout';

interface CanvasMapProps {
  fragments: WorldFragment[];
  selectedId: string | null;
  onSelectNode: (id: string | null) => void;
  savedFragmentIds?: string[];
  onToggleSaveFragment?: (id: string) => void;
  territories?: Territory[];
}

export default function CanvasMap({
  fragments,
  selectedId,
  onSelectNode,
  savedFragmentIds = [],
  onToggleSaveFragment,
  territories: availableTerritories = []
}: CanvasMapProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [filterTerritory, setFilterTerritory] = useState<string>('todos');
  const containerRef = useRef<HTMLDivElement>(null);

  // States for Obsidian-like background dragging/panning
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
  const dragMovedRef = useRef(false);

  // Gets unique territory options
  const territories = [
    'todos',
    ...Array.from(new Set([
      ...availableTerritories.map((territory) => territory.id),
      ...fragments.map(f => f.territory)
    ]))
  ];

  const handleNodeClick = (id: string) => {
    if (dragMovedRef.current) return; // Prevent action if user was dragging
    onSelectNode(id);
  };

  // Helper to find a node's physical position
  const getPos = (id: string) => {
    const fragment = fragments.find(f => f.id === id);
    return fragment ? getFragmentMapPosition(fragment) : { x: 50, y: 50 };
  };

  // Dragging event handlers for the background
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only drag with left click
    const target = e.target as HTMLElement;
    if (target.closest('.glass-panel') || target.closest('button')) {
      return;
    }

    setIsDragging(true);
    dragMovedRef.current = false;
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
      dragMovedRef.current = true;
    }

    setOffset({
      x: dragStartRef.current.offsetX + dx,
      y: dragStartRef.current.offsetY + dy
    });
  };

  const handleMouseUp = () => {
    const draggedDuringGesture = dragMovedRef.current;

    setIsDragging(false);
    if (draggedDuringGesture) {
      window.setTimeout(() => {
        dragMovedRef.current = false;
      }, 0);
    } else {
      dragMovedRef.current = false;
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const target = e.target as HTMLElement;
    if (target.closest('.glass-panel') || target.closest('button')) {
      return;
    }

    setIsDragging(true);
    dragMovedRef.current = false;
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
      dragMovedRef.current = true;
    }

    setOffset({
      x: dragStartRef.current.offsetX + dx,
      y: dragStartRef.current.offsetY + dy
    });
  };

  // Find currently active details info
  const activeFragment = fragments.find(f => f.id === selectedId) || null;
  const fragmentById = new globalThis.Map(fragments.map((fragment) => [fragment.id, fragment]));
  const isVisibleByFilter = (fragment: WorldFragment) => filterTerritory === 'todos' || fragment.territory === filterTerritory;
  const visibleConnectionLines = fragments.flatMap((fragment) => {
    if (!isVisibleByFilter(fragment)) return [];

    return (fragment.connectedFragmentIds ?? []).flatMap((connectedId) => {
      const connectedFragment = fragmentById.get(connectedId);
      if (!connectedFragment || !isVisibleByFilter(connectedFragment)) return [];

      const pairKey = [fragment.id, connectedId].sort().join('::');
      if (fragment.id > connectedId && connectedFragment.connectedFragmentIds?.includes(fragment.id)) return [];

      const from = getFragmentMapPosition(fragment);
      const to = getFragmentMapPosition(connectedFragment);
      const isActive = activeFragment
        ? fragment.id === activeFragment.id || connectedId === activeFragment.id
        : false;

      return [{ pairKey, from, to, isActive }];
    });
  });
  const activeConnectedFragments = activeFragment
    ? Array.from(new Set([
        ...(activeFragment.connectedFragmentIds ?? []),
        ...fragments
          .filter((fragment) => fragment.connectedFragmentIds?.includes(activeFragment.id))
          .map((fragment) => fragment.id),
      ]))
        .map((id) => fragmentById.get(id))
        .filter((fragment): fragment is WorldFragment => Boolean(fragment))
    : [];
  const activeMediaLinks = activeFragment
    ? Array.from(new Set([
        ...(activeFragment.mediaLinks ?? []),
        ...(activeFragment.imageUrl ? [activeFragment.imageUrl] : [])
      ].filter(Boolean))).slice(0, 3)
    : [];
  const activePreviewUrl = activeFragment?.type === 'audio'
    ? activeMediaLinks[0]
    : null;
  const visualMediaCount = activeFragment?.type === 'visual' ? activeMediaLinks.length : 0;
  const visualGalleryClassName = visualMediaCount === 1
    ? 'grid grid-cols-1 gap-3 w-full max-w-[min(32rem,calc(100vw-5rem))]'
    : visualMediaCount === 2
      ? 'grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-[min(48rem,calc(100vw-5rem))]'
      : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-[min(64rem,calc(100vw-5rem))]';

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
          <svg className="absolute inset-0 z-10 w-full h-full overflow-visible pointer-events-none" aria-hidden="true">
            {visibleConnectionLines.map((line) => (
              <line
                key={line.pairKey}
                x1={`${line.from.x}%`}
                y1={`${line.from.y}%`}
                x2={`${line.to.x}%`}
                y2={`${line.to.y}%`}
                className={line.isActive ? 'stroke-primary/60' : 'stroke-[#dac2b8]/18'}
                strokeWidth={line.isActive ? 1.4 : 0.8}
                strokeLinecap="round"
              />
            ))}
          </svg>

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

          {/* DETAILS OVERLAY POPUP: stays centered while the constellation remains visible around it */}
          {activeFragment && (
            <div
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% - ${offset.x}px), calc(-50% - ${offset.y}px))`
              }}
              onMouseDown={(e) => e.stopPropagation()} // allows text selection/interaction inside card without invoking drag
              className="absolute z-40 w-fit min-w-[min(22rem,calc(100vw-2rem))] max-w-[min(64rem,calc(100vw-2rem))] max-h-[min(78vh,42rem)] overflow-y-auto glass-panel border border-[#dac2b8]/30 rounded-2xl shadow-[0_18px_60px_rgba(0,0,0,0.88),0_0_34px_rgba(255,181,150,0.12)] p-6 animate-in zoom-in-95 duration-200 select-text cursor-default space-y-4 bg-[#0a1120]/90 backdrop-blur-md"
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
                      className={`w-7 h-7 flex items-center justify-center rounded-full transition-all cursor-pointer ${
                        savedFragmentIds.includes(activeFragment.id)
                          ? 'bg-secondary/40 text-[#ffb596] border border-[#ffb596]/45'
                          : 'bg-surface-container/20 hover:bg-[#dac2b8]/15 text-on-surface-variant hover:text-primary border border-transparent'
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${savedFragmentIds.includes(activeFragment.id) ? 'fill-[#ffb596]' : ''}`} />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectNode(null);
                    }}
                    className="text-on-surface-variant hover:text-on-surface text-sm cursor-pointer hover:rotate-90 transition-transform w-7 h-7 flex items-center justify-center rounded-full bg-surface-container/20 hover:bg-surface-container/50 border border-transparent"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Media preview frame */}
              {activePreviewUrl && (
                <div className="relative w-full h-44 rounded-lg overflow-hidden border border-[#dac2b8]/10 group">
                  <FragmentViewer url={activePreviewUrl} alt={activeFragment.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1120] to-transparent opacity-65 pointer-events-none" />
                </div>
              )}

              {activeFragment.type === 'visual' && activeMediaLinks.length > 0 && (
                <div className={visualGalleryClassName}>
                  {activeMediaLinks.map((link, index) => (
                    <div
                      key={`${link}-${index}`}
                      className="relative min-w-0 rounded-lg overflow-hidden border border-[#dac2b8]/10 bg-surface-container-low/25"
                    >
                      <FragmentViewer
                        url={link}
                        alt={`${activeFragment.title} ${index + 1}`}
                        className="block w-full h-auto max-h-[28rem] object-contain"
                      />
                    </div>
                  ))}
                </div>
              )}

              <h3 className="font-serif text-xl leading-snug font-normal text-on-surface">
                {activeFragment.title}
              </h3>

              <p className="text-sm text-on-surface-variant leading-relaxed select-text font-sans">
                {activeFragment.content}
              </p>

              {activeFragment.type === 'audio' && activeMediaLinks.length > 0 && (
                <div className="space-y-1.5 text-xs font-sans">
                  {activeMediaLinks.map((link, index) => (
                    <a
                      key={`${link}-${index}`}
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="block truncate text-primary hover:text-primary-bright underline underline-offset-4 decoration-primary/35"
                    >
                      Link do vídeo {index + 1}
                    </a>
                  ))}
                </div>
              )}

              {activeConnectedFragments.length > 0 && (
                <div className="border-t border-[#dac2b8]/10 pt-3 space-y-2">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-on-surface-variant/65 font-semibold select-none">
                    <Link2 className="w-3.5 h-3.5 text-primary" />
                    <span>Conexoes</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeConnectedFragments.map((connectedFragment) => (
                      <button
                        key={connectedFragment.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectNode(connectedFragment.id);
                        }}
                        className="max-w-full inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-all cursor-pointer"
                      >
                        <Link2 className="w-3 h-3 shrink-0" />
                        <span className="truncate">{connectedFragment.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-[10px] font-mono text-on-surface-variant border-t border-[#dac2b8]/10 pt-3">
                <div>
                  <span className="opacity-55 block uppercase font-bold text-[8px]">Origem/Autor</span>
                  <span className="text-on-surface block font-sans font-medium mt-0.5">{activeFragment.source}</span>
                </div>
                <div>
                  <span className="opacity-55 block uppercase font-bold text-[8px]">Região</span>
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
                    className={`w-full py-2.5 px-3 rounded-xl font-sans text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all border ${
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
            <span>Constelação • Arraste o fundo para navegar • Clique para detalhes</span>
          </div>

          {(offset.x !== 0 || offset.y !== 0) && (
            <button
              onClick={() => setOffset({ x: 0, y: 0 })}
              className="bg-[#0b1326]/85 border border-[#dac2b8]/15 hover:border-primary/40 text-primary text-[10px] font-semibold px-4 py-2.5 rounded-full flex items-center gap-2 backdrop-blur shadow-xl pointer-events-auto cursor-pointer hover:bg-primary/5 transition-all"
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Centralizar Vista</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
