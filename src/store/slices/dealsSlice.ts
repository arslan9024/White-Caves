import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DealsState {
  totalPipelineValue: number;
  dealOfTheMonth: {
    agent: string;
    value: number;
    property: string;
  };
}

const initialState: DealsState = {
  totalPipelineValue: 45000000,
  dealOfTheMonth: {
    agent: 'Michael Ross',
    value: 12500000,
    property: 'Palm Jumeirah Signature Villa',
  },
};

const dealsSlice = createSlice({
  name: 'deals',
  initialState,
  reducers: {
    updatePipelineValue: (state, action: PayloadAction<number>) => {
      state.totalPipelineValue = action.payload;
    },
  },
});

export const { updatePipelineValue } = dealsSlice.actions;
export default dealsSlice.reducer;
