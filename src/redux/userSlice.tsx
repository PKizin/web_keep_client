import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getUser } from './userAsyncThunk';
import { RootState } from '../store';

export interface UserInterface {
  id: number,
  login: string,
  password: string,
  logo?: string
}

export interface UserState {
  user: UserInterface | null,
  loading: boolean,
  failed: boolean,
  failedMessage: string
}

const initialState: UserState = {
  user: null,
  loading: false,
  failed: false,
  failedMessage: ''
}

export const signinAsync = createAsyncThunk(
  'user/signinAsync',
  async (data: { username: string, password: string }) => {
    const response = await getUser(data.username, data.password)
    return response.data
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
    },
    signin: (state, action: PayloadAction<UserInterface>) => {
      state.user = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signinAsync.pending, (state) => {
        state.loading = true
      })
      .addCase(signinAsync.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload.length > 0) {
          state.user = action.payload[0]
          state.failed = false
          state.failedMessage = ''
        }
        else {
          state.failed = true
          state.failedMessage = `User ${action.meta.arg.username} not found`
        }
      })
      .addCase(signinAsync.rejected, (state, action) => {
        state.loading = false
        state.failed = true
        state.failedMessage = `Error: ${action}`
      })
  }
})

export const { logout, signin } = userSlice.actions

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
