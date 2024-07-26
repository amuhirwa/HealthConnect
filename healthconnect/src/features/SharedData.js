import { createSlice } from '@reduxjs/toolkit';

// Default values for shared host
const initialState = {
  usersLogin: [],
  page: "dashboard",
};

const sharedDataSlice = createSlice({
  name: 'HealthConnect',
  initialState,
  reducers: {
    addUserLogin: (state, action) => {
      const users = action.payload;
      state.usersLogin = users;
    },
    changepage: (state, action) => {
      state.page = action.payload;
    },
    resetStateToDefault: (state, action) => {
      // Reset state to initial values
      state.usersLogin = [];
      state.page = "dashboard";
    },
  },
});

export const {
  addUserLogin,
  changepage,
  resetStateToDefault,
} = sharedDataSlice.actions;

export default sharedDataSlice.reducer;
