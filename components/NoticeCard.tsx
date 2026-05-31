import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function NoticeCard({ notice }) {
  const router = useRouter();

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('pl-PL'); // Uproszczone dla czytelności
  };

  const initials = `${notice.author?.firstName?.[0] || ''}${notice.author?.lastName?.[0] || ''}`;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: '/notices/[id]', params: { id: notice.id } })}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.date}>{formatDate(notice.createdAt)}</Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>{notice.title}</Text>
      <Text style={styles.snippet} numberOfLines={3}>{notice.content}</Text>

      <View style={styles.footer}>
        <View style={styles.authorRow}>
          <View style={styles.avatar}>
            {notice.author?.photo ? (
              <Image source={{ uri: notice.author.photo }} style={styles.avatarImg} />
            ) : (
              <Text style={styles.avatarText}>{initials}</Text>
            )}
          </View>
          <Text style={styles.authorName}>
            {notice.author?.firstName} {notice.author?.lastName}
          </Text>
        </View>
        <Text style={styles.arrow}>→</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2, // Cień dla Androida
  },
  cardHeader: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  snippet: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#888',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
  },
  arrow: {
    fontSize: 18,
    color: '#CCC',
  }
});