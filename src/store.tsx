import { configureStore } from '@reduxjs/toolkit';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import { getUserEpic, getUserPendingEpic, getUserFulfilledEpic} from './redux/userEpic';
import userReducer from './redux/userSlice';
import messageReducer from './redux/messageSlice';

const epicMiddleware = createEpicMiddleware()

export const store = configureStore({
  reducer: {
    user: userReducer,
    message: messageReducer
  },
  middleware: [epicMiddleware]
})

epicMiddleware.run(combineEpics(
  getUserEpic, getUserPendingEpic, getUserFulfilledEpic
))

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
