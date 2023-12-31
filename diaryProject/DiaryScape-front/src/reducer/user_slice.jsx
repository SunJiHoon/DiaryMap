import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    name: '',
    id: '',
    isLoading: false,
    isLogin: null,
  },
  reducers: {
    loginUser: (state, action) => {
      state.name = action.payload.name;
      state.id = action.payload.loginId;
      state.isLogin = true;
      return state;
    },
    clearUser: (state) => {
      state.name = '';
      state.id = '';
      state.isLogin = false;
      return state;
    },
  },
});

export const { loginUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
