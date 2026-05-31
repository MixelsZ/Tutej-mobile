import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

import Heading from '../components/Heading';
import { EventCard } from '../components/EventCard';
import Button from '../components/Button';
import InputField from '../components/InputField';
import FormModal from '../components/FormModal';
import MyText from '../components/MyText';
import { COLORS } from '../styles/theme';

export default function EventScreen() {
  const [events, setEvents] = useState<any[]>([]);
  const [showMyEvents, setShowMyEvents] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [place, setPlace] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  // Symulacja userId (w wersji produkcyjnej bierzemy z AuthContext/Storage)
  const currentUserId = 1;

  const fetchEvents = async () => {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/events`);
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error("Błąd pobierania:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setImageBase64(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleAddEvent = async () => {
    if (!name || !description || !place || !date || !imageBase64) {
      Alert.alert('Błąd', 'Wypełnij wszystkie pola i dodaj zdjęcie.');
      return;
    }

    setIsSubmitting(true);
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          place,
          date,
          duration,
          price: parseFloat(price) || 0,
          authorId: currentUserId,
          image: imageBase64,
        }),
      });

      if (res.ok) {
        const newEvent = await res.json();
        setEvents([newEvent, ...events]);
        setIsFormOpen(false);
        resetForm();
      }
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się dodać wydarzenia.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName(''); setDescription(''); setPlace(''); setDate('');
    setDuration(''); setPrice(''); setImageBase64(null);
  };

  const filteredEvents = events.filter((e) =>
    showMyEvents ? e.authorId === currentUserId : true
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Heading text="Wydarzenia" />
          <MyText text="Przeglądaj wydarzenia z okolicy" style={styles.subtitle} />
        </View>
        <View style={styles.buttonRow}>
          <Button
            text="Dodaj"
            variant="primary"
            onClick={() => setIsFormOpen(true)}
            style={{ flex: 1 }}
          />
          <Button
            text={showMyEvents ? "Wszystkie" : "Moje"}
            variant="secondary"
            onClick={() => setShowMyEvents(!showMyEvents)}
            style={{ flex: 1 }}
          />
        </View>
      </View>

      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <EventCard event={item} />}
        contentContainerStyle={styles.list}
      />

      <FormModal
        title="Nowe wydarzenie"
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddEvent}
        isSubmitting={isSubmitting}
      >
        <ScrollView style={{ maxHeight: 400 }}>
          <MyText text="Nazwa wydarzenia" />
          <InputField placeholder="Nazwa..." icon="letters" onChange={setName} />

          <MyText text="Adres" />
          <InputField placeholder="Gdzie?" icon="building" onChange={setPlace} />

          <MyText text="Data (YYYY-MM-DD HH:MM)" />
          <InputField placeholder="Data..." icon="date" onChange={setDate} />

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
                <MyText text="Cena" />
                <InputField placeholder="PLN" type="numeric" onChange={setPrice} />
            </View>
            <View style={{ flex: 1 }}>
                <MyText text="Czas" />
                <InputField placeholder="Np. 2h" onChange={setDuration} />
            </View>
          </View>

          <MyText text="Opis" />
          <InputField placeholder="Opis wydarzenia..." onChange={setDescription} />

          <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
            {imageBase64 ? (
              <Text>Zdjęcie dodane ✓</Text>
            ) : (
              <Text>➕ Dodaj zdjęcie</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </FormModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, gap: 15 },
  subtitle: { color: '#666', fontSize: 16 },
  buttonRow: { flexDirection: 'row', gap: 10 },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  uploadBox: {
    padding: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15
  }
});