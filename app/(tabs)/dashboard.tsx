import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Proper SecureStore setup for expo-secure-store
const secureStore = SecureStore;

export default function Dashboard() {
  const [user, setUser] = useState<{ full_name?: string; username?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const u = await secureStore.getItemAsync('user');
        if (u) setUser(JSON.parse(u));
      } catch (e) {
        console.error('Failed to retrieve user from SecureStore:', e);
      }
    })();
  }, []);

  const handleLogout = async () => {
    try {
      await secureStore.deleteItemAsync('token');
      await secureStore.deleteItemAsync('user');
      router.replace('/login');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Hello, {user?.full_name || user?.username || 'Learner'}!</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Overview</Text>
        <Text style={styles.cardText}>This is a simplified mobile dashboard. Charts are static placeholders in this initial migration.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Lessons</Text>
        <Text style={styles.cardText}>- Lesson 1: Intro to Law</Text>
        <Text style={styles.cardText}>- Lesson 2: Constitution Basics</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f7f7f7', flexGrow: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  welcome: { fontSize: 20, fontWeight: '700' },
  logout: { backgroundColor: '#ff6b6b', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  logoutText: { color: '#fff', fontWeight: '700' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  cardText: { fontSize: 14, color: '#333', marginBottom: 4 },
});
