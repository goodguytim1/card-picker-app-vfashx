
export interface Card {
  id: string;
  title: string;
  description: string;
  deckId: string;
  emoji: string;
}

export interface Deck {
  id: string;
  name: string;
  emoji: string;
  color: string;
  cards: Card[];
}
