export interface Message {
  id: string;
  message: string;
  author: string;
  createdAt: string;
}

export interface SendMessagePayload {
  message: string;
  author: string;
}
