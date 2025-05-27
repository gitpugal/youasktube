import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  chats: any;
}

const initialState: ChatState = {
  chats: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatIds(state, action: PayloadAction<any[]>) {
      state.chats = action.payload;
    },
    deleteChatId(state, action: PayloadAction<string>) {
      state.chats = state.chats.filter(
        (chat: any) => chat?.id !== action.payload
      );
    },
    addChatId(state, action: PayloadAction<any>) {
      state.chats = [...state.chats, action.payload];
    },
  },
});

export const { setChatIds, deleteChatId, addChatId } = chatSlice.actions;
export default chatSlice.reducer;
