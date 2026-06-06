import { useState, useCallback, useRef, useEffect } from 'react';
import { fetchPokemonPage, PAGE_SIZE } from '@/services/pokeapi';
import type { Pokemon } from '@/types/pokemon';

export function usePokemonList() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const offsetRef = useRef(0);
  const isFetchingRef = useRef(false);

  const loadPage = useCallback(async (offset: number, isInitial: boolean) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setError(null);

    if (isInitial) {
      setIsLoading(true);
    } else {
      setIsFetchingMore(true);
    }

    try {
      const { pokemon: newPokemon, hasMore: more } = await fetchPokemonPage(offset);
      setPokemon((prev) => (isInitial ? newPokemon : [...prev, ...newPokemon]));
      setHasMore(more);
      offsetRef.current = offset + PAGE_SIZE;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      if (isInitial) {
        setIsLoading(false);
      } else {
        setIsFetchingMore(false);
      }
      isFetchingRef.current = false;
    }
  }, []);

  const refresh = useCallback(() => {
    offsetRef.current = 0;
    setPokemon([]);
    setHasMore(true);
    loadPage(0, true);
  }, [loadPage]);

  const fetchNextPage = useCallback(() => {
    if (!hasMore || isFetchingRef.current) return;
    loadPage(offsetRef.current, false);
  }, [hasMore, loadPage]);

  useEffect(() => {
    loadPage(0, true);
  }, [loadPage]);

  return { pokemon, isLoading, isFetchingMore, hasMore, error, refresh, fetchNextPage };
}
