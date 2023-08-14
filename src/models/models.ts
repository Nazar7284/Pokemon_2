export interface PokemonActive {
  name: string;
  id: number;
  sprites: {
    other: {
      dream_world: {
        front_default: string;
      };
    };
  };
  stats: {
    base_stat: number;
  }[];
  weight: number;
  moves: {
    move: {
      name: string;
      url: string;
    };
  }[];
}

export interface Pokemon {
  activePokemon: PokemonActive;
}

export interface Type {
  name: string;
  url: string;
}

export interface Type {
  type: {
    name: string;
    url: string;
  };
}

export interface CardPokemonProps {
  name: string;
  types: Type[];
  photo: string;
}
