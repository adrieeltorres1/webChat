import { configureStore } from '@reduxjs/toolkit';
import chatReducer from '../chat/chatSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
