import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nickname: null,
  socket: null,
  messages: [],
  onlineUsers: [] 
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
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    clearMessages: (state) => {
        state.messages = [];
    },
    clearChat: (state) => {
      if (state.socket) {
        state.socket.disconnect();
      }
      return initialState;
    }
  },
});

export const { 
    setConnection, 
    addMessage, 
    setOnlineUsers, 
    clearChat, 
    clearMessages 
} = chatSlice.actions;

export default chatSlice.reducer;