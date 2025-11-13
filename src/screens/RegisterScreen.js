import React, { useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import { AuthContext } from '../navigation/AppNavigator';
import { theme } from '../theme';

export default function RegisterScreen({ navigation }) {
  const { signUp } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');

  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>Junte-se a nós</Text>
        <Text style={styles.subtitle}>Construindo redes de apoio</Text>
      </Surface>

      <Surface style={styles.card}>
        <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} mode="outlined" />
        <TextInput label="Senha" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} mode="outlined" />
        <TextInput label="Confirmar senha" value={confirm} onChangeText={setConfirm} secureTextEntry style={styles.input} mode="outlined" />
        <TextInput label="Telefone" value={phone} onChangeText={setPhone} style={styles.input} mode="outlined" keyboardType="phone-pad" />
        <TextInput label="Data de nascimento (YYYY-MM-DD)" value={dob} onChangeText={setDob} style={styles.input} mode="outlined" />
        <Button mode="contained" onPress={() => {
          if (!email.trim() || !password) return alert('Preencha email e senha');
          if (password !== confirm) return alert('As senhas não coincidem');
          // basic dob validation (YYYY-MM-DD)
          if (dob && !/^\d{4}-\d{2}-\d{2}$/.test(dob)) return alert('Data de nascimento inválida (use YYYY-MM-DD)');
          signUp({ email, password, phone, dob });
        }} style={styles.button}>Registrar</Button>
        <Button onPress={() => navigation.goBack()} style={styles.link}>Voltar</Button>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { padding: 20, borderRadius: 16, backgroundColor: theme.colors.primary, alignItems: 'center', marginBottom: 18 },
  title: { color: '#fff', fontWeight: '700' },
  subtitle: { color: '#ffdbee', marginTop: 4 },
  card: { padding: 16, borderRadius: 12, elevation: 3, backgroundColor: theme.colors.surface },
  input: { marginBottom: 12 },
  button: { marginTop: 8, borderRadius: 8 },
  link: { marginTop: 6 },
});
