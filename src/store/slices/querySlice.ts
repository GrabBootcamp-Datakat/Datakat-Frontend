'use client';
import { Message, MessageSender } from '@/types/message';
import { NLVQueryResponse, ResultType } from '@/types/query';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface Conversation {
  messageId?: number;
  conversationId?: string;
}

export interface QueryState {
  queryInput: string;
  messages: Message[];
  hasUserMessages: boolean;
  conversation: Conversation;
}

const initialState: QueryState = {
  queryInput: '',
  messages: [
    {
      id: 0,
      content:
        "Hello! I'm your AI assistant. How can I help you analyze your system data today?",
      sender: MessageSender.BOT,
      timestamp: new Date().toLocaleTimeString(),
      nlvQueryResponse: {
        conversationId: 'conversationId',
        resultType: ResultType.TIMESERIES,
      },
    },
  ],
  hasUserMessages: false,
  conversation: {
    messageId: 0,
    conversationId: 'conversationId',
  },
};

const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {
    setConversation: (state, action: PayloadAction<Conversation>) => {
      state.conversation = action.payload;
    },

    clearConversation: (state) => {
      state.conversation = {
        messageId: undefined,
        conversationId: undefined,
      };
    },

    setQueryInput: (state, action: PayloadAction<string>) => {
      state.queryInput = action.payload;
    },

    addUserMessage: (state, action: PayloadAction<string>) => {
      let nlvQueryResponse: NLVQueryResponse | undefined;
      if (state.conversation.messageId !== undefined && state.conversation.conversationId !== undefined) {
        nlvQueryResponse = {
          conversationId: state.conversation.conversationId,
          originalQuery: state.messages[state.conversation.messageId].content,
          resultType: ResultType.TIMESERIES,
        };
      }

      const newMessage: Message = {
        id: state.messages.length,
        content: action.payload,
        sender: MessageSender.USER,
        timestamp: new Date().toLocaleTimeString(),
        nlvQueryResponse,
      };

      state.messages.push(newMessage);
      state.hasUserMessages = true;
    },

    addBotMessage: (state, action: PayloadAction<NLVQueryResponse>) => {
      const newMessage: Message = {
        id: state.messages.length,
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
        id: state.messages.length,
        content: 'Sorry, I encountered an error while processing your request.',
        sender: MessageSender.BOT,
        timestamp: new Date().toLocaleTimeString(),
      };

      state.messages.push(newMessage);
    },
  },
});

export const {
  setConversation,
  clearConversation,
  setQueryInput,
  addUserMessage,
  addBotMessage,
  addBotErrorMessage,
} = querySlice.actions;
export default querySlice.reducer;

export const selectConversation = (state: RootState) =>
  state.query.conversation;
export const selectQueryInput = (state: RootState) => state.query.queryInput;
export const selectMessages = (state: RootState) => state.query.messages;
export const selectHasUserMessages = (state: RootState) =>
  state.query.hasUserMessages;
export const selectConversationMessage = (state: RootState) => {
  if (state.query.conversation.messageId !== undefined) {
    return state.query.messages[state.query.conversation.messageId];
  }
  return null;
};
