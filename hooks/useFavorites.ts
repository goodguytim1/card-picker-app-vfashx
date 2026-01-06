
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, FavoriteCard } from '@/types/card';

const FAVORITES_KEY = '@card_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteCard[]>([]);

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
      const isFav = favorites.some((fav) => fav.cardId === cardId);
      let newFavorites: FavoriteCard[];

      if (isFav) {
        newFavorites = favorites.filter((fav) => fav.cardId !== cardId);
      } else {
        newFavorites = [...favorites, { cardId, timestamp: Date.now() }];
      }

      setFavorites(newFavorites);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const isFavorite = (cardId: string): boolean => {
    return favorites.some((fav) => fav.cardId === cardId);
  };

  return { favorites, toggleFavorite, isFavorite };
};
