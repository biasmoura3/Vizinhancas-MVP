export type FragmentType = 'audio' | 'poetic' | 'visual';

export interface WorldFragment {
  id: string;
  title: string;
  type: FragmentType;
  source: string;
  territory: string;
  content: string;
  imageUrl?: string;
  mediaLinks?: string[];
  createdAt: string;
  authorEmail?: string;
  isUserCreated?: boolean;
}

export type ActiveTab = 'arquivo' | 'ponto' | 'doc' | 'zelo' | 'manifesto' | 'nexo' | 'settings' | 'suporte';

export interface LoreDocument {
  id: string;
  category: string;
  title: string;
  content: string;
  date: string;
}
