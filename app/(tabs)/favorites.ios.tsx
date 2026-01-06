
import React from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { DECKS } from '@/data/decks';
import { colors } from '@/styles/commonStyles';
import * as Haptics from 'expo-haptics';

export default function FavoritesScreen() {
  const { favorites, toggleFavorite } = useFavorites();

  const favoriteCards = DECKS.flatMap(deck => deck.cards).filter(card =>
    favorites.includes(card.id)
  );

  const handleRemoveFavorite = (card: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleFavorite(card.id);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Favorites</Text>
      
      {favoriteCards.length === 0 ? (
        <View style={styles.emptyState}>
          <IconSymbol 
            ios_icon_name="heart" 
            android_material_icon_name="favorite-border" 
            size={64} 
            color={colors.grey} 
          />
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubtext}>
            Tap the heart icon on cards to save them here
          </Text>
        </View>
      ) : (
        favoriteCards.map((card) => (
          <View key={card.id} style={styles.card}>
            <Text style={styles.cardText}>{card.text}</Text>
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
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
    marginTop: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.subtitleText,
    marginTop: 8,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.deckCard,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  removeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
});
