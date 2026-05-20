'use client';
import { useState, useCallback, useEffect } from 'react';
import { STONES } from '@/data/stoneQuestions';

const MAIN_IDS: string[] = STONES.filter(s => !s.hidden).map(s => s.id);

export function useStones() {
  const [collected, setCollected] = useState<string[]>([]);

  // Hydrate from localStorage after mount — same pattern as useStarter
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('collected-stones') ?? '[]');
      if (Array.isArray(stored) && stored.length > 0) setCollected(stored);
    } catch {}

    const handleReset = () => setCollected([]);
    window.addEventListener('gym-reset', handleReset);
    return () => window.removeEventListener('gym-reset', handleReset);
  }, []);

  const collectStone = useCallback((id: string) => {
    setCollected(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try { localStorage.setItem('collected-stones', JSON.stringify(next)); } catch {}
      const mainDone = next.filter(x => MAIN_IDS.includes(x));
      if (mainDone.length === MAIN_IDS.length) {
        try { localStorage.setItem('badge-a11y-earned', 'true'); } catch {}
        window.dispatchEvent(new CustomEvent('badge-unlocked'));
      }
      return next;
    });
  }, []);

  return {
    collected,
    collectStone,
    mainCollectedCount: collected.filter(x => MAIN_IDS.includes(x)).length,
    totalMain: MAIN_IDS.length,
  };
}
