// store/sidebarSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
  animate: true,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.open = !state.open;
    },
    setSidebarOpen: (state, action) => {
      state.open = action.payload;
    },
    setAnimate: (state, action) => {
      state.animate = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setAnimate } =
  sidebarSlice.actions;

export default sidebarSlice.reducer;
