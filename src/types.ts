export interface Attachment {
  mimeType: string;
  data: string;
  name?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  imageUrl?: string;
  attachments?: Attachment[];
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  content?: string;
  persona?: string;
  customInstruction?: string;
  mood?: string;
  createdAt: number;
  updatedAt: number;
}

export interface SavedMoment {
  id: string;
  userId: string;
  createdAt: number;
  userMessage: string;
  aiMessage: string;
  summary: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  persona?: string;
  customInstruction?: string;
  mood?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Memory {
  id: string;
  userId: string;
  content: string;
  createdAt: number;
}

export interface SavedSummary {
  id: string;
  userId: string;
  createdAt: number;
  timeRange: string;
  summaryText: string;
}
