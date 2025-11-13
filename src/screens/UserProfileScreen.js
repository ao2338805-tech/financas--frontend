import React, { useContext, useState } from 'react';
import { View, StyleSheet, FlatList, Image, Dimensions, Alert } from 'react-native';
import { Text, Card, Button, Avatar, IconButton } from 'react-native-paper';
import { AuthContext } from '../navigation/AppNavigator';

const numCols = 3;
const size = Dimensions.get('window').width / numCols - 16;

export default function UserProfileScreen({ route, navigation }) {
  const { email } = route.params;
  const { posts, createChat, user, users, toggleFollow, deletePost, addComment } = useContext(AuthContext);
  const [visibleCaptions, setVisibleCaptions] = useState({});

  const profileUser = users.find(u => u.email === email) || { name: email };
  const isFollowing = user && profileUser.followers && profileUser.followers.includes(user.email);

  function startChat() {
    if (!user) return;
    const chat = createChat([user.email, email]);
    if (chat) navigation.navigate('Chat', { chatId: chat.id });
  }

  function toggleFollowAction() {
    if (!user) return alert('Faça login para seguir');
    toggleFollow(user.email, email);
  }

  const userPosts = posts.filter(p => p.authorEmail === email && p.imageUri);
  const showPosts = user?.email === email || isFollowing;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {profileUser.avatar ? (
          <Image source={{ uri: profileUser.avatar }} style={styles.avatar} />
        ) : (
          <Avatar.Text size={96} label={(profileUser.name || email).charAt(0).toUpperCase()} />
        )}
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text variant="titleLarge">{profileUser.name || email}</Text>
          <Text style={{ color: '#666' }}>{profileUser.nickname ? `@${profileUser.nickname}` : ''}</Text>
          <View style={{ flexDirection: 'row', marginTop: 8, gap: 12 }}>
            <Text>{(userPosts || []).length} publicações</Text>
            <Text>{(profileUser.followers || []).length} seguidores</Text>
            <Text>{(profileUser.following || []).length} seguindo</Text>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 8, marginVertical: 8 }}>
        <Button mode="outlined" onPress={startChat}>Iniciar chat</Button>
        {user?.email !== email ? (
          <Button mode={isFollowing ? 'contained' : 'outlined'} onPress={toggleFollowAction}>{isFollowing ? 'Seguindo' : 'Seguir'}</Button>
        ) : (
          <Button mode="outlined" onPress={() => navigation.navigate('EditProfile')}>Editar perfil</Button>
        )}
      </View>

      <Text variant="titleMedium" style={{ marginBottom: 8 }}>Publicações</Text>

      {showPosts ? (
        <FlatList
          data={userPosts}
          keyExtractor={i => i.id}
          renderItem={({ item }) => (
            <Card style={styles.postCard}>
                <Card.Title title={(profileUser.name || '').toString()} left={() => (
                profileUser.avatar ? <Image source={{ uri: profileUser.avatar }} style={styles.smallAvatar} /> : <Avatar.Text size={36} label={(profileUser.name || '').charAt(0).toUpperCase()} />
              )} right={() => (
                user?.email === item.authorEmail ? (
                  <IconButton icon="dots-vertical" onPress={() => {
                    if (typeof window !== 'undefined' && window.confirm) {
                      if (window.confirm('Deseja apagar esta publicação?')) deletePost(item.id, user.email);
                    } else {
                      Alert.alert('Apagar', 'Confirmar exclusão?');
                    }
                  }} />
                ) : null
              )} />
              <Card.Content>
                <Image source={{ uri: item.imageUri }} style={styles.postImage} />
                  {/* legenda e comentários visíveis apenas após clicar em comentar */}
                  {visibleCaptions[item.id] ? (
                    <>
                      {item.caption ? <Text style={{ marginTop: 8 }}>{item.caption}</Text> : null}
                      {(item.comments || []).map(c => (
                        <Text key={c.id} style={styles.comment}><Text style={{ fontWeight: '700' }}>{(users.find(u => u.email === c.userEmail)?.username) || c.userEmail.split('@')[0]}: </Text>{c.text}</Text>
                      ))}
                    </>
                  ) : null}
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
      ) : (
        <View style={{ padding: 12 }}>
          <Text>Você precisa seguir este perfil para ver fotos e vídeos.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  card: { margin: 4, overflow: 'hidden' },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#eee' },
  smallAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#eee' },
  postImage: { width: '100%', height: 300, borderRadius: 8, marginTop: 8 },
  postCard: { marginBottom: 12, borderRadius: 12, overflow: 'hidden' }
});
