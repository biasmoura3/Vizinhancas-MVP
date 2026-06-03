import React, { useState, useEffect, useRef } from 'react';
import { WorldFragment, FragmentType, StewardshipStatus } from '../types';
import { PRESET_IMAGES } from '../data';
import { 
  X, 
  Camera, 
  Mic, 
  Square, 
  Sprout, 
  ChevronRight,
  Sparkles,
  Music,
  FileText,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (fragment: Omit<WorldFragment, 'id' | 'createdAt' | 'status' | 'connections'>) => void;
  currentTerritory: string;
}

export default function ProposalModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  currentTerritory 
}: ProposalModalProps) {
  
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('');
  const [type, setType] = useState<FragmentType>('audio');
  const [territory, setTerritory] = useState(currentTerritory);
  const [content, setContent] = useState('');
  const [openToConnections, setOpenToConnections] = useState(true);
  
  // Visual files state
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  
  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [hasRecordedAudio, setHasRecordedAudio] = useState(false);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTerritory(currentTerritory);
    }
  }, [isOpen, currentTerritory]);

  // Audio Recording simulator
  useEffect(() => {
    if (isRecording) {
      recordingInterval.current = setInterval(() => {
        setRecordSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    }
    return () => {
      if (recordingInterval.current) clearInterval(recordingInterval.current);
    };
  }, [isRecording]);

  if (!isOpen) return null;

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordSeconds(0);
    setHasRecordedAudio(false);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setHasRecordedAudio(true);
  };

  const handleAddVisualRegistry = () => {
    // Cycles through preset high quality lichen images
    const nextIndex = attachedImages.length % PRESET_IMAGES.length;
    const randomUri = PRESET_IMAGES[nextIndex];
    setAttachedImages(prev => [...prev, randomUri]);
  };

  const handleRemoveVisualRegistry = (index: number) => {
    setAttachedImages(prev => prev.filter((_, i) => i !== index));
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Build newly submitted payload
    // Set a default image context if it's visual and none are chosen, or use chosen visual
    const chosenImageUrl = type === 'visual' && attachedImages.length > 0 
      ? attachedImages[0] 
      : 'https://images.unsplash.com/photo-1545231027-63b39f612acf?q=80&w=600&auto=format&fit=crop';

    onSubmit({
      title,
      type,
      source: source || 'Tradição Oral',
      territory: territory || 'Setor 7G',
      content: content || 'Nenhuma narração tecida.',
      openToConnections,
      imageUrl: type === 'visual' ? chosenImageUrl : undefined,
      audioDuration: type === 'audio' ? formatSeconds(recordSeconds || 12) : undefined,
      audioWaveform: type === 'audio' ? Array.from({length: 20}, () => Math.floor(Math.random() * 20) + 5) : undefined
    });

    // Reset Form state
    setTitle('');
    setSource('');
    setContent('');
    setAttachedImages([]);
    setRecordSeconds(0);
    setHasRecordedAudio(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-surface/85 backdrop-blur-md overflow-y-auto" id="modal-overlay">
      {/* Container panel */}
      <div className="relative w-full max-w-3xl glass-panel border border-[#dac2b8]/15 rounded-xl shadow-2xl flex flex-col my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-on-surface-variant hover:text-primary transition-colors z-10 p-2 cursor-pointer bg-surface-container/60 hover:bg-surface-container rounded-full border border-outline-variant/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <header className="px-8 pt-8 pb-5 border-b border-outline-variant/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-light text-on-surface tracking-wide">
              Adicionar Novo Fragmento
            </h1>
            <p className="font-mono text-[10px] text-primary tracking-[0.2em] uppercase opacity-90 mt-1 font-semibold">
              DEPOSITE UM FRAGMENTO DE MUNDO NA CONSTELAÇÃO
            </p>
          </div>

          {/* Form format selector (Crucial feature so caretakers can filter) */}
          <div className="flex items-center gap-1.5 p-1 bg-surface-container-low border border-outline-variant/10 rounded-full max-w-sm shrink-0">
            {(['audio', 'poetic', 'visual'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium capitalize font-sans transition-all cursor-pointer ${
                  type === t 
                    ? 'bg-primary text-on-primary shadow-sm' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {t === 'audio' && <Music className="w-3.5 h-3.5" />}
                {t === 'poetic' && <FileText className="w-3.5 h-3.5" />}
                {t === 'visual' && <ImageIcon className="w-3.5 h-3.5" />}
                {t === 'poetic' ? 'Poético' : t}
              </button>
            ))}
          </div>
        </header>

        {/* Modal Body Form */}
        <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="overflow-y-auto p-8 space-y-6 max-h-[60vh]">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* LEFT COLUMN: Metadata inputs */}
              <div className="md:col-span-5 space-y-5">
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase text-on-surface-variant/80 tracking-wider block font-semibold">
                    Título do Fragmento
                  </label>
                  <input 
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-[#dac2b8]/30 focus:border-primary focus:ring-0 text-lg font-sans text-on-surface py-2 px-0 transition-all placeholder:text-on-surface-variant/30"
                    placeholder="Qual o nome deste fragmento?"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase text-on-surface-variant/80 tracking-wider block font-semibold">
                    Origem ou Autor do Fragmento
                  </label>
                  <input 
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-[#dac2b8]/30 focus:border-primary focus:ring-0 text-base font-sans text-on-surface py-2 px-0 transition-all placeholder:text-on-surface-variant/30"
                    placeholder="Quem registrou ou de onde ele provém?"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase text-on-surface-variant/80 tracking-wider block font-semibold">
                    Bairro ou Região
                  </label>
                  <input 
                    type="text"
                    value={territory}
                    onChange={(e) => setTerritory(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-[#dac2b8]/30 focus:border-primary focus:ring-0 text-base font-sans text-on-surface py-2 px-0 transition-all placeholder:text-on-surface-variant/30"
                    placeholder="Bairro ou setor"
                  />
                </div>

                {/* Open to Connections toggle */}
                <div className="pt-4 border-t border-[#dac2b8]/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-sans text-xs font-semibold uppercase tracking-wider text-on-surface">Permitir Conexões</span>
                      <span className="text-[11px] text-on-surface-variant leading-relaxed">Permite que outras pessoas liguem seus fragmentos de mundo a este.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={openToConnections}
                        onChange={(e) => setOpenToConnections(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Specific attachments and description block */}
              <div className="md:col-span-7 space-y-6">
                
                {/* Narrated description text */}
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase text-on-surface-variant/80 tracking-wider block font-semibold">
                    Conteúdo do Fragmento de Mundo
                  </label>
                  <textarea 
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-surface-container-low/40 rounded-lg border border-[#dac2b8]/15 focus:border-[#ffb596] focus:ring-1 focus:ring-[#ffb596]/10 text-sm font-sans text-on-surface p-4 transition-all placeholder:italic placeholder:text-on-surface-variant/30 leading-relaxed"
                    placeholder="Descreva as percepções e elementos deste fragmento de mundo..."
                  />
                </div>

                {/* AUDIO FORM OPTION CONTENT: Sussurros e Cantos */}
                {type === 'audio' && (
                  <div className="space-y-3">
                    <label className="font-mono text-[10px] uppercase text-on-surface-variant/80 tracking-wider block font-semibold">
                      Gravar Áudio ou Depoimento
                    </label>
                    <div className="flex items-center gap-4 bg-surface-container-low/60 p-4 border border-[#dac2b8]/10 rounded-xl relative overflow-hidden">
                      {isRecording && (
                        <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-error animate-pulse" />
                      )}
                      
                      {!isRecording ? (
                        <button 
                          type="button"
                          onClick={handleStartRecording}
                          className="w-11 h-11 rounded-full bg-primary hover:scale-105 active:scale-95 text-on-primary flex items-center justify-center transition-all cursor-pointer shadow-lg shadow-primary/20"
                        >
                          <Mic className="w-5 h-5" />
                        </button>
                      ) : (
                        <button 
                          type="button"
                          onClick={handleStopRecording}
                          className="w-11 h-11 rounded-full bg-error text-white hover:scale-105 active:scale-95 flex items-center justify-center transition-all cursor-pointer shadow-lg shadow-error/10 animate-pulse"
                        >
                          <Square className="w-4 h-4 fill-current" />
                        </button>
                      )}

                      <div className="flex-1">
                        {isRecording ? (
                          <>
                            {/* Animated wave simulator */}
                            <div className="flex items-end gap-1 mb-2 h-4 justify-start">
                              {Array.from({ length: 15 }).map((_, i) => (
                                <div 
                                  key={i} 
                                  className="w-[3px] bg-primary rounded-full transition-all"
                                  style={{ 
                                    height: `${Math.floor(Math.random() * 14) + 2}px`,
                                    animation: `slow-pulse-kf ${0.5 + (i % 4) * 0.2}s ease-in-out infinite` 
                                  }}
                                />
                              ))}
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-mono text-on-surface-variant">
                              <span className="text-primary tracking-wide uppercase animate-pulse">Gravando som...</span>
                              <span>{formatSeconds(recordSeconds)} / --:--</span>
                            </div>
                          </>
                        ) : (
                          <div>
                            <p className="text-xs font-sans text-on-surface select-none">
                              {hasRecordedAudio ? '✓ Áudio gravado com sucesso' : 'Clique no microfone para gravar sua fala.'}
                            </p>
                            <span className="block text-[10px] text-on-surface-variant/60 font-mono mt-1">
                              {hasRecordedAudio ? `${formatSeconds(recordSeconds)} pronto para enviar.` : 'Gravador de áudio pronto'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* GRAPHIC ATTACHMENTS OPTION: Registros Visuais */}
                {type === 'visual' && (
                  <div className="space-y-3">
                    <label className="font-mono text-[10px] uppercase text-on-surface-variant/80 tracking-wider block font-semibold">
                      Imagens ou Fotos Ilustrativas
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {/* Attach triggers */}
                      <button 
                        type="button"
                        onClick={handleAddVisualRegistry}
                        className="aspect-square rounded-full border border-dashed border-[#dac2b8]/20 flex flex-col items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all group cursor-pointer bg-surface-container/30"
                      >
                        <Camera className="w-5 h-5 text-on-surface-variant group-hover:text-primary mb-1.5 transition-colors" />
                        <span className="text-[9px] font-mono uppercase tracking-wider text-on-surface-variant/60 font-semibold">Anexar</span>
                      </button>

                      {/* Display attached image states */}
                      {attachedImages.map((imgUrl, i) => (
                        <div key={i} className="aspect-square rounded-full overflow-hidden relative group border border-[#dac2b8]/10 bg-surface-container-lowest">
                          <img 
                            src={imgUrl} 
                            alt={`Visual registro ${i}`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                          />
                          <button 
                            type="button"
                            onClick={() => handleRemoveVisualRegistry(i)}
                            className="absolute inset-0 bg-error/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer text-white rounded-full"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      {/* Fallbacks showing templates exactly like mockup when empty */}
                      {attachedImages.length === 0 && (
                        <>
                          <div className="aspect-square rounded-full overflow-hidden opacity-30 border border-[#dac2b8]/10 bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low flex items-center justify-center text-[10px] font-mono text-on-surface-variant select-none">
                            Fio 01
                          </div>
                          <div className="aspect-square rounded-full overflow-hidden opacity-30 border border-[#dac2b8]/10 bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low flex items-center justify-center text-[10px] font-mono text-on-surface-variant select-none">
                            Fio 02
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <footer className="px-8 py-5 bg-surface-container-low/75 border-t border-outline-variant/10 flex items-center justify-end">
            <button 
              type="submit"
              className="w-full sm:w-auto px-10 py-3.5 bg-primary text-[#360f00] font-sans font-semibold flex items-center justify-center gap-2 hover:brightness-105 active:scale-95 transition-all text-sm rounded-full overflow-hidden relative shadow-lg shadow-primary/15 cursor-pointer group"
            >
              <Sprout className="w-4 h-4 shrink-0" />
              <span>Publicar na Constelação</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
