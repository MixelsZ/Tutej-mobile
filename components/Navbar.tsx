import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg'; // Musisz doinstalować react-native-svg

// Przykładowy kolor z Twoich zmiennych SCSS
const COLORS = {
  gray: '#F0F0F0',
  green: '#4CAF50',
  darkGray: '#A9A9A9',
  white: '#FFFFFF'
};

export function Navbar({ state, navigation }) {
  return (
    <View style={styles.navbar}>
      {/* Przykład jednego elementu - najlepiej zrobić mapę po routach */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('Events')}
      >
        <View style={styles.iconContainer}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 6C13.5913 6 15.1174 6.63214..." // Twój path
              stroke={COLORS.darkGray}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          {/* Active indicator (odpowiednik ::after w SCSS) */}
          <View style={[styles.activeIndicator, { opacity: 0 }]} />
        </View>
      </TouchableOpacity>

      {/* Reszta ikon... */}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    width: '100%',
    height: 65,
    backgroundColor: COLORS.gray,
    borderRadius: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    maxWidth: 500,
    alignSelf: 'center', // Dla tabletów
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  activeIndicator: {
    position: 'absolute',
    top: -15, // Nad ikoną
    width: '70%',
    height: 4,
    backgroundColor: COLORS.green,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  }
});