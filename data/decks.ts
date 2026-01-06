
import { Deck } from '@/types/card';
import { magickMixerCards } from './content';

export const DECKS: Deck[] = [
  {
    id: 'magickmixer',
    name: 'Magick Mixer',
    description: 'Fun icebreaker cards for social gatherings',
    color: '#FF6B9D',
    icon: 'sparkles',
    cards: magickMixerCards,
  },
];
