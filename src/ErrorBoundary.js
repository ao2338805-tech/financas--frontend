import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  componentDidCatch(error, info) {
    // Catch errors in any components below and re-render with error message
    this.setState({ error, info });
    // Also log to console
    // eslint-disable-next-line no-console
    console.error(error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <ScrollView contentContainerStyle={styles.container}>
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.title}>Ocorreu um erro</Text>
              <Text style={styles.message}>{String(this.state.error)}</Text>
              <Text style={styles.stack}>{this.state.info?.componentStack}</Text>
              <Button mode="contained" onPress={() => this.setState({ error: null, info: null })} style={styles.button}>Tentar novamente</Button>
            </Card.Content>
          </Card>
        </ScrollView>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  card: { padding: 12 },
  title: { marginBottom: 8 },
  message: { color: '#900', marginBottom: 8 },
  stack: { color: '#444', fontSize: 12 },
  button: { marginTop: 12 },
});
