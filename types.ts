
export enum Sender {
  User = 'user',
  Bot = 'bot',
}

export interface Message {
  id: string;
  sender: Sender;
  text: string;
}
