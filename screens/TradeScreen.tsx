import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import Heading from '../components/Heading';
import Button from '../components/Button';
import FormModal from '../components/FormModal';
import InputField from '../components/InputField';
import ListingCard from '../components/ListingCard'; // Musisz mieć wersję mobilną tego komponentu
import MyText from '../components/MyText';
import { COLORS } from '../styles/theme';

export default function TradeScreen() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMyListings, setShowMyListings] = useState(false);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [contact, setContact] = useState('');
  const [imagesBase64, setImagesBase64] = useState<string[]>([]);

  // Mocked userId (w prawdziwej aplikacji z AuthContext)
  const currentUserId = 1;

  const fetchListings = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/listings`);
      const data = await res.json();
      setListings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      base64: true,
      quality: 0.5, // Kompresja, żeby nie zapchać pamięci
    });

    if (!result.canceled) {
      const newImages = result.assets
        .map(asset => `data:image/jpeg;base64,${asset.base64}`)
        .filter(img => img !== null);

      setImagesBase64(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImagesBase64(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddListing = async () => {
    if (!title || !description || !contact || imagesBase64.length === 0) {
      Alert.alert("Błąd", "Wypełnij dane i dodaj zdjęcie");
      return;
    }

    setIsSubmitting(true);
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          price: price ? parseFloat(price) : null,
          contact,
          authorId: currentUserId,
          images: imagesBase64,
        }),
      });

      if (res.ok) {
        const newListing = await res.json();
        setListings([newListing, ...listings]);
        setIsFormOpen(false);
        // Reset
        setTitle(''); setDescription(''); setPrice(''); setContact(''); setImagesBase64([]);
      }
    } catch (error) {
      Alert.alert("Błąd", "Nie udało się dodać ogłoszenia");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredListings = listings.filter((listing: any) => {
    if (showMyListings) return listing.authorId === currentUserId;
    return listing.status !== 'SOLD';
  });

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredListings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ListingCard listing={item} onUpdate={fetchListings} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Heading text="Giełda sąsiedzka" />
            <MyText
              text={showMyListings ? 'Zarządzaj swoimi ogłoszeniami' : 'Przeglądaj oferty sąsiadów'}
              style={styles.subtitle}
            />
            <View style={styles.buttonRow}>
              <Button
                text="Dodaj ofertę"
                variant="primary"
                onClick={() => setIsFormOpen(true)}
                style={{ flex: 1 }}
              />
              <Button
                text={showMyListings ? "Wszystkie" : "Moje"}
                variant="secondary"
                onClick={() => setShowMyListings(!showMyListings)}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      <FormModal
        title="Nowe ogłoszenie"
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddListing}
        isSubmitting={isSubmitting}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.formGroup}>
            <MyText text="Tytuł" />
            <InputField value={title} onChange={setTitle} placeholder="Co sprzedajesz?" />
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
             <View style={[styles.formGroup, { flex: 1 }]}>
                <MyText text="Cena (PLN)" />
                <InputField value={price} onChange={setPrice} keyboardType="numeric" placeholder="0.00" />
             </View>
             <View style={[styles.formGroup, { flex: 1 }]}>
                <MyText text="Kontakt" />
                <InputField value={contact} onChange={setContact} placeholder="Tel / Email" />
             </View>
          </View>

          <View style={styles.formGroup}>
            <MyText text="Opis" />
            <InputField value={description} onChange={setDescription} multiline numberOfLines={4} style={styles.textarea} />
          </View>

          <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
            <Ionicons name="camera" size={30} color={COLORS.darkGray} />
            <Text style={{ color: COLORS.darkGray }}>Dodaj zdjęcia</Text>
          </TouchableOpacity>

          <ScrollView horizontal style={styles.previewList}>
            {imagesBase64.map((uri, idx) => (
              <View key={idx} style={styles.previewItem}>
                <Image source={{ uri }} style={styles.previewImg} />
                <TouchableOpacity style={styles.removeBadge} onPress={() => removeImage(idx)}>
                  <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </ScrollView>
      </FormModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, gap: 10 },
  subtitle: { color: '#666', fontSize: 16 },
  buttonRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  formGroup: { marginBottom: 15, gap: 5 },
  textarea: { height: 100, textAlignVertical: 'top' },
  uploadBox: {
    height: 100,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  previewList: { flexDirection: 'row', marginBottom: 20 },
  previewItem: { marginRight: 10, position: 'relative' },
  previewImg: { width: 80, height: 80, borderRadius: 8 },
  removeBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'crimson',
    borderRadius: 12,
    padding: 2
  }
});