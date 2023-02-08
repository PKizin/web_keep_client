import { createAsyncThunk, createSlice, isAnyOf, isFulfilled, isPending, isRejected, PayloadAction } from '@reduxjs/toolkit';
import { postUser, getUser } from './userAsyncThunk';
import { RootState } from '../store';

export interface UserInterface {
  id: number,
  login: string,
  password: string,
  logo?: string
}

export interface UserState {
  user: UserInterface | null,
  loading: boolean
}

const initialState: UserState = {
  user: null,
  loading: false
}

export const signinAsync = createAsyncThunk(
  'user/signinAsync',
  async (data: { username: string, password: string }) => {
    const response = await getUser(data.username, data.password)
    return response.data
  }
)

export const signupAsync = createAsyncThunk(
  'user/signupAsync',
  async (data: { username: string, password: string }) => {
    await postUser(data.username, data.password)
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
      .addCase(signinAsync.fulfilled, (state, action) => {
        if (action.payload.length > 0) {
          state.user = action.payload[0]
        }
      })
      .addMatcher(isPending, (state) => {
        state.loading = true
      })
      .addMatcher(isAnyOf(isFulfilled, isRejected), (state) => {
        state.loading = false
      })
  }
})

export const { logout, signin } = userSlice.actions

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
