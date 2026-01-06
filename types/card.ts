
export interface Card {
  id: string;
  text: string;
  type: 'question' | 'mission';
  deck: 'connection' | 'datenight' | 'challenge' | 'sparkquestions' | 'mirrormoments' | 'playfulsparks' | 'bondbuilders' | 'adventuresparks' | 'creativecharms' | 'magickmixer';
  tags: string[];
  recommendationType?: string;
  businessCategories?: string[];
  mood?: string;
  intensity?: number;
  isAtHome?: boolean;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  cards: Card[];
}

export interface FavoriteCard {
  cardId: string;
  timestamp: number;
}
