export type FragmentType = 'audio' | 'poetic' | 'visual';
export type StewardshipStatus = 'Zelo Concedido' | 'Em Análise' | 'Ritualizado';

export interface WorldFragment {
  id: string;
  title: string;
  type: FragmentType;
  source: string;
  territory: string;
  status: StewardshipStatus;
  content: string;
  imageUrl?: string;
  audioDuration?: string;
  audioWaveform?: number[];
  createdAt: string;
  authorEmail?: string;
  isUserCreated?: boolean;
}

export type ActiveTab = 'arquivo' | 'ponto' | 'doc' | 'zelo' | 'manifesto' | 'nexo' | 'settings' | 'suporte';

export interface AssemblyItem {
  id: string;
  title: string;
  date: string;
  territory: string;
  description: string;
  attendees: number;
}

export interface LoreDocument {
  id: string;
  category: string;
  title: string;
  content: string;
  date: string;
}
