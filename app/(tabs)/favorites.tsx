
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { useFavorites } from '@/hooks/useFavorites';
import { IconSymbol } from '@/components/IconSymbol';
import { DECKS } from '@/data/decks';
import * as Haptics from 'expo-haptics';

export default function FavoritesScreen() {
  const { favorites, toggleFavorite } = useFavorites();

  const handleRemoveFavorite = (card: any) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    toggleFavorite(card);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Favorites</Text>
          <Text style={styles.subtitle}>
            {favorites.length} {favorites.length === 1 ? 'card' : 'cards'} saved
          </Text>
        </View>

        {/* Favorites List */}
        {favorites.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol
              ios_icon_name="heart"
              android_material_icon_name="favorite-border"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptyText}>
              Draw cards and tap the heart icon to save your favorites
            </Text>
          </View>
        ) : (
          <View style={styles.cardsGrid}>
            {favorites.map((card, index) => {
              const deck = DECKS.find(d => d.id === card.deckId);
              return (
                <React.Fragment key={index}>
                  <View key={card.id} style={styles.card}>
                    <View style={styles.cardContent}>
                      <Text style={styles.cardEmoji}>{card.emoji}</Text>
                      <Text style={styles.cardTitle}>{card.title}</Text>
                      <Text style={styles.cardDescription} numberOfLines={3}>
                        {card.description}
                      </Text>
                      {deck && (
                        <View style={[styles.deckBadge, { backgroundColor: deck.color + '20' }]}>
                          <Text style={[styles.deckBadgeText, { color: deck.color }]}>
                            {deck.emoji} {deck.name}
                          </Text>
                        </View>
                      )}
                    </View>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveFavorite(card)}
                      activeOpacity={0.7}
                    >
                      <IconSymbol
                        ios_icon_name="heart.fill"
                        android_material_icon_name="favorite"
                        size={24}
                        color={colors.secondary}
                      />
                    </TouchableOpacity>
                  </View>
                </React.Fragment>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'android' ? 48 : 20,
    paddingBottom: 120,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  cardsGrid: {
    gap: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: colors.highlight,
    boxShadow: '0px 4px 12px rgba(124, 58, 237, 0.1)',
    elevation: 3,
    position: 'relative',
  },
  cardContent: {
    alignItems: 'center',
  },
  cardEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  deckBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  deckBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  removeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
});
