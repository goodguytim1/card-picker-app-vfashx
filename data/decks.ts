
import { Deck } from '@/types/card';
import { sparkQuestionsCards, mirrorMomentsCards } from './content';

export const DECKS: Deck[] = [
  {
    id: 'sparkquestions',
    name: 'Spark Questions',
    description: 'Fun, lighthearted questions to break the ice and spark conversation',
    color: '#FF6B6B',
    icon: 'sparkles',
    cards: sparkQuestionsCards,
  },
  {
    id: 'mirrormoments',
    name: 'Mirror Moments',
    description: 'Deep, reflective questions for meaningful connections',
    color: '#4ECDC4',
    icon: 'heart.circle',
    cards: mirrorMomentsCards,
  },
];
