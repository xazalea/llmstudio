/**
 * Anonymous Session Types
 * No user accounts - just session-based identification
 */

export interface AnonymousSession {
  id: string;
  createdAt: number;
  lastActiveAt: number;
  metadata?: SessionMetadata;
}

export interface SessionMetadata {
  userAgent?: string;
  country?: string;
  region?: string;
  language?: string;
}

export interface SessionStore {
  session: AnonymousSession | null;
  isInitialized: boolean;
}

export interface SessionToken {
  sessionId: string;
  timestamp: number;
  signature?: string;
}

// Generation job tracking per session
export interface SessionGenerationJob {
  id: string;
  sessionId: string;
  type: 'image' | 'video' | 'edit';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: number;
  completedAt?: number;
  input: Record<string, unknown>;
  output?: GenerationOutput;
  error?: string;
}

export interface GenerationOutput {
  urls: string[];
  metadata?: Record<string, unknown>;
}
