import type { Pokemon, PokemonDetailFull, PokemonListItem, PokemonListResponse, PokemonDetail } from '@/types/pokemon';

const GENERATION_TO_REGION: Record<string, string> = {
  'generation-i':    'Kanto',
  'generation-ii':   'Johto',
  'generation-iii':  'Hoenn',
  'generation-iv':   'Sinnoh',
  'generation-v':    'Unova',
  'generation-vi':   'Kalos',
  'generation-vii':  'Alola',
  'generation-viii': 'Galar',
  'generation-ix':   'Paldea',
};

const BASE_URL = 'https://pokeapi.co/api/v2';
export const PAGE_SIZE = 20;
const SEARCH_LIMIT = 20;

// Fetched once per app session, then reused for all searches
let allNamesCache: PokemonListItem[] | null = null;

function getIdFromUrl(url: string): number {
  return parseInt(url.split('/').filter(Boolean).pop() ?? '0', 10);
}

function detailToPokemon(detail: PokemonDetail): Pokemon {
  return {
    id: detail.id,
    name: detail.name,
    primaryType: detail.types[0]?.type.name ?? 'normal',
    imageUrl:
      detail.sprites.other['official-artwork'].front_default ??
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${detail.id}.png`,
  };
}

export async function fetchAllPokemonNames(): Promise<PokemonListItem[]> {
  if (allNamesCache) return allNamesCache;
  const res = await fetch(`${BASE_URL}/pokemon?limit=1500`);
  if (!res.ok) throw new Error('Failed to fetch Pokémon names');
  const data: PokemonListResponse = await res.json();
  allNamesCache = data.results;
  return allNamesCache;
}

export async function fetchPokemonById(id: number): Promise<Pokemon> {
  const res = await fetch(`${BASE_URL}/pokemon/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch Pokémon #${id}`);
  return detailToPokemon(await res.json());
}

export async function fetchPokemonPage(offset: number): Promise<{
  pokemon: Pokemon[];
  hasMore: boolean;
}> {
  const listRes = await fetch(`${BASE_URL}/pokemon?limit=${PAGE_SIZE}&offset=${offset}`);
  if (!listRes.ok) throw new Error(`Failed to fetch list: ${listRes.status}`);
  const listData: PokemonListResponse = await listRes.json();

  const pokemon = await Promise.all(
    listData.results.map((item) => fetchPokemonById(getIdFromUrl(item.url)))
  );

  return { pokemon, hasMore: listData.next !== null };
}

interface TypeResponse {
  pokemon: Array<{ pokemon: PokemonListItem; slot: number }>;
}

export async function fetchPokemonByType(typeName: string): Promise<Pokemon[]> {
  const res = await fetch(`${BASE_URL}/type/${typeName}`);
  if (!res.ok) throw new Error(`Failed to fetch type: ${typeName}`);
  const data: TypeResponse = await res.json();
  // Limit to 40 — types like water/normal have 100+ entries
  const limited = data.pokemon.slice(0, 40);
  return Promise.all(limited.map((entry) => fetchPokemonById(getIdFromUrl(entry.pokemon.url))));
}

interface SpeciesResponse {
  generation: { name: string };
  names: Array<{ name: string; language: { name: string } }>;
}

export async function fetchPokemonDetailFull(id: number): Promise<PokemonDetailFull> {
  const [detailRes, speciesRes] = await Promise.all([
    fetch(`${BASE_URL}/pokemon/${id}`),
    fetch(`${BASE_URL}/pokemon-species/${id}`),
  ]);
  if (!detailRes.ok) throw new Error(`Failed to fetch Pokémon #${id}`);
  if (!speciesRes.ok) throw new Error(`Failed to fetch species #${id}`);

  const detail: PokemonDetail = await detailRes.json();
  const species: SpeciesResponse = await speciesRes.json();

  const japaneseName =
    species.names.find((n) => n.language.name === 'ja-Hrkt')?.name ??
    species.names.find((n) => n.language.name === 'ja')?.name ??
    '';
  const region = GENERATION_TO_REGION[species.generation.name] ?? 'Unknown';

  return {
    id: detail.id,
    name: detail.name,
    primaryType: detail.types[0]?.type.name ?? 'normal',
    imageUrl: detail.sprites.other['official-artwork'].front_default,
    height: detail.height,
    weight: detail.weight,
    japaneseName,
    region,
  };
}

export async function searchPokemonByKeyword(keyword: string): Promise<Pokemon[]> {
  const allNames = await fetchAllPokemonNames();
  const lower = keyword.toLowerCase();
  const matches = allNames
    .filter((item) => item.name.includes(lower))
    .slice(0, SEARCH_LIMIT);

  if (matches.length === 0) return [];

  return Promise.all(matches.map((item) => fetchPokemonById(getIdFromUrl(item.url))));
}
