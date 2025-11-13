import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Avatar, Card } from 'react-native-paper';
import { AuthContext } from '../navigation/AppNavigator';
import { theme } from '../theme';

export default function ProfileScreen({ navigation }) {
  const { user, posts, users } = useContext(AuthContext);
  const me = users.find(u => u.email === user?.email) || {};

  const myPhotos = posts.filter(p => p.authorEmail === user?.email && p.imageUri).slice(0, 6);

  return (
    <View style={styles.container}>
      <Card style={styles.header}>
        <Card.Content style={{ alignItems: 'center' }}>
          <Avatar.Text size={96} label={(user?.email || 'U').charAt(0).toUpperCase()} />
          <Text variant="headlineSmall" style={{ marginTop: 12 }}>{me.name || user?.email}</Text>
          <Text style={{ color: theme.colors.placeholder, marginTop: 2 }}>@{me.username || (user?.email || '').split('@')[0]}</Text>
          <Text style={{ color: theme.colors.placeholder, marginTop: 4 }}>{me.nickname || ''}</Text>
          <View style={{ flexDirection: 'row', marginTop: 8, gap: 16 }}>
            <Text>{(me.followers || []).length} seguidores</Text>
            <Text>{(me.following || []).length} seguindo</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Sobre</Text>
          <Text style={{ marginTop: 8, color: theme.colors.placeholder }}>{me.bio || 'Edite seu perfil para adicionar uma bio.'}</Text>
        </Card.Content>
      </Card>

      <Text variant="titleMedium" style={{ marginTop: 8 }}>Suas fotos</Text>
      <View style={styles.grid}>
        {myPhotos.map(p => (
          <Card key={p.id} style={styles.gridItem}>
            <Card.Cover source={{ uri: p.imageUri }} style={{ height: 100 }} />
          </Card>
        ))}
      </View>

      <Button onPress={() => navigation.navigate('UserProfile', { email: user?.email })} style={styles.button}>Ver todas as fotos</Button>
      <Button onPress={() => navigation.navigate('EditProfile')} style={[styles.button, { marginTop: 8 }]}>Editar perfil</Button>
      <Button onPress={() => navigation.navigate('Chats')} style={[styles.button, { marginTop: 8 }]}>Chats</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { borderRadius: 12, padding: 8, marginBottom: 12 },
  card: { borderRadius: 12, marginBottom: 12 },
  button: { marginTop: 12, borderRadius: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  gridItem: { width: '32%', margin: '1%' },
});
