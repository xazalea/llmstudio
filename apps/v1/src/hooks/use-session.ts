"use client";

import { useEffect, useState } from "react";

interface AnonymousSession {
  id: string;
  createdAt: number;
  lastActiveAt: number;
}

const SESSION_STORAGE_KEY = 'ai_suite_session';
const SESSION_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function createAnonymousSession(): AnonymousSession {
  const now = Date.now();
  return {
    id: generateUUID(),
    createdAt: now,
    lastActiveAt: now,
  };
}

function getOrCreateSession(): AnonymousSession {
  if (typeof window === 'undefined') {
    return createAnonymousSession();
  }

  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (stored) {
      const session: AnonymousSession = JSON.parse(stored);
      
      // Check if session is expired
      if (Date.now() - session.createdAt > SESSION_EXPIRY_MS) {
        const newSession = createAnonymousSession();
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSession));
        return newSession;
      }
      
      // Update last active time
      session.lastActiveAt = Date.now();
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      return session;
    }
  } catch (e) {
    console.warn('Failed to load session from storage:', e);
  }

  // Create new session
  const newSession = createAnonymousSession();
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSession));
  return newSession;
}

export function useSession() {
  const [session, setSession] = useState<AnonymousSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sess = getOrCreateSession();
    setSession(sess);
    setIsLoading(false);
  }, []);

  return { session, isLoading };
}
