"use client";

import { useEffect, useState } from "react";
import { getOrCreateSession, type AnonymousSession } from "@lib/auth/session";

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
