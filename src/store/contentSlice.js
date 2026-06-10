import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pages: {},
  loading: false,
  error: null,
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setContent(state, action) {
      state.pages = { ...state.pages, ...action.payload };
    },
    setContentLoading(state, action) {
      state.loading = Boolean(action.payload);
    },
    setContentError(state, action) {
      state.error = action.payload ?? null;
    },
    clearContentError(state) {
      state.error = null;
    },
  },
});

export const { setContent, setContentLoading, setContentError, clearContentError } = contentSlice.actions;
export default contentSlice.reducer;
