export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  coverUrl: string;
  description: string;
  category: string;
  rating: number;
  isBestseller?: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
}

export enum ViewState {
  HOME = 'HOME',
  DETAIL = 'DETAIL',
  SEARCH = 'SEARCH'
}

export interface CartItem extends Book {
  quantity: number;
}
