import { createSlice } from '@reduxjs/toolkit';

const startnodeSlice = createSlice({
  name: 'startnode',
  initialState: {
    reviewTitle: '',
    mapId: '',
    contentId: '',
    contentTypeId: '',
    title: '',
    tel: '',
    mapx: 0,
    mapy: 0,
    relativeX: 0,
    relativeY: 0,
    addr1: '',
  },
  reducers: {
    selectStartnode: (state, action) => {
      state.reviewtitle = action.payload.reviewTitle;
      state.mapId = action.payload.mapId;
      state.contentid = action.payload.contentid;
      state.contentTypeId = action.payload.contentTypeId;
      state.title = action.payload.title;
      state.tel = action.payload.tel;
      state.mapx = action.payload.mapx;
      state.mapy = action.payload.mapy;
      state.relativeX = action.payload.relativeX;
      state.relativeY = action.payload.relativeY;
      state.addr1 = action.payload.addr1;
      return state;
    },
    clearStartnode: (state) => {
      state.reviewTitle = '';
      state.mapId = '';
      state.contentid = '';
      state.contentTypeId = '';
      state.title = '';
      state.tel = '';
      (state.mapx = 0), (state.mapy = 0), (state.relativeX = 0);
      state.relativeY = 0;
      state.addr1 = '';
      return state;
    },
  },
});

export const { selectStartnode, clearStartnode } = startnodeSlice.actions;
export default startnodeSlice.reducer;
