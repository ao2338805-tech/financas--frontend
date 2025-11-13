import React, { useContext, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { TextInput, Button, Card, Text } from 'react-native-paper';
import { AuthContext } from '../navigation/AppNavigator';

export default function ChatScreen({ route }) {
  const { chatId } = route.params;
  const { chats = [], sendMessage, user } = useContext(AuthContext);
  const chat = chats.find(c => c.id === chatId) || { messages: [] };
  const [text, setText] = useState('');

  function onSend() {
    if (!text.trim()) return;
    sendMessage({ chatId, fromEmail: user?.email, text });
    setText('');
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chat.messages}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={{ fontWeight: item.fromEmail === user?.email ? '700' : '400' }}>{item.fromEmail}</Text>
              <Text>{item.text}</Text>
            </Card.Content>
          </Card>
        )}
      />

      <View style={styles.inputRow}>
        <TextInput value={text} onChangeText={setText} style={styles.input} placeholder="Mensagem" />
        <Button mode="contained" onPress={onSend}>Enviar</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  card: { marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: { flex: 1 },
});
