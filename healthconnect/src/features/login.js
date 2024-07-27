import { createAsyncThunk } from '@reduxjs/toolkit';
import CreateAxiosInstance from "./axios";
import { addUserLogin, addProfile } from "./SharedData";

const instance = CreateAxiosInstance();

export const loginUser = createAsyncThunk(
  'user/login',
  async (values, { dispatch }) => {
    try {
      const response = await instance.post('/login', values);
      if (response.data) {
        dispatch(addUserLogin(response.data));

        const profileResponse = await instance.get('/get_profile');
        dispatch(addProfile(profileResponse.data));

        return true;
      }
    } catch (error) {
      throw error;
    }
  }
);
