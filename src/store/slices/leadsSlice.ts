import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Lead {
  id: string;
  name: string;
  score: number;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
}

interface LeadsState {
  activeLeadId: string | null;
  list: Lead[];
}

const initialState: LeadsState = {
  activeLeadId: 'L-100',
  list: [
    { id: 'L-100', name: 'James Carter', score: 88, status: 'new' },
    { id: 'L-101', name: 'Sarah Ahmed', score: 92, status: 'contacted' },
  ],
};

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setActiveLead: (state, action: PayloadAction<string>) => {
      state.activeLeadId = action.payload;
    },
    updateLeadScore: (state, action: PayloadAction<{ id: string; score: number }>) => {
      const lead = state.list.find(l => l.id === action.payload.id);
      if (lead) lead.score = action.payload.score;
    },
  },
});

export const { setActiveLead, updateLeadScore } = leadsSlice.actions;
export default leadsSlice.reducer;
