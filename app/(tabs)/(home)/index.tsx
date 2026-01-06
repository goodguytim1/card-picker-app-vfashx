
import React, { useState } from 'react';
import { DECKS } from '@/data/decks';
import { IconSymbol } from '@/components/IconSymbol';
import { useFavorites } from '@/hooks/useFavorites';
import { useTheme } from '@/contexts/ThemeContext';
import * as Haptics from 'expo-haptics';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { Card, Deck } from '@/types/card';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  interpolate,
} from 'react-native-reanimated';
import { colors } from '@/styles/commonStyles';

const CARD_WIDTH = Dimensions.get('window').width - 80;

export default function HomeScreen() {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const { favorites, toggleFavorite, isCardFavorite } = useFavorites();
  const { isDarkMode } = useTheme();
  
  const flipRotation = useSharedValue(0);
  const heartScale = useSharedValue(1);

  const currentColors = isDarkMode ? colors.dark : colors.light;

  const drawCard = (deck: Deck | null) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const cardsPool = deck ? deck.cards : DECKS.flatMap(d => d.cards);
    const randomCard = cardsPool[Math.floor(Math.random() * cardsPool.length)];
    
    flipRotation.value = 0;
    flipRotation.value = withSpring(180, { damping: 15, stiffness: 100 });
    
    setTimeout(() => {
      setSelectedCard(randomCard);
    }, 150);
  };

  const handleToggleFavorite = (card: Card) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleFavorite(card.id);
    heartScale.value = withSequence(
      withSpring(1.3, { damping: 10 }),
      withSpring(1, { damping: 10 })
    );
  };

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipRotation.value, [0, 180], [0, 180]);
    const opacity = interpolate(flipRotation.value, [0, 90, 90.01, 180], [1, 1, 0, 0]);
    
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity,
      backfaceVisibility: 'hidden',
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipRotation.value, [0, 180], [180, 360]);
    const opacity = interpolate(flipRotation.value, [0, 90, 90.01, 180], [0, 0, 1, 1]);
    
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity,
      backfaceVisibility: 'hidden',
    };
  });

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  return (
    <ScrollView style={[styles.container, { backgroundColor: currentColors.background }]}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/d319e23a-883e-4dc0-a32c-e41ef19f0d10.png')}
          style={styles.logo}
        />
        <Text style={[styles.title, { color: currentColors.text }]}>Magick</Text>
      </View>
      
      <Text style={[styles.subtitle, { color: currentColors.textSecondary }]}>
        Where conversations become Magick
      </Text>
      <Text style={[styles.tagline, { color: currentColors.textSecondary }]}>
        Connect with people through cards
      </Text>

      <View style={styles.deckSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {DECKS.map((deck) => (
            <TouchableOpacity
              key={deck.id}
              style={[
                styles.deckButton,
                { backgroundColor: currentColors.card },
                selectedDeck?.id === deck.id && { borderColor: colors.primary, borderWidth: 2 },
              ]}
              onPress={() => setSelectedDeck(deck)}
            >
              <Text style={[styles.deckIcon, { color: currentColors.text }]}>{deck.icon}</Text>
              <Text style={[styles.deckName, { color: currentColors.text }]}>{deck.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.cardContainer}>
        {selectedCard ? (
          <View style={styles.cardWrapper}>
            <Animated.View style={[styles.card, styles.cardBack, frontAnimatedStyle]}>
              <View style={styles.cardBackDesign}>
                <Text style={styles.cardBackPattern}>✨</Text>
                <Text style={styles.cardBackText}>MAGICK</Text>
                <Text style={styles.cardBackPattern}>✨</Text>
              </View>
            </Animated.View>
            
            <Animated.View style={[styles.card, styles.cardFront, backAnimatedStyle, { backgroundColor: currentColors.card }]}>
              <Text style={[styles.cardText, { color: currentColors.text }]}>{selectedCard.text}</Text>
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => handleToggleFavorite(selectedCard)}
              >
                <Animated.View style={heartAnimatedStyle}>
                  <IconSymbol
                    ios_icon_name={isCardFavorite(selectedCard.id) ? 'heart.fill' : 'heart'}
                    android_material_icon_name={isCardFavorite(selectedCard.id) ? 'favorite' : 'favorite-border'}
                    size={32}
                    color={isCardFavorite(selectedCard.id) ? '#FF6B9D' : currentColors.textSecondary}
                  />
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>
          </View>
        ) : (
          <View style={[styles.card, styles.placeholderCard, { backgroundColor: currentColors.card }]}>
            <Text style={[styles.placeholderText, { color: currentColors.textSecondary }]}>
              Draw a card to begin
            </Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.drawButton, { opacity: selectedDeck ? 1 : 0.5 }]}
          onPress={() => drawCard(selectedDeck)}
          disabled={!selectedDeck}
        >
          <Text style={styles.drawButtonText}>Draw from {selectedDeck?.name || 'Deck'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawAllButton}
          onPress={() => drawCard(null)}
        >
          <Text style={styles.drawAllButtonText}>Draw from All Decks</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 8,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 30,
  },
  deckSelector: {
    marginBottom: 30,
  },
  deckButton: {
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 100,
  },
  deckIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  deckName: {
    fontSize: 14,
    fontWeight: '600',
  },
  cardContainer: {
    alignItems: 'center',
    marginBottom: 30,
    height: 300,
  },
  cardWrapper: {
    position: 'relative',
    width: CARD_WIDTH,
    height: 280,
  },
  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: 280,
    borderRadius: 20,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardBack: {
    backgroundColor: colors.primary,
  },
  cardBackDesign: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBackPattern: {
    fontSize: 48,
    color: '#FFFFFF',
    marginVertical: 10,
  },
  cardBackText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  cardFront: {
    // Styles applied via backAnimatedStyle
  },
  placeholderCard: {
    width: CARD_WIDTH,
    height: 280,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
  },
  cardText: {
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 28,
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  buttonContainer: {
    gap: 12,
  },
  drawButton: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  drawButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  drawAllButton: {
    backgroundColor: 'transparent',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  drawAllButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
