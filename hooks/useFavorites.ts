
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from '@/types/card';

const FAVORITES_KEY = '@card_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

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
      console.error('Error loading favorites:', error);
    }
  };

  const toggleFavorite = async (cardId: string) => {
    try {
      const newFavorites = favorites.includes(cardId)
        ? favorites.filter(id => id !== cardId)
        : [...favorites, cardId];
      
      setFavorites(newFavorites);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const isFavorite = (cardId: string) => {
    return favorites.includes(cardId);
  };

  return { favorites, toggleFavorite, isFavorite };
};
