import { useState, useEffect, useRef } from 'react';
import { searchPokemonByKeyword } from '@/services/pokeapi';
import type { Pokemon } from '@/types/pokemon';

const DEBOUNCE_MS = 350;

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Pokemon[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setNotFound(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setNotFound(false);

    debounceRef.current = setTimeout(async () => {
      try {
        const matches = await searchPokemonByKeyword(trimmed);
        setResults(matches);
        setNotFound(matches.length === 0);
      } catch {
        setResults([]);
        setNotFound(true);
      } finally {
        setIsSearching(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const isActive = query.trim().length > 0;

  return { query, setQuery, results, isSearching, notFound, isActive };
}
