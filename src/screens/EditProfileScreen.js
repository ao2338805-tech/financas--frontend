import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, TextInput, Button, Avatar, Card } from 'react-native-paper';
import { AuthContext } from '../navigation/AppNavigator';

export default function EditProfileScreen({ navigation }) {
  const { user, users, updateProfile } = useContext(AuthContext);
  const me = users.find(u => u.email === user?.email) || {};

  const [name, setName] = useState(me.name || '');
  const [username, setUsername] = useState(me.username || (user?.email || '').split('@')[0]);
  const [nickname, setNickname] = useState(me.nickname || '');
  const [bio, setBio] = useState(me.bio || '');

  function save() {
    updateProfile({ email: user.email, name: name.trim(), username: username.trim(), nickname: nickname.trim(), bio: bio.trim() });
    navigation.goBack();
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Card style={{ marginBottom: 12 }}>
        <Card.Content style={{ alignItems: 'center' }}>
          <Avatar.Text size={96} label={(user?.email || 'U').charAt(0).toUpperCase()} />
          <Text variant="titleLarge" style={{ marginTop: 8 }}>{me.name || user?.email}</Text>
        </Card.Content>
      </Card>

      <TextInput label="Nome" value={name} onChangeText={setName} style={styles.input} />
      <TextInput label="Usuário (@)" value={username} onChangeText={setUsername} style={styles.input} />
      <TextInput label="Apelido" value={nickname} onChangeText={setNickname} style={styles.input} />
      <TextInput label="Bio" value={bio} onChangeText={setBio} multiline numberOfLines={3} style={[styles.input, { minHeight: 80 }]} />

      <Button mode="contained" onPress={save} style={styles.saveButton}>Salvar</Button>
      <Button mode="outlined" onPress={() => navigation.goBack()} style={[styles.saveButton, { marginTop: 8 }]}>Cancelar</Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: { marginBottom: 12, backgroundColor: 'transparent' },
  saveButton: { borderRadius: 8 }
});
