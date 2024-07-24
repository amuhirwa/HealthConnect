import { createSlice } from '@reduxjs/toolkit';

// Default values for shared host
const initialState = {
  usersLogin: [],
};

const sharedDataSlice = createSlice({
  name: 'HealthConnect',
  initialState,
  reducers: {
    addUserLogin: (state, action) => {
      const users = action.payload;
      state.usersLogin = users;
    },
    resetStateToDefault: (state, action) => {
      // Reset state to initial values
      state.usersLogin = [];
    },
  },
});

export const {
  addUserLogin,
  resetStateToDefault,
} = sharedDataSlice.actions;

export default sharedDataSlice.reducer;
