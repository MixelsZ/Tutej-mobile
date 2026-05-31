import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker } from 'react-native-maps';
import Button from './Button';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function EventCard({ event, onDelete }: any) {
  const [isOpen, setIsOpen] = useState(false);

  const eventDate = new Date(event.date);
  const month = eventDate.toLocaleString('pl-PL', { month: 'short' }).replace('.', '').toUpperCase();
  const day = eventDate.toLocaleString('pl-PL', { day: '2-digit' });
  const time = eventDate.toLocaleString('pl-PL', { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => setIsOpen(true)}
      >
        <Image source={{ uri: event.image }} style={styles.image} />

        <View style={styles.cardBody}>
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={1}>{event.name}</Text>
            <View style={styles.belowTitle}>
              <View>
                <Text style={styles.location}>{event.place}</Text>
                <View style={styles.meta}>
                  <Text style={styles.metaText}>👥 {event.attendees?.length || 0}</Text>
                  <Text style={styles.dot}>·</Text>
                  <Text style={styles.metaText}>🕒 {time}</Text>
                </View>
              </View>

              <View style={styles.miniCalendar}>
                <Text style={styles.calendarMonth}>{month}</Text>
                <Text style={styles.calendarDay}>{day}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* FULL PAGE MODAL */}
      <Modal visible={isOpen} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.fullPage}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.hero}>
              <Image source={{ uri: event.image }} style={styles.heroImage} blurRadius={10} />
              <View style={styles.heroOverlay} />
              <TouchableOpacity style={styles.backBtn} onPress={() => setIsOpen(false)}>
                <Text style={styles.backText}>✕</Text>
              </TouchableOpacity>

              <Text style={styles.heroTitle}>{event.name}</Text>
              <Text style={styles.heroLocation}>{event.place}</Text>

              {/* MAPA ZAMIAST IFRAME */}
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: 52.2297, // Tutaj powinieneś przekazać koordynaty z eventu
                    longitude: 21.0122,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  scrollEnabled={false}
                >
                  <Marker coordinate={{ latitude: 52.2297, longitude: 21.0122 }} />
                </MapView>
              </View>
            </View>

            <View style={styles.detailsContent}>
              <View style={styles.gridBoxes}>
                <View style={styles.box}>
                  <Text style={styles.boxLabel}>KOSZT</Text>
                  <Text style={styles.boxValue}>{event.price ? `${event.price} PLN` : 'Darmowe'}</Text>
                </View>
                <View style={styles.box}>
                  <Text style={styles.boxLabel}>CZAS</Text>
                  <Text style={styles.boxValue}>{event.duration || 'N/A'}</Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>ORGANIZATOR</Text>
              <View style={styles.hostRow}>
                <Image
                   source={{ uri: event.author?.photo || `https://ui-avatars.com/api/?name=${event.author?.firstName}` }}
                   style={styles.avatar}
                />
                <Text style={styles.hostName}>{event.author?.firstName} {event.author?.lastName}</Text>
              </View>

              <Text style={styles.sectionTitle}>OPIS</Text>
              <Text style={styles.description}>{event.description}</Text>
            </View>
          </ScrollView>

          <View style={styles.bottomBar}>
             <Button text="Zapisz się na wydarzenie" variant="primary" />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginVertical: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  image: {
    width: '100%',
    height: 180,
  },
  cardBody: {
    padding: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },
  belowTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    color: '#666',
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 1,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  metaText: {
    color: '#888',
    fontSize: 14,
  },
  dot: {
    marginHorizontal: 5,
    color: '#888',
  },
  miniCalendar: {
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 60,
  },
  calendarMonth: {
    color: '#4CAF50',
    fontWeight: '700',
    fontSize: 12,
  },
  calendarDay: {
    fontSize: 20,
    fontWeight: '700',
  },
  // MODAL STYLES
  fullPage: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  hero: {
    height: 400,
    justifyContent: 'flex-end',
    padding: 20,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backBtn: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  heroTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
  },
  heroLocation: {
    color: '#eee',
    fontSize: 16,
    marginBottom: 20,
  },
  mapContainer: {
    height: 150,
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  detailsContent: {
    padding: 20,
  },
  gridBoxes: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
  },
  box: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  boxLabel: {
    fontSize: 10,
    color: '#999',
    marginBottom: 5,
  },
  boxValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    letterSpacing: 1.5,
    marginBottom: 15,
    marginTop: 20,
  },
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  hostName: {
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderTopWidth: 1,
    borderColor: '#eee',
  }
});