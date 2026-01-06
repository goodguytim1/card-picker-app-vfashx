
import { Deck } from '@/types/card';
import { magickMixerCards, midnightMagickCards } from './content';

export const DECKS: Deck[] = [
  {
    id: 'magickmixer',
    name: 'Magick Mixer',
    description: 'A Social & Interactive Icebreaker Deck (21+ Adults Only)',
    color: '#FF6B35',
    icon: '🍹',
    cards: magickMixerCards,
  },
  {
    id: 'midnightmagick',
    name: 'Midnight Magick',
    description: 'Intimacy, Sensuality & Sex (Adults Only 18+)',
    color: '#C41E3A',
    icon: '❤️',
    cards: midnightMagickCards,
  },
];
