import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface MainSlice {
  nextUrl: string | null;
  previousUrl: string | null;
  listPokemon: any;
  previousVisible: boolean;
  nextVisible: boolean;
}

const initialState: MainSlice = {
  nextUrl: "",
  previousUrl: "",
  listPokemon: [],
  previousVisible: true,
  nextVisible: true,
};

export const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    changeListPokemon(state, action: PayloadAction<any>) {
      state.listPokemon = action.payload;
    },
    changeNextUrl(state, action: PayloadAction<string>) {
      state.nextUrl = action.payload;
    },
    changePreviousUrl(state, action: PayloadAction<string>) {
      state.previousUrl = action.payload;
    },
    changeNextVisible(state, action: PayloadAction<boolean>) {
      state.nextVisible = action.payload;
    },
    changePreviousVisible(state, action: PayloadAction<boolean>) {
      state.previousVisible = action.payload;
    },
  },
});

export default mainSlice.reducer;
