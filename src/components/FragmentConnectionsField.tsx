import { useMemo, useState } from 'react';
import { Link2, Plus, X } from 'lucide-react';
import { WorldFragment } from '../types';

interface FragmentConnectionsFieldProps {
  fragments: WorldFragment[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  currentFragmentId?: string;
}

const MAX_CONNECTIONS = 5;

export default function FragmentConnectionsField({
  fragments,
  selectedIds,
  onChange,
  currentFragmentId,
}: FragmentConnectionsFieldProps) {
  const [candidateId, setCandidateId] = useState('');
  const selectedFragments = selectedIds
    .map((id) => fragments.find((fragment) => fragment.id === id))
    .filter((fragment): fragment is WorldFragment => Boolean(fragment));

  const availableFragments = useMemo(() => {
    return fragments
      .filter((fragment) => fragment.id !== currentFragmentId)
      .filter((fragment) => fragment.isOpenToConnections || selectedIds.includes(fragment.id))
      .sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
  }, [currentFragmentId, fragments, selectedIds]);

  const addConnection = () => {
    if (!candidateId || selectedIds.includes(candidateId) || selectedIds.length >= MAX_CONNECTIONS) return;
    onChange([...selectedIds, candidateId].slice(0, MAX_CONNECTIONS));
    setCandidateId('');
  };

  const removeConnection = (id: string) => {
    onChange(selectedIds.filter((selectedId) => selectedId !== id));
  };

  return (
    <div className="space-y-2">
      <label className="font-mono text-[10px] uppercase text-on-surface-variant/80 tracking-wider block font-semibold">
        Conectar com fragmentos
      </label>
      <div className="flex items-center gap-2">
        <select
          value={candidateId}
          onChange={(event) => setCandidateId(event.target.value)}
          disabled={selectedIds.length >= MAX_CONNECTIONS}
          className="min-w-0 flex-1 bg-transparent border-0 border-b border-outline/35 focus:border-primary focus:ring-0 text-base font-sans text-on-surface py-2 px-0 transition-all disabled:opacity-45"
        >
          <option value="">Escolha um fragmento aberto a conexoes</option>
          {availableFragments.map((fragment) => (
            <option key={fragment.id} value={fragment.id} disabled={selectedIds.includes(fragment.id)}>
              {fragment.title}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={addConnection}
          disabled={!candidateId || selectedIds.includes(candidateId) || selectedIds.length >= MAX_CONNECTIONS}
          className="inline-flex w-9 h-9 items-center justify-center rounded-full border border-primary/20 text-primary hover:bg-primary/10 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
          aria-label="Adicionar conexao"
          title="Adicionar conexao"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 text-[10px] text-on-surface-variant/65">
        <p className="leading-relaxed">
          {availableFragments.length > 0
            ? 'Selecione ate 5 fragmentos para formar elos na constelacao.'
            : 'Nenhum fragmento disponivel para conexao no momento.'}
        </p>
        <span className="font-mono shrink-0">{selectedIds.length}/{MAX_CONNECTIONS}</span>
      </div>

      {selectedFragments.length > 0 && (
        <div className="space-y-2 pt-1">
          {selectedFragments.map((fragment) => (
            <div
              key={fragment.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-outline/20 bg-surface-container-low/45 px-3 py-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Link2 className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-xs text-on-surface truncate">{fragment.title}</span>
              </div>
              <button
                type="button"
                onClick={() => removeConnection(fragment.id)}
                className="w-6 h-6 inline-flex items-center justify-center rounded-full text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors shrink-0"
                aria-label={`Remover conexao com ${fragment.title}`}
                title="Remover conexao"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
