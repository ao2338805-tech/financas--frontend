import React, { useContext, useState } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { TextInput, Button, Card, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../navigation/AppNavigator';

export default function NewPostScreen({ navigation }) {
  const { user, addPost } = useContext(AuthContext);
  const [caption, setCaption] = useState('');
  const [mediaUri, setMediaUri] = useState(null);
  const [mediaType, setMediaType] = useState('image');

  async function pickMedia() {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.All, quality: 0.7, allowsEditing: true });
      if (!res.cancelled) {
        // try to detect media type
        let mType = 'image';
        if (res.type) mType = res.type; // expo returns 'image' or 'video'
        else if (res.uri && (res.uri.endsWith('.mp4') || res.uri.endsWith('.mov') || res.uri.endsWith('.webm'))) mType = 'video';
        setMediaUri(res.uri);
        setMediaType(mType);
      }
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível acessar a galeria');
    }
  }

  function publish() {
    if (!mediaUri && !caption.trim()) return Alert.alert('Atenção', 'Adicione texto ou mídia para publicar');
    addPost({ authorEmail: user?.email, imageUri: mediaUri, caption, mediaType });
    setCaption('');
    setMediaUri(null);
    setMediaType('image');
    navigation.navigate('Feed');
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <TextInput placeholder="Escreva uma legenda..." value={caption} onChangeText={setCaption} multiline style={{ minHeight: 80 }} />
          {mediaUri ? <Image source={{ uri: mediaUri }} style={{ width: '100%', height: 240, marginTop: 12, borderRadius: 8 }} /> : null}
          <View style={{ flexDirection: 'row', marginTop: 12, gap: 8 }}>
            <Button mode="outlined" onPress={pickMedia}>Escolher mídia</Button>
            <Button mode="contained" onPress={publish}>Publicar</Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  card: { borderRadius: 12, padding: 8 }
});
