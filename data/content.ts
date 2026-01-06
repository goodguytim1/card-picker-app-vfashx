
import { Card } from '@/types/card';

// Magick Mixer Deck - A Social & Interactive Icebreaker Deck (21+ Adults Only)
export const magickMixerCards: Card[] = [
  {
    id: 'mixer_1',
    text: 'If you\'ve ever texted an ex after midnight → take 3 sips or do 3 squats.',
    type: 'question',
    deck: 'magickmixer',
    tags: ['social', 'fun', 'icebreaker', '21+'],
    mood: 'playful',
    intensity: 2,
    isAtHome: true,
  },
  {
    id: 'mixer_2',
    text: 'If you\'ve ever said "I\'m on the way" while still at home → hop on one leg 3 times.',
    type: 'question',
    deck: 'magickmixer',
    tags: ['social', 'fun', 'icebreaker', '21+'],
    mood: 'playful',
    intensity: 1,
    isAtHome: true,
  },
  {
    id: 'mixer_3',
    text: 'If you\'ve ever caught feelings you didn\'t plan for → touch your chest and take a sip.',
    type: 'question',
    deck: 'magickmixer',
    tags: ['social', 'fun', 'icebreaker', '21+'],
    mood: 'playful',
    intensity: 2,
    isAtHome: true,
  },
];

// Midnight Magick Deck - Intimacy, Sensuality & Sex (Adults Only 18+)
export const midnightMagickCards: Card[] = [
  {
    id: 'midnight_1',
    text: 'Share a fantasy you\'ve never told anyone.',
    type: 'question',
    deck: 'datenight',
    tags: ['intimacy', 'sensuality', '18+'],
    mood: 'intimate',
    intensity: 3,
    isAtHome: true,
  },
  {
    id: 'midnight_2',
    text: 'Describe your ideal romantic evening in detail.',
    type: 'question',
    deck: 'datenight',
    tags: ['intimacy', 'romance', '18+'],
    mood: 'romantic',
    intensity: 2,
    isAtHome: true,
  },
];
