import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LanguageState {
  code: string;
  isRtl: boolean;
}

const initialState: LanguageState = {
  code: 'en',
  isRtl: false,
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
      state.isRtl = action.payload === 'ar';
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
