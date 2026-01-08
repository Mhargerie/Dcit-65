import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '../../src/utils/api';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/api/profile');
        setProfile(res.data);
        setForm({ full_name: res.data.full_name || '', birthdate: res.data.birthdate ? new Date(res.data.birthdate).toISOString().slice(0,10) : '', school: res.data.school || '', description: '' });
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const handleChange = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    try {
      await api.put('/api/profile', form);
      setEditing(false);
      const r = await api.get('/api/profile');
      setProfile(r.data);
      Alert.alert('Saved', 'Profile updated');
    } catch (err) {
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  if (!profile) return <View style={styles.loading}><Text>Loading...</Text></View>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {!editing && (
        <View style={styles.card}>
          <Text style={styles.row}><Text style={{fontWeight:'700'}}>Full Name:</Text> {profile.full_name}</Text>
          <Text style={styles.row}><Text style={{fontWeight:'700'}}>Birthdate:</Text> {profile.birthdate ? new Date(profile.birthdate).toLocaleDateString() : ''}</Text>
          <Text style={styles.row}><Text style={{fontWeight:'700'}}>School:</Text> {profile.school}</Text>
          <Text style={styles.row}><Text style={{fontWeight:'700'}}>Description:</Text> {profile.description_enc}</Text>
          <TouchableOpacity style={styles.button} onPress={() => setEditing(true)}><Text style={styles.buttonText}>Edit</Text></TouchableOpacity>
        </View>
      )}

      {editing && (
        <View>
          <TextInput style={styles.input} value={form.full_name} onChangeText={(t) => handleChange('full_name', t)} />
          <TextInput style={styles.input} value={form.birthdate} onChangeText={(t) => handleChange('birthdate', t)} />
          <TextInput style={styles.input} value={form.school} onChangeText={(t) => handleChange('school', t)} />
          <TextInput style={[styles.input, {height: 100}]} value={form.description} onChangeText={(t) => handleChange('description', t)} multiline />
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={styles.button} onPress={save}><Text style={styles.buttonText}>Save</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#ccc', marginLeft: 8 }]} onPress={() => setEditing(false)}><Text>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f7f7f7' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 8 },
  row: { marginBottom: 8 },
  input: { backgroundColor: '#fff', padding: 8, borderRadius: 6, marginBottom: 8 },
  button: { backgroundColor: '#00d4ff', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonText: { fontWeight: '700', color: '#031123' }
});
