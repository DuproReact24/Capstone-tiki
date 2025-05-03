// lib/features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
  user: {
    id: string;
    phone?: string;
  } | null;
   nameUser: string | null;
 }

const initialState: AuthState = {
  accessToken: null,
  user: null,
  nameUser:null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: AuthState['user'],token:any }>) => {
 
      state.accessToken = action.payload.token
      state.user = action.payload.user
    
    },
    setNameUser: (state, action: PayloadAction<{ user:any }>) => {
      
      state.nameUser = action.payload.user
     

    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
    },
  },
});

export const { setAuth, logout,setNameUser } = authSlice.actions;
export default authSlice.reducer;
