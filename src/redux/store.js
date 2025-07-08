// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./sidebarSlice";

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
  },
});
