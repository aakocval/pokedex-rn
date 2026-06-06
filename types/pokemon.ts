export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: PokemonType[];
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
}

export interface PokemonDetailFull {
  id: number;
  name: string;
  primaryType: string;
  imageUrl: string;
  height: number;
  weight: number;
  japaneseName: string;
  region: string;
}

export interface Pokemon {
  id: number;
  name: string;
  primaryType: string;
  imageUrl: string;
}
