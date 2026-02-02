/**
 * Anonymous Session Management
 * No user accounts required - generates and manages anonymous session IDs
 */

import type { AnonymousSession, SessionMetadata, SessionToken } from './types';

// Re-export types for convenience
export type { AnonymousSession, SessionMetadata, SessionToken } from './types';

// Simple UUID generator (no external dependency)
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const SESSION_STORAGE_KEY = 'ai_suite_session';
const SESSION_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * Generate a new anonymous session
 */
export function createAnonymousSession(metadata?: SessionMetadata): AnonymousSession {
  const now = Date.now();
  return {
    id: generateUUID(),
    createdAt: now,
    lastActiveAt: now,
    metadata,
  };
}

/**
 * Get or create session from localStorage (client-side only)
 */
export function getOrCreateSession(): AnonymousSession {
  if (typeof window === 'undefined') {
    return createAnonymousSession();
  }

  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (stored) {
      const session: AnonymousSession = JSON.parse(stored);
      
      // Check if session is expired
      if (Date.now() - session.createdAt > SESSION_EXPIRY_MS) {
        const newSession = createAnonymousSession(session.metadata);
        saveSession(newSession);
        return newSession;
      }
      
      // Update last active time
      session.lastActiveAt = Date.now();
      saveSession(session);
      return session;
    }
  } catch (e) {
    console.warn('Failed to load session from storage:', e);
  }

  // Create new session
  const newSession = createAnonymousSession();
  saveSession(newSession);
  return newSession;
}

/**
 * Save session to localStorage
 */
export function saveSession(session: AnonymousSession): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (e) {
    console.warn('Failed to save session:', e);
  }
}

/**
 * Clear session from localStorage
 */
export function clearSession(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear session:', e);
  }
}

/**
 * Generate a session token for API requests
 */
export function generateSessionToken(session: AnonymousSession): SessionToken {
  return {
    sessionId: session.id,
    timestamp: Date.now(),
  };
}

/**
 * Create authorization header for API requests
 */
export function getSessionHeaders(session: AnonymousSession): Record<string, string> {
  const token = generateSessionToken(session);
  return {
    'X-Session-ID': token.sessionId,
    'X-Session-Timestamp': String(token.timestamp),
  };
}

/**
 * Validate session token (basic validation)
 */
export function validateSessionToken(token: SessionToken): boolean {
  if (!token.sessionId || !token.timestamp) return false;
  
  // Check if timestamp is within reasonable range (1 hour)
  const now = Date.now();
  const maxAge = 60 * 60 * 1000; // 1 hour
  
  return now - token.timestamp < maxAge;
}
