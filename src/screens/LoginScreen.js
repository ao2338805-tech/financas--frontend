import React, { useContext, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import { AuthContext } from '../navigation/AppNavigator';
import { theme } from '../theme';

export default function LoginScreen({ navigation }) {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <Text variant="headlineSmall" style={styles.title}>Conexões Rosa</Text>
        <Text style={styles.subtitle}>Rede de apoio para mulheres</Text>
      </Surface>

      <Surface style={styles.card}>
        <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} mode="outlined" />
        <TextInput label="Senha" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} mode="outlined" />
        <Button mode="contained" onPress={() => signIn({ email, password })} style={styles.button}>Entrar</Button>
        <Button onPress={() => navigation.navigate('Register')} style={styles.link}>Criar conta</Button>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { padding: 20, borderRadius: 16, backgroundColor: theme.colors.primary, alignItems: 'center', marginBottom: 18 },
  logo: { width: 72, height: 72, marginBottom: 8, borderRadius: 36, backgroundColor: '#fff' },
  title: { color: '#fff', fontWeight: '700' },
  subtitle: { color: '#ffdbee', marginTop: 4 },
  card: { padding: 16, borderRadius: 12, elevation: 3, backgroundColor: theme.colors.surface },
  input: { marginBottom: 12 },
  button: { marginTop: 8, borderRadius: 8 },
  link: { marginTop: 6 },
});
