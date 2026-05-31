import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// ... Interfejsy zostają takie same jak w oryginale ...

export default function ListingCard({ listing: initialListing, onUpdate }: ListingCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [listing, setListing] = useState<ListingData>(initialListing);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    // Pobieranie ID użytkownika w RN (AsyncStorage zamiast localStorage)
    const getUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      if (id) setCurrentUserId(Number(id));
    };
    getUserId();
  }, []);

  const isOwner = listing.authorId === currentUserId;

  const getPriceString = (priceVal: any) => {
    if (!priceVal || parseFloat(priceVal.toString()) === 0) return 'Darmowe';
    return `${parseFloat(priceVal.toString()).toLocaleString('pl-PL')} PLN`;
  };

  const handleStatusChange = async (newStatus: string) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`http://TWOJE_IP:5000/api/listings/${listing.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updatedData = await res.json();
        setListing(updatedData);
        onUpdate?.(updatedData);
      }
    } catch (err) {
      Alert.alert("Błąd", "Nie udało się zmienić statusu.");
    } finally {
      setIsUpdating(false);
    }
  };

  const mainImage = listing.images?.[0]?.url || 'https://via.placeholder.com/300';

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={() => setIsOpen(true)}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: mainImage }} style={styles.image} />

          <View style={styles.priceTag}>
            <Text style={styles.priceText}>{getPriceString(listing.price)}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.title} numberOfLines={1}>{listing.title}</Text>
          <Text style={styles.authorName}>{listing.author.firstName} {listing.author.lastName}</Text>

          {/* Status Badge */}
          <View style={[styles.statusBadge, styles[listing.status.toLowerCase() as keyof typeof styles]]}>
             <View style={styles.dot} />
             <Text style={styles.statusText}>{listing.status}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* MODAL ZE SZCZEGÓŁAMI */}
      <Modal visible={isOpen} animationType="slide" presentationStyle="fullScreen">
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => setIsOpen(false)}>
            <Ionicons name="chevron-back" size={30} color="black" />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Image source={{ uri: mainImage }} style={styles.heroImage} />

            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{listing.title}</Text>

              <View style={styles.infoGrid}>
                <View style={styles.infoBox}>
                  <Text style={styles.boxLabel}>CENA</Text>
                  <Text style={styles.boxValue}>{getPriceString(listing.price)}</Text>
                </View>
                <View style={styles.infoBox}>
                  <Text style={styles.boxLabel}>KONTAKT</Text>
                  <Text style={styles.boxValue}>{listing.contact}</Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>OPIS</Text>
              <Text style={styles.description}>{listing.description}</Text>

              <Text style={styles.sectionTitle}>OGŁOSZENIODAWCA</Text>
              <View style={styles.authorRow}>
                <Image
                  source={{ uri: listing.author.photo || `https://ui-avatars.com/api/?name=${listing.author.firstName}+${listing.author.lastName}` }}
                  style={styles.avatar}
                />
                <Text style={styles.authorRowName}>{listing.author.firstName} {listing.author.lastName}</Text>
              </View>

              {isOwner && (
                <View style={styles.ownerActions}>
                  <Text style={styles.sectionTitle}>ZARZĄDZAJ STATUSYEM</Text>
                  <View style={styles.buttonGroup}>
                    <TouchableOpacity
                      style={[styles.statusBtn, listing.status === 'AVAILABLE' && styles.available]}
                      onPress={() => handleStatusChange('AVAILABLE')}
                    >
                      <Text style={styles.btnText}>DOSTĘPNE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.statusBtn, listing.status === 'SOLD' && styles.sold]}
                      onPress={() => handleStatusChange('SOLD')}
                    >
                      <Text style={styles.btnText}>SPRZEDANE</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: { padding: 10 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    overflow: 'hidden',
    elevation: 3, // Cień na Android
    shadowColor: '#000', // Cień na iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  imageWrapper: { height: 180, width: '100%', position: 'relative' },
  image: { width: '100%', height: '100%' },
  priceTag: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    elevation: 5,
  },
  priceText: { fontWeight: '700', fontSize: 16 },
  cardBody: { padding: 15 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 5 },
  authorName: { color: '#8E8E93', fontSize: 14, marginBottom: 10 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    alignSelf: 'flex-start',
    backgroundColor: '#F2F2F7',
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6, backgroundColor: '#8E8E93' },
  available: { backgroundColor: '#E1F5FE' }, // Przykładowe kolory
  sold: { backgroundColor: '#FFEBEE' },
  statusText: { fontSize: 12, fontWeight: '700', color: '#333' },

  // MODAL STYLES
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 25,
    padding: 5,
  },
  heroImage: { width: '100%', height: 300 },
  modalContent: { padding: 20 },
  modalTitle: { fontSize: 28, fontWeight: '700', marginBottom: 20 },
  infoGrid: { flexDirection: 'row', gap: 10, marginBottom: 25 },
  infoBox: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    alignItems: 'center',
  },
  boxLabel: { fontSize: 12, color: '#8E8E93', fontWeight: '600' },
  boxValue: { fontSize: 16, fontWeight: '700', marginTop: 5 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#8E8E93', marginTop: 20, marginBottom: 10, letterSpacing: 1 },
  description: { fontSize: 16, lineHeight: 24, color: '#333' },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 15, marginTop: 10 },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  authorRowName: { fontSize: 16, fontWeight: '600' },
  ownerActions: { marginTop: 30, borderTopWidth: 1, borderTopColor: '#F2F2F7', paddingTop: 20 },
  buttonGroup: { flexDirection: 'row', gap: 10 },
  statusBtn: { flex: 1, padding: 15, borderRadius: 12, alignItems: 'center', backgroundColor: '#F2F2F7' },
  btnText: { fontWeight: '700' },
});