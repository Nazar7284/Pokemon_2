export interface Sprite {
  other: {
    dream_world: {
      front_default: string;
    };
  };
}

export interface Stat {
  base_stat: number;
}

export interface Move {
  move: {
    name: string;
    url: string;
  };
}

export interface PokemonActive {
  name: string;
  id: number;
  sprites: Sprite;
  stats: Stat[];
  weight: number;
  moves: Move[];
}

export interface Type {
  type: {
    name: string;
    url: string;
  };
}

export interface Types {
  name: string;
  url: string;
}

export interface ListPokemon {
  name: string;
  id: number;
  sprites: Sprite;
  types: Type[];
}

export interface Pokemon {
  activePokemon: PokemonActive;
}

export interface CardPokemonProps {
  name: string;
  types: Type[];
  photo: string;
}

export interface MainSlice {
  nextUrl: string | null;
  previousUrl: string | null;
  listPokemon: any;
  previousVisible: boolean;
  nextVisible: boolean;
  defaultImage: string;
  isTypeView: boolean;
  offset: number;
  currentUrlType: string;
}
