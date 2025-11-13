import React, { useContext, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { TextInput, Card, Text, Avatar } from 'react-native-paper';
import { AuthContext } from '../navigation/AppNavigator';

export default function SearchScreen({ navigation }) {
  const { searchUsers } = useContext(AuthContext);
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);

  function onSearch(text) {
    setQ(text);
    setResults(searchUsers(text));
  }

  return (
    <View style={styles.container}>
      <TextInput placeholder="Pesquisar por nome ou nickname" value={q} onChangeText={onSearch} style={styles.input} />

      <FlatList
        data={results}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { email: item.email })}>
            <Card style={styles.card}>
              <Card.Title
                title={item.name}
                subtitle={item.nickname ? `@${item.nickname} · ${item.email}` : item.email}
                left={() => <Avatar.Text size={40} label={(item.name || item.email || 'U').charAt(0).toUpperCase()} />}
              />
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 12 }, input: { marginBottom: 12 }, card: { marginBottom: 8 } });
