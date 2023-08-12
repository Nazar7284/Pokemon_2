import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  nextUrl: "",
  previousUrl: "",
  listPokemon: [],
};

export const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    changeListPokemon(state, action: PayloadAction<any>) {
      state.listPokemon = action.payload;
    },
    addListPokemon(state, action: PayloadAction<any>) {
      state.listPokemon.push(action.payload);
    },
    changeNextUrl(state, action: PayloadAction<string>) {
      state.nextUrl = action.payload;
    },
    changePreviousUrl(state, action: PayloadAction<string>) {
      state.previousUrl = action.payload;
    },
  },
});

export default mainSlice.reducer;
