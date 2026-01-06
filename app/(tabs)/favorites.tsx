
import { DECKS } from '@/data/decks';
import React from 'react';
import { IconSymbol } from '@/components/IconSymbol';
import { useFavorites } from '@/hooks/useFavorites';
import { useTheme } from '@/contexts/ThemeContext';
import * as Haptics from 'expo-haptics';
import { colors } from '@/styles/commonStyles';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export default function FavoritesScreen() {
  const { favorites, toggleFavorite } = useFavorites();
  const { isDarkMode } = useTheme();
  
  const currentColors = isDarkMode ? colors.dark : colors.light;

  const favoriteCards = DECKS.flatMap(deck => deck.cards).filter(card =>
    favorites.includes(card.id)
  );

  const handleRemoveFavorite = (card: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleFavorite(card.id);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: currentColors.background }]}>
      <Text style={[styles.title, { color: currentColors.text }]}>Favorites</Text>

      {favoriteCards.length === 0 ? (
        <View style={styles.emptyState}>
          <IconSymbol
            ios_icon_name="heart"
            android_material_icon_name="favorite-border"
            size={64}
            color={currentColors.textSecondary}
          />
          <Text style={[styles.emptyText, { color: currentColors.textSecondary }]}>
            No favorite cards yet
          </Text>
          <Text style={[styles.emptySubtext, { color: currentColors.textSecondary }]}>
            Tap the heart icon on cards to save them here
          </Text>
        </View>
      ) : (
        <View style={styles.cardsContainer}>
          {favoriteCards.map((card) => (
            <View key={card.id} style={[styles.card, { backgroundColor: currentColors.card }]}>
              <Text style={[styles.cardText, { color: currentColors.text }]}>{card.text}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveFavorite(card)}
              >
                <IconSymbol
                  ios_icon_name="heart.fill"
                  android_material_icon_name="favorite"
                  size={24}
                  color="#FF6B9D"
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    marginTop: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    lineHeight: 24,
    paddingRight: 40,
  },
  removeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
});
