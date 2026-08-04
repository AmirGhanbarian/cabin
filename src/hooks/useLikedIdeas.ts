import { useState, useCallback } from 'react';

const STORAGE_KEY = 'kitchenchoob-liked-ideas';

export function useLikedIdeas() {
  const [likedIds, setLikedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const toggleLike = useCallback((id: string) => {
    setLikedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isLiked = useCallback((id: string) => likedIds.includes(id), [likedIds]);

  return { likedIds, toggleLike, isLiked };
}
