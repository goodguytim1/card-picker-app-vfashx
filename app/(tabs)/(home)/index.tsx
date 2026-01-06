
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { useFavorites } from '@/hooks/useFavorites';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  interpolate,
} from 'react-native-reanimated';
import React, { useState } from 'react';
import { IconSymbol } from '@/components/IconSymbol';
import { DECKS } from '@/data/decks';
import { colors } from '@/styles/commonStyles';
import { Card, Deck } from '@/types/card';
import * as Haptics from 'expo-haptics';

const CARD_WIDTH = Dimensions.get('window').width - 60;

export default function HomeScreen() {
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const flipAnimation = useSharedValue(0);
  const heartScale = useSharedValue(1);

  const cardAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipAnimation.value, [0, 1], [0, 180]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
    };
  });

  const heartAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: heartScale.value }],
    };
  });

  const drawCard = (deck: Deck | null) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const cardsPool = deck ? deck.cards : DECKS.flatMap(d => d.cards);
    const randomCard = cardsPool[Math.floor(Math.random() * cardsPool.length)];
    
    flipAnimation.value = withSequence(
      withSpring(1, { damping: 15 }),
      withSpring(0, { damping: 15 })
    );
    
    setTimeout(() => setCurrentCard(randomCard), 300);
  };

  const handleToggleFavorite = (card: Card) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    heartScale.value = withSequence(
      withSpring(1.3, { damping: 10 }),
      withSpring(1, { damping: 10 })
    );
    toggleFavorite(card.id);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header with Crystal Ball Logo */}
      <View style={styles.header}>
        <Image 
          source={require('@/assets/images/d319e23a-883e-4dc0-a32c-e41ef19f0d10.png')}
          style={styles.crystalBall}
        />
        <Text style={styles.title}>Magick</Text>
      </View>
      
      <Text style={styles.subtitle}>Where conversations become Magick</Text>

      {/* Deck Selection */}
      <Text style={styles.sectionTitle}>Choose Your Deck</Text>
      <View style={styles.deckGrid}>
        {DECKS.map((deck) => (
          <TouchableOpacity
            key={deck.id}
            style={[
              styles.deckCard,
              selectedDeck?.id === deck.id && styles.deckCardSelected,
            ]}
            onPress={() => setSelectedDeck(deck)}
          >
            <View style={styles.deckIconContainer}>
              <Text style={styles.deckIcon}>{deck.icon}</Text>
            </View>
            <Text style={styles.deckName}>{deck.name}</Text>
            <Text style={styles.deckDescription}>{deck.description}</Text>
            <Text style={styles.deckCardCount}>{deck.cards.length} cards</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.tagline}>Connect with people through cards</Text>

      {/* Draw Card Button */}
      <TouchableOpacity
        style={styles.drawButton}
        onPress={() => drawCard(selectedDeck)}
      >
        <IconSymbol 
          ios_icon_name="sparkles" 
          android_material_icon_name="auto-awesome" 
          size={24} 
          color="#fff" 
        />
        <Text style={styles.drawButtonText}>Draw Card</Text>
      </TouchableOpacity>

      {/* Current Card Display */}
      {currentCard && (
        <Animated.View style={[styles.card, cardAnimatedStyle]}>
          <Text style={styles.cardText}>{currentCard.text}</Text>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => handleToggleFavorite(currentCard)}
          >
            <Animated.View style={heartAnimatedStyle}>
              <IconSymbol
                ios_icon_name={isFavorite(currentCard.id) ? 'heart.fill' : 'heart'}
                android_material_icon_name={isFavorite(currentCard.id) ? 'favorite' : 'favorite-border'}
                size={28}
                color={isFavorite(currentCard.id) ? '#FF6B9D' : colors.text}
              />
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
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
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  crystalBall: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.subtitleText,
    marginBottom: 32,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  deckGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  deckCard: {
    width: '48%',
    backgroundColor: colors.deckCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  deckCardSelected: {
    borderColor: colors.primary,
  },
  deckIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.deckIconBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  deckIcon: {
    fontSize: 32,
  },
  deckName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  deckDescription: {
    fontSize: 11,
    color: colors.subtitleText,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 14,
  },
  deckCardCount: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  tagline: {
    fontSize: 14,
    color: colors.subtitleText,
    marginBottom: 24,
    textAlign: 'center',
  },
  drawButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginBottom: 24,
    width: '100%',
  },
  drawButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 28,
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
});
