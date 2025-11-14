import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nickname: null,
  socket: null,
  messages: [],
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConnection: (state, action) => {
      state.nickname = action.payload.nickname;
      state.socket = action.payload.socket;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearChat: (state) => {
      if (state.socket) {
        state.socket.disconnect();
      }
      state.nickname = null;
      state.socket = null;
      state.messages = [];
    },
    clearMessages: (state) => {
        state.messages = [];
    }
  },
});

export const { setConnection, addMessage, clearChat, clearMessages } = chatSlice.actions;

export default chatSlice.reducer;