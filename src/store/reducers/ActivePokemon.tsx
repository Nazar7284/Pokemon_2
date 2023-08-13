import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Pokemon, PokemonActive } from "../../models/models";

const initialState: Pokemon = {
  activePokemon: {
    name: "",
    id: 0,
    sprites: {
      other: {
        dream_world: {
          front_default: "",
        },
      },
    },
    stats: [
      { base_stat: 0 },
      { base_stat: 0 },
      { base_stat: 0 },
      { base_stat: 0 },
      { base_stat: 0 },
      { base_stat: 0 },
    ],
    weight: 0,
    moves: [],
  },
};

export const activeSlice = createSlice({
  name: "activePokemon",
  initialState,
  reducers: {
    changeActivePokemon(state, action: PayloadAction<PokemonActive>) {
      state.activePokemon = action.payload;
    },
  },
});

export default activeSlice.reducer;
