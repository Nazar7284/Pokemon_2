import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import MainReducer from "./reducers/MainSlice";
const rootReducer = combineReducers({ MainReducer });

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
