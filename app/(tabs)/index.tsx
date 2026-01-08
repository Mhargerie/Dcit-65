import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { hashPasswordClientSide, validatePasswordStrength } from '../../src/utils/security';

interface Form {
  full_name: string;
  username: string;
  email: string;
  age: string;
  birthdate: string;
  school: string;
  description: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState<Form>({ full_name: '', username: '', email: '', age: '', birthdate: '', school: '', description: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof Form, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (form.password !== form.confirmPassword) return Alert.alert('Validation', 'Passwords do not match');
    if (!validatePasswordStrength(form.password)) return Alert.alert('Validation', 'Password not strong enough');
    setLoading(true);
    try {
      const hashed = hashPasswordClientSide(form.password);
      await axios.post('http://localhost:5000/api/auth/register', {
        full_name: form.full_name,
        username: form.username,
        email: form.email,
        age: form.age,
        birthdate: form.birthdate,
        school: form.school,
        description: form.description,
        password: hashed,
      });

      Alert.alert('Success', 'Account created successfully', [{ text: 'OK', onPress: () => router.push('/login') }]);
    } catch (err) {
      let msg = 'Server error';
      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.msg || err.message || msg;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      Alert.alert('Registration failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput placeholder="Full name" style={styles.input} value={form.full_name} onChangeText={(t) => handleChange('full_name', t)} />
      <TextInput placeholder="Username" style={styles.input} value={form.username} onChangeText={(t) => handleChange('username', t)} autoCapitalize="none" />
      <TextInput placeholder="Email" style={styles.input} value={form.email} onChangeText={(t) => handleChange('email', t)} keyboardType="email-address" />
      <TextInput placeholder="Age" style={styles.input} value={form.age} onChangeText={(t) => handleChange('age', t)} keyboardType="numeric" />
      <TextInput placeholder="Birthdate (YYYY-MM-DD)" style={styles.input} value={form.birthdate} onChangeText={(t) => handleChange('birthdate', t)} />
      <TextInput placeholder="School" style={styles.input} value={form.school} onChangeText={(t) => handleChange('school', t)} />
      <TextInput placeholder="Short description" style={[styles.input, { height: 80 }]} value={form.description} onChangeText={(t) => handleChange('description', t)} multiline />
      <TextInput placeholder="Password" style={styles.input} value={form.password} onChangeText={(t) => handleChange('password', t)} secureTextEntry />
      <TextInput placeholder="Confirm password" style={styles.input} value={form.confirmPassword} onChangeText={(t) => handleChange('confirmPassword', t)} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Create Account'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={() => router.push('/(tabs)/login')}>
        <Text style={styles.linkText}>Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center', backgroundColor: '#f2f2f2' },
  title: { fontSize: 22, fontWeight: '700', marginVertical: 16 },
  input: { width: '100%', padding: 12, backgroundColor: '#fff', borderRadius: 8, marginBottom: 10 },
  button: { width: '100%', padding: 12, backgroundColor: '#00d4ff', borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonText: { fontWeight: '700', color: '#031123' },
  link: { marginTop: 12 },
  linkText: { color: '#0077cc' },
});
