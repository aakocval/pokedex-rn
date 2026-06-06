import { useFilter } from '@/hooks/useFilter';
import { usePokemonList } from '@/hooks/usePokemonList';
import { useSearch } from '@/hooks/useSearch';
import type { PokemonTypeName } from '@/constants/typeColors';
import type { Pokemon } from '@/types/pokemon';

export interface HomeViewModel {
  // List data — derived from whichever mode is active
  listData: Pokemon[];
  // Loading flags
  isLoading: boolean;
  isFetchingMore: boolean;
  isBusy: boolean;
  // Error
  error: string | null;
  // Mode
  isPaginatedMode: boolean;
  isSearchActive: boolean;
  isFilterActive: boolean;
  // Search
  query: string;
  notFound: boolean;
  // Filter
  selectedType: PokemonTypeName | null;
  isSheetOpen: boolean;
  // Actions
  setQuery: (q: string) => void;
  applyFilter: (type: PokemonTypeName | null) => void;
  clearFilter: () => void;
  openSheet: () => void;
  closeSheet: () => void;
  refresh: () => void;
  fetchNextPage: () => void;
}

export function useHomeViewModel(): HomeViewModel {
  const { pokemon, isLoading, isFetchingMore, error, refresh, fetchNextPage } =
    usePokemonList();

  const { query, setQuery, results, isSearching, notFound, isActive: isSearchActive } =
    useSearch();

  const {
    selectedType,
    filteredPokemon,
    isFiltering,
    isSheetOpen,
    isActive: isFilterActive,
    applyFilter,
    clearFilter,
    openSheet,
    closeSheet,
  } = useFilter();

  // Priority: search > filter > paginated list.
  // When both are active, narrow search results by the selected type.
  let listData: Pokemon[];
  if (isSearchActive) {
    listData = isFilterActive
      ? results.filter((p) => p.primaryType === selectedType)
      : results;
  } else if (isFilterActive) {
    listData = filteredPokemon;
  } else {
    listData = pokemon;
  }

  return {
    listData,
    isLoading,
    isFetchingMore,
    isBusy: isSearching || isFiltering,
    error,
    isPaginatedMode: !isSearchActive && !isFilterActive,
    isSearchActive,
    isFilterActive,
    query,
    notFound,
    selectedType,
    isSheetOpen,
    setQuery,
    applyFilter,
    clearFilter,
    openSheet,
    closeSheet,
    refresh,
    fetchNextPage,
  };
}
