import { useEffect, useState } from 'react';
import { fetchPokemonDetailFull } from '@/services/pokeapi';
import type { PokemonDetailFull } from '@/types/pokemon';

export interface DetailViewModel {
  detail: PokemonDetailFull | null;
  isLoading: boolean;
  error: string | null;
}

export function useDetailViewModel(id: number): DetailViewModel {
  const [detail, setDetail] = useState<PokemonDetailFull | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setError(null);

    fetchPokemonDetailFull(id)
      .then(setDetail)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Failed to load'),
      )
      .finally(() => setIsLoading(false));
  }, [id]);

  return { detail, isLoading, error };
}
