import { renderHook } from '@testing-library/react-native';
import { useHomeViewModel } from '../useHomeViewModel';
import { usePokemonList } from '@/hooks/usePokemonList';
import { useSearch } from '@/hooks/useSearch';
import { useFilter } from '@/hooks/useFilter';
import type { Pokemon } from '@/types/pokemon';

jest.mock('@/hooks/usePokemonList');
jest.mock('@/hooks/useSearch');
jest.mock('@/hooks/useFilter');

const mockUsePokemonList = usePokemonList as jest.MockedFunction<typeof usePokemonList>;
const mockUseSearch = useSearch as jest.MockedFunction<typeof useSearch>;
const mockUseFilter = useFilter as jest.MockedFunction<typeof useFilter>;

const makePokemon = (id: number, type = 'fire'): Pokemon => ({
  id,
  name: `pokemon-${id}`,
  primaryType: type,
  imageUrl: `https://example.com/${id}.png`,
});

const pagedList = [makePokemon(1), makePokemon(2)];
const searchResults = [makePokemon(3, 'water'), makePokemon(4, 'fire')];
const filteredList = [makePokemon(5, 'fire'), makePokemon(6, 'fire')];

function setupMocks(overrides: {
  isSearchActive?: boolean;
  isFilterActive?: boolean;
  selectedType?: string;
} = {}) {
  mockUsePokemonList.mockReturnValue({
    pokemon: pagedList,
    isLoading: false,
    isFetchingMore: false,
    hasMore: true,
    error: null,
    refresh: jest.fn(),
    fetchNextPage: jest.fn(),
  });

  mockUseSearch.mockReturnValue({
    query: overrides.isSearchActive ? 'char' : '',
    setQuery: jest.fn(),
    results: searchResults,
    isSearching: false,
    notFound: false,
    isActive: overrides.isSearchActive ?? false,
  });

  mockUseFilter.mockReturnValue({
    selectedType: (overrides.selectedType ?? null) as any,
    filteredPokemon: filteredList,
    isFiltering: false,
    isSheetOpen: false,
    isActive: overrides.isFilterActive ?? false,
    applyFilter: jest.fn(),
    clearFilter: jest.fn(),
    openSheet: jest.fn(),
    closeSheet: jest.fn(),
  });
}

beforeEach(() => jest.clearAllMocks());

describe('useHomeViewModel — listData derivation', () => {
  it('returns paginated list when neither search nor filter is active', async () => {
    setupMocks();
    const { result } = await renderHook(() => useHomeViewModel());

    expect(result.current.listData).toEqual(pagedList);
    expect(result.current.isPaginatedMode).toBe(true);
  });

  it('returns search results when search is active', async () => {
    setupMocks({ isSearchActive: true });
    const { result } = await renderHook(() => useHomeViewModel());

    expect(result.current.listData).toEqual(searchResults);
    expect(result.current.isPaginatedMode).toBe(false);
  });

  it('returns filtered list when filter is active and search is not', async () => {
    setupMocks({ isFilterActive: true, selectedType: 'fire' });
    const { result } = await renderHook(() => useHomeViewModel());

    expect(result.current.listData).toEqual(filteredList);
    expect(result.current.isPaginatedMode).toBe(false);
  });

  it('narrows search results by selected type when both are active', async () => {
    setupMocks({ isSearchActive: true, isFilterActive: true, selectedType: 'fire' });
    const { result } = await renderHook(() => useHomeViewModel());

    // Only the fire-type result from searchResults should remain
    expect(result.current.listData).toEqual([makePokemon(4, 'fire')]);
  });
});
