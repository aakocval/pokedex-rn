import { useState, useCallback } from 'react';
import { fetchPokemonByType } from '@/services/pokeapi';
import { POKEMON_TYPES, type PokemonTypeName } from '@/constants/typeColors';
import type { Pokemon } from '@/types/pokemon';

export { POKEMON_TYPES, type PokemonTypeName };

export function useFilter() {
  const [selectedType, setSelectedType] = useState<PokemonTypeName | null>(null);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const applyFilter = useCallback(async (type: PokemonTypeName | null) => {
    setSelectedType(type);
    setIsSheetOpen(false);

    if (!type) {
      setFilteredPokemon([]);
      return;
    }

    setIsFiltering(true);
    try {
      const pokemon = await fetchPokemonByType(type);
      setFilteredPokemon(pokemon);
    } catch {
      setFilteredPokemon([]);
    } finally {
      setIsFiltering(false);
    }
  }, []);

  const clearFilter = useCallback(() => applyFilter(null), [applyFilter]);
  const openSheet = useCallback(() => setIsSheetOpen(true), []);
  const closeSheet = useCallback(() => setIsSheetOpen(false), []);

  return {
    selectedType,
    filteredPokemon,
    isFiltering,
    isSheetOpen,
    isActive: selectedType !== null,
    applyFilter,
    clearFilter,
    openSheet,
    closeSheet,
  };
}
