import React from 'react';
import { View, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MyText from '../components/MyText';
import Heading from '../components/Heading';
import { COLORS } from '../styles/theme';

export default function SupportScreen({ navigation }: any) {
  const handleEmail = () => {
    Linking.openURL('mailto:kontakt@tutej.app');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Heading text="Wsparcie" />
      </View>
      
      <View style={styles.content}>
        <Ionicons name="mail-open-outline" size={80} color={COLORS.primary} style={{ marginBottom: 20 }} />
        <MyText style={styles.text}>
          Masz pytania lub sugestie? Skontaktuj się z nami!
        </MyText>
        <TouchableOpacity onPress={handleEmail}>
          <MyText style={styles.email}>kontakt@tutej.app</MyText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 40 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', textAlign: 'center' },
  text: { fontSize: 18, textAlign: 'center', lineHeight: 26, color: '#444' },
  email: { fontSize: 20, fontWeight: '700', color: COLORS.primary, marginTop: 10, textDecorationLine: 'underline' }
});