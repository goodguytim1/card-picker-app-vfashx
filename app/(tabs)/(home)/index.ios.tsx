
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { DECKS } from '@/data/decks';
import { Card, Deck } from '@/types/card';
import { useFavorites } from '@/hooks/useFavorites';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  interpolate,
} from 'react-native-reanimated';
import { IconSymbol } from '@/components/IconSymbol';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 80;

export default function HomeScreen() {
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  
  const flipAnimation = useSharedValue(0);
  const favoriteAnimation = useSharedValue(0);

  const drawCard = (deck: Deck | null) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    let cardPool: Card[] = [];
    
    if (deck) {
      cardPool = deck.cards;
    } else {
      // Draw from all decks
      DECKS.forEach(d => {
        cardPool = [...cardPool, ...d.cards];
      });
    }

    const randomIndex = Math.floor(Math.random() * cardPool.length);
    const card = cardPool[randomIndex];

    // Trigger flip animation
    flipAnimation.value = withSequence(
      withSpring(1, { damping: 15, stiffness: 100 }),
      withSpring(0, { damping: 15, stiffness: 100 })
    );

    setCurrentCard(card);
  };

  const handleToggleFavorite = (card: Card) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    toggleFavorite(card);
    
    // Trigger favorite animation
    favoriteAnimation.value = withSequence(
      withSpring(1, { damping: 10, stiffness: 200 }),
      withSpring(0, { damping: 10, stiffness: 200 })
    );
  };

  const cardAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipAnimation.value, [0, 1], [0, 180]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
    };
  });

  const favoriteAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(favoriteAnimation.value, [0, 1], [1, 1.3]);
    return {
      transform: [{ scale }],
    };
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Card Deck Picker</Text>
          <Text style={styles.subtitle}>Choose a deck and draw your card</Text>
        </View>

        {/* Deck Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select a Deck</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.deckScroll}
          >
            {DECKS.map((deck, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  key={deck.id}
                  style={[
                    styles.deckCard,
                    selectedDeck?.id === deck.id && styles.deckCardSelected,
                    { borderColor: deck.color }
                  ]}
                  onPress={() => setSelectedDeck(deck)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deckEmoji}>{deck.emoji}</Text>
                  <Text style={styles.deckName}>{deck.name}</Text>
                  <Text style={styles.deckCount}>{deck.cards.length} cards</Text>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </ScrollView>
        </View>

        {/* Draw Buttons */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.drawButton, { backgroundColor: selectedDeck?.color || colors.primary }]}
            onPress={() => drawCard(selectedDeck)}
            activeOpacity={0.8}
          >
            <IconSymbol
              ios_icon_name="sparkles"
              android_material_icon_name="auto-awesome"
              size={24}
              color="#FFFFFF"
            />
            <Text style={styles.drawButtonText}>
              {selectedDeck ? `Draw from ${selectedDeck.name}` : 'Select a Deck'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.drawButton, styles.drawAllButton]}
            onPress={() => drawCard(null)}
            activeOpacity={0.8}
          >
            <IconSymbol
              ios_icon_name="shuffle"
              android_material_icon_name="shuffle"
              size={24}
              color="#FFFFFF"
            />
            <Text style={styles.drawButtonText}>Draw from All Decks</Text>
          </TouchableOpacity>
        </View>

        {/* Current Card Display */}
        {currentCard && (
          <View style={styles.section}>
            <Animated.View style={[styles.cardDisplay, cardAnimatedStyle]}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardEmoji}>{currentCard.emoji}</Text>
                <TouchableOpacity
                  onPress={() => handleToggleFavorite(currentCard)}
                  style={styles.favoriteButton}
                  activeOpacity={0.7}
                >
                  <Animated.View style={favoriteAnimatedStyle}>
                    <IconSymbol
                      ios_icon_name={isFavorite(currentCard.id) ? "heart.fill" : "heart"}
                      android_material_icon_name={isFavorite(currentCard.id) ? "favorite" : "favorite-border"}
                      size={28}
                      color={isFavorite(currentCard.id) ? colors.secondary : colors.textSecondary}
                    />
                  </Animated.View>
                </TouchableOpacity>
              </View>
              <Text style={styles.cardTitle}>{currentCard.title}</Text>
              <Text style={styles.cardDescription}>{currentCard.description}</Text>
              <View style={styles.cardDeckBadge}>
                <Text style={styles.cardDeckText}>
                  {DECKS.find(d => d.id === currentCard.deckId)?.name}
                </Text>
              </View>
            </Animated.View>
          </View>
        )}

        {/* Favorites Preview */}
        {favorites.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Favorites ({favorites.length})</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.favoritesScroll}
            >
              {favorites.map((card, index) => (
                <React.Fragment key={index}>
                  <TouchableOpacity
                    key={card.id}
                    style={styles.favoriteCard}
                    onPress={() => {
                      setCurrentCard(card);
                      flipAnimation.value = withSequence(
                        withSpring(1, { damping: 15, stiffness: 100 }),
                        withSpring(0, { damping: 15, stiffness: 100 })
                      );
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.favoriteCardEmoji}>{card.emoji}</Text>
                    <Text style={styles.favoriteCardTitle} numberOfLines={2}>
                      {card.title}
                    </Text>
                  </TouchableOpacity>
                </React.Fragment>
              ))}
            </ScrollView>
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
    paddingTop: 20,
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  deckScroll: {
    paddingRight: 20,
  },
  deckCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginRight: 12,
    alignItems: 'center',
    width: 120,
    borderWidth: 2,
    borderColor: colors.highlight,
    boxShadow: '0px 4px 12px rgba(124, 58, 237, 0.1)',
    elevation: 3,
  },
  deckCardSelected: {
    borderWidth: 3,
    boxShadow: '0px 6px 16px rgba(124, 58, 237, 0.2)',
    elevation: 5,
  },
  deckEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  deckName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  deckCount: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  drawButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    boxShadow: '0px 4px 12px rgba(124, 58, 237, 0.3)',
    elevation: 4,
  },
  drawAllButton: {
    backgroundColor: colors.accent,
  },
  drawButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  cardDisplay: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.highlight,
    boxShadow: '0px 8px 24px rgba(124, 58, 237, 0.15)',
    elevation: 6,
    minHeight: 300,
    width: CARD_WIDTH,
    alignSelf: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  cardEmoji: {
    fontSize: 64,
  },
  favoriteButton: {
    padding: 8,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  cardDeckBadge: {
    backgroundColor: colors.highlight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cardDeckText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  favoritesScroll: {
    paddingRight: 20,
  },
  favoriteCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    width: 100,
    borderWidth: 1,
    borderColor: colors.highlight,
    boxShadow: '0px 2px 8px rgba(124, 58, 237, 0.1)',
    elevation: 2,
  },
  favoriteCardEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  favoriteCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
});
