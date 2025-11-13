import React, { useContext, useState } from 'react';
import { View, StyleSheet, FlatList, Image, Linking, Platform, Alert } from 'react-native';
import { Text, Card, Button, IconButton } from 'react-native-paper';
import { AuthContext } from '../navigation/AppNavigator';

export default function VideosScreen({ navigation }) {
  const { posts, user, users, addComment } = useContext(AuthContext);
  const [visibleCaptions, setVisibleCaptions] = useState({});
  const videosAll = posts.filter(p => p.mediaType === 'video' || (p.imageUri && (p.imageUri.endsWith('.mp4') || p.imageUri.endsWith('.mov') || p.imageUri.endsWith('.webm'))));
  const videos = (() => {
    if (!user) return [];
    const me = users.find(u => u.email === user.email) || {};
    const following = me.following || [];
    return videosAll.filter(p => p.authorEmail === user.email || following.includes(p.authorEmail));
  })();

  function openVideo(uri) {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(uri, '_blank');
    } else {
      Linking.openURL(uri);
    }
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text variant="titleLarge">Vídeos</Text>
        <Button mode="contained" onPress={() => navigation.navigate('NewPost')}>Publicar vídeo</Button>
      </View>

      <FlatList
        data={videos}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              {/* legenda visível apenas após clicar em comentar */}
              {visibleCaptions[item.id] ? <Text>{item.caption}</Text> : null}
              {item.imageUri ? <Image source={{ uri: item.imageUri }} style={{ width: '100%', height: 200, marginTop: 8 }} /> : null}
              <Button onPress={() => openVideo(item.imageUri)} style={{ marginTop: 8 }}>Abrir vídeo</Button>
            </Card.Content>
            <Card.Actions>
              <IconButton icon="comment-outline" onPress={() => {
                setVisibleCaptions(prev => ({ ...prev, [item.id]: !prev[item.id] }));
                if (typeof window !== 'undefined' && window.prompt) {
                  const t = window.prompt('Escreva seu comentário');
                  if (t) addComment(item.id, user?.email, t);
                } else {
                  Alert.alert('Comentar', 'Funcionalidade de comentário disponível no navegador ou em breve.');
                }
              }} />
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 12 }, card: { marginBottom: 12 } });
