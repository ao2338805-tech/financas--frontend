import React, { useContext, useState } from 'react';
import { View, FlatList, StyleSheet, Image, Alert } from 'react-native';
import { Text, Button, Card, TextInput, Avatar, IconButton } from 'react-native-paper';
import { AuthContext } from '../navigation/AppNavigator';
import { theme } from '../theme';
import * as ImagePicker from 'expo-image-picker';

export default function FeedScreen() {
  const { user, signOut, addPost, posts, toggleLike, addComment, users, deletePost } = useContext(AuthContext);
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);

  async function pickImage() {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7, allowsEditing: true });
      if (!res.cancelled) setImage(res.uri);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível abrir o seletor de imagens');
    }
  }

  function publish() {
    if (!text.trim() && !image) return Alert.alert('Atenção', 'Adicione texto ou imagem para publicar');
    addPost({ authorEmail: user?.email, imageUri: image, caption: text });
    setText('');
    setImage(null);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar.Text size={40} label={(user?.email || 'U').charAt(0).toUpperCase()} />
          <View style={{ marginLeft: 12 }}>
            <Text variant="titleMedium">Bem-vinda,</Text>
            <Text style={styles.userEmail}>{user?.email || 'Convidada'}</Text>
          </View>
        </View>
        <Button mode="outlined" onPress={signOut}>Sair</Button>
      </View>

      <Card style={styles.postBox}>
        <Card.Content>
          <TextInput placeholder="O que você está pensando?" value={text} onChangeText={setText} multiline style={styles.input} />
          {image ? <Image source={{ uri: image }} style={{ width: '100%', height: 180, borderRadius: 8, marginBottom: 8 }} /> : null}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button mode="outlined" onPress={pickImage} style={{ borderRadius: 8 }}>Escolher foto</Button>
            <Button mode="contained" onPress={publish} style={[styles.postButton, { marginLeft: 8 }]}>Publicar</Button>
          </View>
        </Card.Content>
      </Card>

      <FlatList
        data={(() => {
          if (!user) return [];
          const me = users.find(u => u.email === user.email) || {};
          const following = me.following || [];
          // show own posts and posts from people the user follows; always include videos
          return posts.filter(p => p.mediaType === 'video' || p.authorEmail === user.email || following.includes(p.authorEmail));
        })()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const authorName = (item.authorEmail || 'Usuária').split('@')[0];
          const liked = item.likes && user?.email ? item.likes.includes(user.email) : false;
          return (
            <Card style={styles.card}>
              <Card.Title title={authorName} left={() => <Avatar.Text size={40} label={authorName.charAt(0).toUpperCase()} />} right={() => (
                user?.email === item.authorEmail ? (
                  <IconButton icon="dots-vertical" onPress={() => {
                    // confirm delete
                    if (typeof window !== 'undefined' && window.confirm) {
                      if (window.confirm('Deseja apagar esta publicação?')) deletePost(item.id, user.email);
                    } else {
                      Alert.alert('Apagar', 'Confirmar exclusão?');
                    }
                  }} />
                ) : null
              )} />
              <Card.Content>
                {item.caption ? <Text style={{ marginBottom: 8 }}>{item.caption}</Text> : null}
                {item.imageUri ? <Image source={{ uri: item.imageUri }} style={{ width: '100%', height: 280, borderRadius: 8 }} /> : null}
                {/* comments */}
                {(item.comments || []).map(c => (
                  <Text key={c.id} style={styles.comment}><Text style={{ fontWeight: '700' }}>{(users.find(u => u.email === c.userEmail)?.username) || c.userEmail.split('@')[0]}: </Text>{c.text}</Text>
                ))}
              </Card.Content>
              <Card.Actions>
                <IconButton icon={liked ? 'heart' : 'heart-outline'} color={liked ? theme.colors.primary : undefined} onPress={() => toggleLike(item.id, user?.email)} />
                <IconButton icon="comment-outline" onPress={() => {
                  // try simple prompt on web
                  if (typeof window !== 'undefined' && window.prompt) {
                    const t = window.prompt('Escreva seu comentário');
                    if (t) addComment(item.id, user?.email, t);
                  } else {
                    Alert.alert('Comentar', 'Funcionalidade de comentário disponível no navegador ou em breve.');
                  }
                }} />
                <Text style={{ marginLeft: 'auto', marginRight: 8 }}>{(item.likes || []).length} curtidas</Text>
              </Card.Actions>
            </Card>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  userEmail: { color: theme.colors.placeholder },
  input: { minHeight: 60, backgroundColor: 'transparent' },
  postButton: { marginTop: 8, borderRadius: 8 },
  postBox: { marginBottom: 12, borderRadius: 12, overflow: 'hidden' },
  card: { marginBottom: 8, borderRadius: 12 },
});
