export const TYPE_COLORS: Record<string, string> = {
  normal:   '#C9C4BB',
  fire:     '#F5BDA0',
  water:    '#9EC8F0',
  grass:    '#A8D8A8',
  electric: '#F8E07A',
  ice:      '#B8E8F8',
  fighting: '#D67E6E',
  poison:   '#C09EC8',
  ground:   '#E0C890',
  flying:   '#C8B8F8',
  psychic:  '#F4A8B8',
  bug:      '#C6D16E',
  rock:     '#C9B890',
  ghost:    '#9890C4',
  dragon:   '#9890F8',
  dark:     '#A09098',
  steel:    '#B8B8D0',
  fairy:    '#F4B8C8',
};

// Richer, darker versions used as full-screen backgrounds on the detail screen
export const TYPE_DETAIL_COLORS: Record<string, string> = {
  normal:   '#6B6B5E',
  fire:     '#9C3412',
  water:    '#1E4E8C',
  grass:    '#2D6A31',
  electric: '#9E7B10',
  ice:      '#1D6B8B',
  fighting: '#7B1F1F',
  poison:   '#5B2D7B',
  ground:   '#7B5219',
  flying:   '#3A5480',
  psychic:  '#8B1A57',
  bug:      '#4A6B1A',
  rock:     '#6B5533',
  ghost:    '#3A3A7B',
  dragon:   '#1A1A8B',
  dark:     '#3D5060',
  steel:    '#3A4A5A',
  fairy:    '#8B3A70',
};

export const POKEMON_TYPES = Object.keys(TYPE_COLORS) as PokemonTypeName[];

export type PokemonTypeName = keyof typeof TYPE_COLORS;
