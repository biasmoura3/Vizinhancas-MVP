import React, { useState, useEffect } from 'react';
import { WorldFragment, FragmentType } from '../types';
import { 
  X, 
  Sprout, 
  ChevronRight,
  Music,
  FileText,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';

interface EditFragmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, fragment: Partial<Omit<WorldFragment, 'id' | 'createdAt'>>) => void;
  fragment: WorldFragment | null;
}

export default function EditFragmentModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  fragment
}: EditFragmentModalProps) {
  
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('');
  const [type, setType] = useState<FragmentType>('audio');
  const [territory, setTerritory] = useState('');
  const [content, setContent] = useState('');
  const [mediaLinks, setMediaLinks] = useState<string[]>(['']);

  useEffect(() => {
    if (isOpen && fragment) {
      setTitle(fragment.title);
      setSource(fragment.source);
      setType(fragment.type);
      setTerritory(fragment.territory);
      setContent(fragment.content);
      setMediaLinks(fragment.mediaLinks?.length ? fragment.mediaLinks.slice(0, 3) : fragment.imageUrl ? [fragment.imageUrl] : ['']);
    }
  }, [isOpen, fragment]);

  if (!isOpen || !fragment) return null;

  const handleAddMediaLink = () => {
    if (mediaLinks.length < 3) {
      setMediaLinks((prev) => [...prev, '']);
    }
  };

  const handleUpdateMediaLink = (index: number, value: string) => {
    setMediaLinks((prev) => prev.map((link, i) => i === index ? value : link));
  };

  const handleRemoveMediaLink = (index: number) => {
    setMediaLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const cleanedMediaLinks = mediaLinks.map((link) => link.trim()).filter(Boolean).slice(0, 3);
    const chosenMediaUrl = cleanedMediaLinks[0];
    const previewUrl = type === 'visual'
      ? chosenMediaUrl ?? fragment.imageUrl ?? 'https://images.unsplash.com/photo-1545231027-63b39f612acf?q=80&w=600&auto=format&fit=crop'
      : chosenMediaUrl ?? undefined;

    onSubmit(fragment.id, {
      title,
      type,
      source: source || 'Tradição Oral',
      territory: territory || 'Setor 7G',
      content: content || 'Nenhuma narração tecida.',
      imageUrl: previewUrl,
      mediaLinks: cleanedMediaLinks,
    });

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
              Editar Fragmento
            </h1>
            <p className="font-mono text-[10px] text-primary tracking-[0.2em] uppercase opacity-90 mt-1 font-semibold">
              ATUALIZE O SEU FRAGMENTO DE MUNDO
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
                  <div className="flex items-center justify-between">
                    <label className="font-mono text-[10px] uppercase text-on-surface-variant/80 tracking-wider block font-semibold">
                      Título do Fragmento
                    </label>
                    <span className="font-mono text-[9px] text-on-surface-variant/60">{title.length}/50</span>
                  </div>
                  <input 
                    type="text"
                    required
                    maxLength={50}
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

              </div>

              {/* RIGHT COLUMN: Specific attachments and description block */}
              <div className="md:col-span-7 space-y-6">
                
                {/* Narrated description text */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-mono text-[10px] uppercase text-on-surface-variant/80 tracking-wider block font-semibold">
                      Conteúdo do Fragmento de Mundo
                    </label>
                    <span className="font-mono text-[9px] text-on-surface-variant/60">{content.length}/300</span>
                  </div>
                  <textarea 
                    rows={4}
                    maxLength={300}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-surface-container-low/40 rounded-lg border border-[#dac2b8]/15 focus:border-[#ffb596] focus:ring-1 focus:ring-[#ffb596]/10 text-sm font-sans text-on-surface p-4 transition-all placeholder:italic placeholder:text-on-surface-variant/30 leading-relaxed"
                    placeholder="Descreva as percepções e elementos deste fragmento de mundo..."
                  />
                </div>

                {(type === 'audio' || type === 'visual') && (
                  <div className="space-y-3">
                    <label className="font-mono text-[10px] uppercase text-on-surface-variant/80 tracking-wider block font-semibold">
                      Links de visualização
                    </label>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">
                      Para fragmentos sonoros, cole links do YouTube. Para fragmentos visuais, informe até 3 imagens para aparecerem no card.
                    </p>
                    <div className="space-y-3">
                      {mediaLinks.map((link, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <input
                            type="url"
                            value={link}
                            onChange={(e) => handleUpdateMediaLink(index, e.target.value)}
                            placeholder={`Link de visualização ${index + 1}`}
                            className="flex-1 bg-surface-container-low/60 rounded-lg border border-[#dac2b8]/20 px-4 py-3 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                          />
                          {mediaLinks.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMediaLink(index)}
                              className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-error/20 text-error hover:bg-error/10 transition-colors"
                              aria-label="Remover link"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {mediaLinks.length < 3 && (
                      <button
                        type="button"
                        onClick={handleAddMediaLink}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 text-primary text-sm hover:bg-primary/5 transition-all"
                      >
                        + Adicionar mais links
                      </button>
                    )}
                    {mediaLinks.length >= 3 && (
                      <p className="text-[10px] text-on-surface-variant/60 italic font-mono">
                        Limite máximo de 3 links atingido
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <footer className="px-8 py-5 bg-surface-container-low/75 border-t border-outline-variant/10 flex items-center justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-3.5 bg-surface-container border border-[#dac2b8]/20 text-on-surface font-sans font-semibold flex items-center justify-center gap-2 hover:bg-surface-container-high active:scale-95 transition-all text-sm rounded-full overflow-hidden relative cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-10 py-3.5 bg-primary text-[#360f00] font-sans font-semibold flex items-center justify-center gap-2 hover:brightness-105 active:scale-95 transition-all text-sm rounded-full overflow-hidden relative shadow-lg shadow-primary/15 cursor-pointer group"
            >
              <Sprout className="w-4 h-4 shrink-0" />
              <span>Salvar Alterações</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
