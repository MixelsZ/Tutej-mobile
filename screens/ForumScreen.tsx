import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import Heading from '../components/Heading';
import MyText from '../components/MyText';
import { COLORS } from '../styles/theme';

interface Forum {
  id: number;
  name: string;
  description: string;
  icon: string | null;
  _count: { posts: number };
}

const FORUM_ICONS: Record<string, string> = {
  default: '💬',
  garden: '🌿',
  animals: '🐾',
  events: '📅',
  help: '🤝',
  safety: '🔒',
  buy: '🛒',
  kids: '🧒',
};

export default function ForumScreen() {
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchForums = async () => {
      try {
        // Upewnij się, że .env ma poprawny adres (localhost dla web, IP dla telefonu)
        const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/forums`);
        const data = await res.json();
        setForums(data);
      } catch (err) {
        console.error("Błąd pobierania forum:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchForums();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const renderForumCard = ({ item }: { item: Forum }) => (
    <TouchableOpacity
      style={styles.forumCard}
      onPress={() => router.push(`/forum/${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.forumMainContent}>
        <View style={styles.forumIconContainer}>
          <Text style={styles.forumIcon}>
            {item.icon || FORUM_ICONS.default}
          </Text>
        </View>
        <View style={styles.forumInfo}>
          <Text style={styles.forumName}>{item.name}</Text>
          <Text style={styles.forumDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </View>

      <View style={styles.forumFooter}>
        <View style={styles.forumMeta}>
          <Text style={styles.postLabel}>Liczba wątków:</Text>
          <Text style={styles.postCount}>{item._count?.posts || 0}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#888" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.page}>
      <FlatList
        data={forums}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderForumCard}
        ListHeaderComponent={
          <View style={styles.header}>
            <Heading text="Forum" />
            <MyText text="Dyskutuj z sąsiadami o tym, co ważne" style={styles.subtitle} />
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  subtitle: {
    color: '#666',
    fontSize: 18,
    marginTop: 5,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  forumCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    // Shadow dla iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    // Elevation dla Android
    elevation: 2,
  },
  forumMainContent: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  forumIconContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    padding: 12,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forumIcon: {
    fontSize: 30,
  },
  forumInfo: {
    flex: 1,
  },
  forumName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  forumDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  forumFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.03)',
    paddingTop: 15,
  },
  forumMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  postLabel: {
    fontSize: 14,
    color: '#888',
  },
  postCount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
});