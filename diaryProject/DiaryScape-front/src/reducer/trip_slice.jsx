import { createSlice } from '@reduxjs/toolkit';

const tripSlice = createSlice({
  name: 'trip',
  initialState: {
    title: '',
    mapId: '',
    startX: 0,
    startY: 0,
    date: 0,
  },
  reducers: {
    selectTrip: (state, action) => {
      state.title = action.payload.title;
      state.mapId = action.payload.mapId;
      state.startX = action.payload.startX;
      state.startY = action.payload.startY;
      state.date = action.payload.date;
      return state;
    },
    clearTrip: (state) => {
      state.title = '';
      state.mapId = '';
      state.startX = 0;
      state.startY = 0;
      state.date = 0;
      return state;
    },
  },
});

export const { selectTrip, clearTrip } = tripSlice.actions;
export default tripSlice.reducer;
