import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { useParams, useNavigation } from '@react-navigation/native';

export default function ForumThread() {
  const { forumId } = useParams();
  const navigation = useNavigation();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Logika fetchowania zostaje podobna, ale używamy natywnych komponentów
  return (
    <View style={styles.page}>
      {/* Header z przyciskiem wstecz i tytułem */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nazwa Forum</Text>
      </View>

      {/* SearchBar */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Szukaj wątków..."
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.postCard}
              onPress={() => navigation.navigate('PostDetails', { postId: item.id })}
            >
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text numberOfLines={2} style={styles.postSnippet}>{item.content}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40, // Safe Area dla telefonów
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  postCard: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  postSnippet: {
    color: '#666',
    marginTop: 5,
  }
});