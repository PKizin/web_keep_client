import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { signinAsync, signupAsync } from './userSlice'

export interface MessageInterface {
  id?: number,
  text: string,
  type: 'success' | 'warning' | 'danger'
}

export interface MessageState {
  message: MessageInterface | null
}

const initialState: MessageState = {
  message: null
}

export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    push: (state, action: PayloadAction<MessageInterface>) => {
      state.message = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signinAsync.fulfilled, (state, action) => {
        if (action.payload.length > 0) {
          state.message = { 
            text: `User "${action.meta.arg.username}" logged in`, 
            type: 'success' 
          }
        }
        else {
          state.message = {
            text: `User "${action.meta.arg.username}" not found`,
            type: 'danger'
          }
        }
      })
      .addCase(signinAsync.rejected, (state, action) => {
        state.message = {
          text: `Error: ${action}`,
          type: 'danger'
        }
      })
      .addCase(signupAsync.fulfilled, (state, action) => {
        state.message = {
          text: `User "${action.meta.arg.username}" added`,
          type: 'success'
        }
      })
      .addCase(signupAsync.rejected, (state, action) => {
        state.message = {
          text: `Error: ${action}`,
          type: 'danger'
        }
      })
  }
})

export const { push } = messageSlice.actions

export const selectMessage = (state: RootState) => state.message

export default messageSlice.reducer
