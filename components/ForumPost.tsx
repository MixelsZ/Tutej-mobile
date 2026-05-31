import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { logout } from '../../hooks/useAuth'; // Ścieżka relatywna bez małpy

interface Author {
  id: number;
  firstName: string;
  lastName: string;
  photo: string | null;
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: Author;
}

interface PostDetail {
  id: number;
  title: string;
  content: string;
  media: string | null;
  createdAt: string;
  author: Author;
  comments: Comment[];
}

export default function ForumPost() {
  const { postId, forumId } = useLocalSearchParams();
  const router = useRouter();

  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // UWAGA: W mobilce nie ma localStorage. Musisz pobierać token z bezpiecznego storage'u
  // (np. expo-secure-store), ale na potrzeby "żeby wstało" zostawiam mock/logikę fetch:
  const headers = { 'Content-Type': 'application/json' };

  const loadPost = async () => {
    try {
      const r = await fetch(`http://192.168.1.177:5000/api/forums/posts/${postId}`, { headers });
      const data = await r.json();
      setPost(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPost();
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`http://192.168.1.177:5000/api/forums/posts/${postId}/comments`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ content: newComment }),
      });
      if (res.ok) {
        setNewComment('');
        loadPost();
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 200);
      }
    } catch (err) {
      Alert.alert("Błąd", "Nie udało się dodać komentarza");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  if (!post) return <View style={styles.center}><Text>Nie znaleziono posta</Text></View>;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#f8f9fa' }}
      keyboardVerticalOffset={100}
    >
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContainer}>
        {/* Karta Posta */}
        <View style={styles.postCard}>
          <View style={styles.authorRow}>
            <View style={styles.avatar}>
              {post.author?.photo ? (
                <Image source={{ uri: post.author.photo }} style={styles.avatarImg} />
              ) : (
                <Text style={styles.avatarText}>{post.author?.firstName?.[0]}{post.author?.lastName?.[0]}</Text>
              )}
            </View>
            <View>
              <Text style={styles.authorName}>{post.author?.firstName} {post.author?.lastName}</Text>
              <Text style={styles.postDate}>{formatDate(post.createdAt)}</Text>
            </View>
          </View>

          <Text style={styles.postTitle}>{post.title}</Text>
          <Text style={styles.postContent}>{post.content}</Text>

          {post.media && (
            <Image source={{ uri: post.media }} style={styles.postMedia} resizeMode="cover" />
          )}
        </View>

        {/* Sekcja Komentarzy */}
        <Text style={styles.commentsTitle}>
          Komentarze ({post.comments?.length || 0})
        </Text>

        {post.comments?.map((comment) => (
          <View key={comment.id} style={styles.commentItem}>
            <View style={styles.authorRowSmall}>
              <View style={[styles.avatar, styles.avatarSmall]}>
                <Text style={styles.avatarTextSmall}>{comment.author?.firstName?.[0]}</Text>
              </View>
              <View>
                <Text style={styles.commentAuthorName}>{comment.author?.firstName} {comment.author?.lastName}</Text>
                <Text style={styles.commentDate}>{formatDate(comment.createdAt)}</Text>
              </View>
            </View>
            <Text style={styles.commentContent}>{comment.content}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input komentarza (przyklejony na dole) */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Napisz komentarz..."
          value={newComment}
          onChangeText={setNewComment}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, !newComment.trim() && { opacity: 0.5 }]}
          onPress={handleAddComment}
          disabled={submitting || !newComment.trim()}
        >
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { padding: 15, paddingBottom: 100 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  authorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  authorRowSmall: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden'
  },
  avatarSmall: { width: 30, height: 30, borderRadius: 15 },
  avatarImg: { width: '100%', height: '100%' },
  avatarText: { fontWeight: '700', fontSize: 16 },
  avatarTextSmall: { fontWeight: '700', fontSize: 12 },
  authorName: { fontSize: 16, fontWeight: '700' },
  postDate: { fontSize: 12, color: '#888' },
  postTitle: { fontSize: 22, fontWeight: '800', marginBottom: 10 },
  postContent: { fontSize: 16, lineHeight: 24, color: '#333' },
  postMedia: { width: '100%', height: 200, borderRadius: 15, marginTop: 15 },
  commentsTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15, marginLeft: 5 },
  commentItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee'
  },
  commentAuthorName: { fontSize: 14, fontWeight: '600' },
  commentDate: { fontSize: 11, color: '#999' },
  commentContent: { fontSize: 14, color: '#444', marginTop: 5 },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    maxHeight: 100
  },
  sendBtn: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }
});