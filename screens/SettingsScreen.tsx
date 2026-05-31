import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Heading from '../components/Heading';
import InputField from '../components/InputField';
import Button from '../components/Button';
import MyText from '../components/MyText';
import { COLORS } from '../styles/theme';

export default function SettingsScreen({ navigation }: any) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Dane profilu
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Dane hasła
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwSaving, setPwSaving] = useState(false);

  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Tu użyj swojego tokena z AuthContext/SecureStore
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer YOUR_TOKEN` }
      });
      const data = await res.json();
      setUser(data);
      setFirstName(data.firstName);
      setLastName(data.lastName);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer YOUR_TOKEN`
        },
        body: JSON.stringify({ firstName, lastName }),
      });
      if (res.ok) Alert.alert("Sukces", "Profil został zaktualizowany.");
    } catch {
      Alert.alert("Błąd", "Nie udało się zapisać zmian.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Błąd", "Hasła nie są identyczne.");
      return;
    }
    setPwSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/me/password`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer YOUR_TOKEN`
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        Alert.alert("Sukces", "Hasło zostało zmienione.");
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      } else {
        const data = await res.json();
        Alert.alert("Błąd", data.message || "Błąd zmiany hasła.");
      }
    } catch {
      Alert.alert("Błąd", "Błąd połączenia.");
    } finally {
      setPwSaving(false);
    }
  };

  if (loading) return (
    <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>
  );

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Heading text="Ustawienia" />
        </View>

        {/* Sekcja Profilu */}
        <View style={styles.card}>
          <MyText text="Profil" style={styles.cardTitle} />
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              {user?.photo ? (
                <Image source={{ uri: user.photo }} style={styles.avatarImg} />
              ) : (
                <MyText text={initials} style={styles.initials} />
              )}
            </View>
            <View>
              <MyText text={`${user?.firstName} ${user?.lastName}`} style={styles.userName} />
              <MyText text={user?.email} style={styles.userEmail} />
            </View>
          </View>

          <InputField label="Imię" value={firstName} onChange={setFirstName} icon="letters" />
          <InputField label="Nazwisko" value={lastName} onChange={setLastName} icon="letters" />

          <Button
            text={saving ? "Zapisywanie..." : "Zapisz zmiany"}
            onClick={handleSaveProfile}
            disabled={saving}
          />
        </View>

        {/* Sekcja Hasła */}
        <View style={styles.card}>
          <MyText text="Zmień hasło" style={styles.cardTitle} />
          <InputField
            label="Obecne hasło"
            value={currentPassword}
            onChange={setCurrentPassword}
            secureTextEntry
            icon="lock"
          />
          <InputField
            label="Nowe hasło"
            value={newPassword}
            onChange={setNewPassword}
            secureTextEntry
            icon="lock"
          />
          <InputField
            label="Powtórz hasło"
            value={confirmPassword}
            onChange={setConfirmPassword}
            secureTextEntry
            icon="lock"
          />

          <Button
            text={pwSaving ? "Zmienianie..." : "Zmień hasło"}
            variant="secondary"
            onClick={handleChangePassword}
            disabled={pwSaving || !newPassword}
          />
        </View>

        {/* Sekcja Wsparcia */}
        <TouchableOpacity
            style={styles.supportCard}
            onPress={() => navigation.navigate('Support')}
        >
            <MyText text="Centrum pomocy i wsparcia" style={styles.supportText} />
            <Ionicons name="chevron-forward" size={20} color={COLORS.darkGray} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 25 },
  backBtn: { padding: 10, backgroundColor: '#fff', borderRadius: 12, elevation: 2 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 24, marginBottom: 20, gap: 15, elevation: 1 },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 5 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 10 },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%' },
  initials: { fontSize: 20, fontWeight: '700', color: COLORS.darkGray },
  userName: { fontSize: 18, fontWeight: '700' },
  userEmail: { color: COLORS.darkGray },
  supportCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginTop: 10
  },
  supportText: { fontWeight: '600', color: COLORS.primary }
});