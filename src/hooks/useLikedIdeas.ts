import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'ruf-liked-ideas';

export function useLikedIdeas() {
  const [likedIds, setLikedIds] = useState<string[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    try {
      return stored ? JSON.parse(stored) as string[] : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(likedIds));
  }, [likedIds]);

  const toggleLike = useCallback((id: string) => {
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const clearAll = useCallback(() => setLikedIds([]), []);

  const isLiked = useCallback((id: string) => likedIds.includes(id), [likedIds]);

  return { likedIds, toggleLike, clearAll, isLiked };
}
