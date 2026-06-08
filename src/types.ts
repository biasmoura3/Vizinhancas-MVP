export type FragmentType = 'audio' | 'poetic' | 'visual';

export interface WorldFragment {
  id: string;
  title: string;
  type: FragmentType;
  source: string;
  territory: string;
  content: string;
  mapPosition?: {
    x: number;
    y: number;
  };
  imageUrl?: string;
  mediaLinks?: string[];
  createdAt: string;
  updatedAt?: string;
  authorId?: string | null;
  authorEmail?: string;
  isUserCreated?: boolean;
}

export interface Territory {
  id: string;
  name: string;
  coordinates: string;
  createdAt?: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  createdAt: string;
}

export type ActiveTab = 'arquivo' | 'ponto' | 'doc' | 'zelo' | 'manifesto' | 'nexo' | 'settings' | 'suporte';

export interface LoreDocument {
  id: string;
  category: string;
  title: string;
  content: string;
  date: string;
}
