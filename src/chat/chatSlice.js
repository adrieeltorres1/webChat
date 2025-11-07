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
    }
  },
});

export const { setConnection, addMessage } = chatSlice.actions;

export default chatSlice.reducer;
