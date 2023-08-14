import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface MainSlice {
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

const initialState: MainSlice = {
  nextUrl: "",
  previousUrl: "",
  listPokemon: [],
  previousVisible: true,
  nextVisible: true,
  defaultImage:
    "https://pm1.narvii.com/6532/8441679e98967e38588e00e7a65f788ca0f820ee_00.jpg",
  isTypeView: false,
  offset: 0,
  currentUrlType: "",
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
    changeIsTypeView(state, action: PayloadAction<boolean>) {
      state.isTypeView = action.payload;
    },
    changeOffset(state, action: PayloadAction<number>) {
      state.offset = action.payload;
    },
    changeCurrentUrlType(state, action: PayloadAction<string>) {
      state.currentUrlType = action.payload;
    },
  },
});

export default mainSlice.reducer;
