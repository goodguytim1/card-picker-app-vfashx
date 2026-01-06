
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from '@/types/card';

const FAVORITES_KEY = '@card_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (card: Card) => {
    try {
      const isFavorite = favorites.some(f => f.id === card.id);
      let newFavorites: Card[];

      if (isFavorite) {
        newFavorites = favorites.filter(f => f.id !== card.id);
      } else {
        newFavorites = [...favorites, card];
      }

      setFavorites(newFavorites);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.log('Error toggling favorite:', error);
    }
  };

  const isFavorite = (cardId: string) => {
    return favorites.some(f => f.id === cardId);
  };

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorite,
  };
}
