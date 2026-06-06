import { renderHook, waitFor } from '@testing-library/react-native';
import { useDetailViewModel } from '../useDetailViewModel';
import { fetchPokemonDetailFull } from '@/services/pokeapi';
import type { PokemonDetailFull } from '@/types/pokemon';

jest.mock('@/services/pokeapi');

const mockFetch = fetchPokemonDetailFull as jest.MockedFunction<typeof fetchPokemonDetailFull>;

const bulbasaur: PokemonDetailFull = {
  id: 1,
  name: 'bulbasaur',
  primaryType: 'grass',
  imageUrl: 'https://example.com/1.png',
  height: 7,
  weight: 69,
  japaneseName: 'フシギダネ',
  region: 'Kanto',
};

beforeEach(() => jest.clearAllMocks());

describe('useDetailViewModel', () => {
  it('starts in loading state with no detail', async () => {
    // Never resolves so the loading state stays true after renderHook settles
    mockFetch.mockImplementation(() => new Promise(() => {}));
    const { result } = await renderHook(() => useDetailViewModel(1));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.detail).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('populates detail and clears loading on success', async () => {
    mockFetch.mockResolvedValue(bulbasaur);
    const { result } = await renderHook(() => useDetailViewModel(1));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.detail).toEqual(bulbasaur);
    expect(result.current.error).toBeNull();
  });

  it('sets error message and clears loading on failure', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));
    const { result } = await renderHook(() => useDetailViewModel(1));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.detail).toBeNull();
    expect(result.current.error).toBe('Network error');
  });

  it('re-fetches and updates detail when id changes', async () => {
    mockFetch.mockResolvedValue(bulbasaur);
    const { result, rerender } = await renderHook(
      ({ id }: { id: number }) => useDetailViewModel(id),
      { initialProps: { id: 1 } },
    );
    await waitFor(() => expect(result.current.detail?.name).toBe('bulbasaur'));

    const ivysaur: PokemonDetailFull = { ...bulbasaur, id: 2, name: 'ivysaur' };
    mockFetch.mockResolvedValue(ivysaur);
    rerender({ id: 2 });

    await waitFor(() => expect(result.current.detail?.name).toBe('ivysaur'));
    expect(mockFetch).toHaveBeenCalledWith(2);
  });
});
