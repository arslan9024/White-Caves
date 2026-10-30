export interface ChatMessage {
  id: string;
  sender: 'client' | 'nina' | 'arslan';
  senderName: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  intent?: string;
  leadScore?: number;
}

export interface ChatContact {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  tag: string;
  messages: ChatMessage[];
}

/** Typed props for react-window List item renderer */
export interface ContactRowItemData {
  contacts: ChatContact[];
  activeContactId: string | null;
  onSelect: (id: string) => void;
}

