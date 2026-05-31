import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import Heading from '../../components/Heading';
import { COLORS, FONTS } from '../../styles/theme';

const { width } = Dimensions.get('window');

export default function Home() {
  // Wartości dla animacji
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Odpowiednik keyframes fadeUp
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        delay: 100,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        delay: 100,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Page Title (Pozycjonowany w lewym górnym rogu) */}
      <Text style={styles.pageTitle}>Strona główna</Text>

      {/* Wyśrodkowany animowany tytuł */}
      <Animated.View
        style={[
          styles.titleContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={styles.title}>TUTEJ</Text>
      </Animated.View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1, // height: 100%
    position: 'relative',
    backgroundColor: COLORS.white,
    padding: 20,
  },
  pageTitle: {
    position: 'absolute',
    top: 40, // odpowiednik bezpiecznej odległości od góry
    left: 20,
    fontSize: 24,
    fontWeight: '500',
    color: COLORS.black,
    fontFamily: FONTS.regular,
  },
  titleContainer: {
    position: 'absolute',
    top: '10%',
    left: 0,
    right: 0,
    alignItems: 'center', // Centruje tekst w poziomie
  },
  title: {
    fontSize: width * 0.08, // Odpowiednik 8vw
    fontWeight: '700',
    color: COLORS.black,
    fontFamily: FONTS.heading,
    textAlign: 'center',
  },
});