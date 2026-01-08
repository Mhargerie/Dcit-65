import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import api from '../../src/utils/api';

type Lesson = {
  id?: string;
  _id?: string;
  locked?: boolean;
  title?: string;
  completed?: boolean;
  summary?: string;
};

export default function Lessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/api/lessons/');
        setLessons(res.data || []);
      } catch (err: unknown) {
        let msg = 'Failed to load';
        if (axios.isAxiosError(err)) msg = err.response?.data?.msg || err.message || msg;
        else if (err instanceof Error) msg = err.message;
        setError(msg);
      }
    })();
  }, []);

  const open = (id: string) => router.push(`/lessonview?id=${id}` as any);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lessons</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={lessons}
        keyExtractor={(item) => String(item.id ?? item._id ?? '')}
        renderItem={({ item }) => (
          <View style={[styles.item, item.locked ? styles.locked : null]}>
            <View style={styles.row}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text>{item.completed ? 'Completed' : item.locked ? 'Locked' : 'Available'}</Text>
            </View>
            <Text style={styles.summary}>{item.summary}</Text>
            <TouchableOpacity style={styles.button} onPress={() => open(item.id ?? item._id ?? '')}>
              <Text style={styles.buttonText}>Open</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f7f7' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  error: { color: 'red', marginBottom: 12 },
  item: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 12 },
  locked: { opacity: 0.6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTitle: { fontWeight: '700' },
  summary: { marginTop: 8, color: '#333' },
  button: { marginTop: 10, backgroundColor: '#00d4ff', padding: 8, borderRadius: 8, alignItems: 'center' },
  buttonText: { fontWeight: '700', color: '#031123' },
});
