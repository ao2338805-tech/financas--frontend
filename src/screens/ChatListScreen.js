import React, { useContext } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Avatar, Button } from 'react-native-paper';
import { AuthContext } from '../navigation/AppNavigator';

export default function ChatListScreen({ navigation }) {
  const { user, chats } = useContext(AuthContext);

  const myChats = (chats || []).filter(c => c.participants && c.participants.includes(user?.email));

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text variant="titleLarge">Conversas</Text>
        <Button onPress={() => navigation.navigate('Search')}>Novo chat</Button>
      </View>

      <FlatList
        data={myChats}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => {
          const other = item.participants.find(p => p !== user?.email) || 'Desconhecido';
          const last = (item.messages || []).slice(-1)[0];
          return (
            <TouchableOpacity onPress={() => navigation.navigate('Chat', { chatId: item.id })}>
              <Card style={styles.card}>
                <Card.Title
                  title={other}
                  subtitle={last ? last.text : 'Sem mensagens'}
                  left={() => <Avatar.Text size={40} label={other.charAt(0).toUpperCase()} />}
                />
              </Card>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 12 }, card: { marginBottom: 8 } });
