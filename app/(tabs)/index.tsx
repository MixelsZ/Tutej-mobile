import React from 'react';
import { View, StyleSheet } from 'react-native';
import Heading from '../../components/Heading';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
        <Heading text="Test" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});