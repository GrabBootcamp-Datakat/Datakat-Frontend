import { Message, MessageSender } from '@/types/message';
import { NLVQueryResponse } from '@/types/query';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface QueryState {
  queryInput: string;
  messages: Message[];
  hasUserMessages: boolean;
}

const initialState: QueryState = {
  queryInput: '',
  messages: [
    {
      id: 1,
      content:
        "Hello! I'm your AI assistant. How can I help you analyze your system data today?",
      sender: MessageSender.BOT,
      timestamp: new Date().toLocaleTimeString(),
    },
  ],
  hasUserMessages: false,
};

const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {
    setQueryInput: (state, action: PayloadAction<string>) => {
      state.queryInput = action.payload;
    },

    addUserMessage: (state, action: PayloadAction<string>) => {
      const newMessage: Message = {
        id: state.messages.length + 1,
        content: action.payload,
        sender: MessageSender.USER,
        timestamp: new Date().toLocaleTimeString(),
      };

      state.messages.push(newMessage);
      state.hasUserMessages = true;
    },

    addBotMessage: (state, action: PayloadAction<NLVQueryResponse>) => {
      const newMessage: Message = {
        id: state.messages.length + 2,
        content:
          action.payload.errorMessage ||
          `Here's the analysis for: "${action.payload.originalQuery}"`,
        sender: MessageSender.BOT,
        timestamp: new Date().toLocaleTimeString(),
        nlvQueryResponse: action.payload,
      };

      state.messages.push(newMessage);
    },

    addBotErrorMessage: (state) => {
      const newMessage: Message = {
        id: state.messages.length + 2,
        content: 'Sorry, I encountered an error while processing your request.',
        sender: MessageSender.BOT,
        timestamp: new Date().toLocaleTimeString(),
      };

      state.messages.push(newMessage);
    },
  },
});

export const {
  setQueryInput,
  addUserMessage,
  addBotMessage,
  addBotErrorMessage,
} = querySlice.actions;
export default querySlice.reducer;

export const selectQueryInput = (state: RootState) => state.query.queryInput;
export const selectMessages = (state: RootState) => state.query.messages;
export const selectHasUserMessages = (state: RootState) =>
  state.query.hasUserMessages;
