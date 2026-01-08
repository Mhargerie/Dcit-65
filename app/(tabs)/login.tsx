import axios from 'axios';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { hashPasswordClientSide } from '../../src/utils/security';

// Proper SecureStore setup for expo-secure-store
const secureStore = SecureStore;

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) return Alert.alert('Validation', 'Please enter username and password');
    setLoading(true);
    try {
      const hashed = hashPasswordClientSide(password);
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password: hashed,
      });

      console.log('Login response:', res.status, res.data);
      
      const { token, user } = res.data;
      if (!token || !user) {
        Alert.alert('Login Error', 'Invalid response from server');
        setLoading(false);
        return;
      }

      try {
        await secureStore.setItemAsync('token', token);
        await secureStore.setItemAsync('user', JSON.stringify(user));
        console.log('Token and user stored, navigating to dashboard');
      } catch (storageErr) {
        console.error('SecureStore error:', storageErr);
        Alert.alert('Storage Error', 'Failed to save credentials');
        setLoading(false);
        return;
      }
      
      // Use relative path since we're already in (tabs)
      router.push('/dashboard');
    } catch (err) {
      let msg = 'Server error';
      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.msg || err.message || msg;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      console.log('Login error:', msg);
      Alert.alert('Login failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} autoCapitalize="none" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={() => router.push('/')}>
        <Text style={styles.linkText}>Create an account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#f2f2f2' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20 },
  input: { width: '100%', padding: 12, backgroundColor: '#fff', borderRadius: 8, marginBottom: 12 },
  button: { width: '100%', padding: 12, backgroundColor: '#00d4ff', borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#031123', fontWeight: '700' },
  link: { marginTop: 12 },
  linkText: { color: '#0077cc' },
});
