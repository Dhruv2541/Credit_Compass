// useIntroSession.js
import { useState, useCallback } from 'react';

const SESSION_KEY = 'credit_compass_intro_played';

export function useIntroSession() {
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      return !sessionStorage.getItem(SESSION_KEY);
    }
    return false; // Fail safe to not block server-side rendering or environments without session storage
  });

  const completeIntro = useCallback(() => {
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(SESSION_KEY, 'true');
    }
    setShowIntro(false);
  }, []);

  return {
    showIntro,
    completeIntro
  };
}
