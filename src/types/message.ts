import { NLVQueryResponse } from './query';

export enum MessageSender {
  USER = 'user',
  BOT = 'bot',
}

export interface Message {
  id: number;
  content: string;
  sender: MessageSender;
  timestamp: string;
  nlvQueryResponse?: NLVQueryResponse;
}
