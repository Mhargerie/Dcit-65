import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import api from '../../src/utils/api';

export default function Quiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [attemptId, setAttemptId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/api/quizzes');
        setQuizzes(res.data || []);
      } catch (err) {
        setError(err.response?.data?.msg || err.message || 'Failed to load quizzes');
      }
    })();
  }, []);

  const startQuiz = async (id) => {
    try {
      setResult(null);
      const res = await api.get(`/api/quizzes/${id}`);
      setAttemptId(res.data.attemptId);
      setQuestions(res.data.questions || []);
      setSelected(id);
      setAnswers({});
    } catch (err) {
      Alert.alert('Error', 'Failed to start quiz');
    }
  };

  const handleChange = (qid, val) => setAnswers(a => ({ ...a, [qid]: val }));

  const submit = async () => {
    try {
      const res = await api.post(`/api/quizzes/submit/${attemptId}`, { answers });
      setResult(res.data);
    } catch (err) {
      Alert.alert('Error', 'Failed to submit quiz');
    }
  };

  if (selected && questions.length > 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Quiz</Text>
        {questions.map((q, idx) => (
          <View key={q.id} style={styles.questionBox}>
            <Text style={{ fontWeight: '700' }}>{idx + 1}. {q.question}</Text>
            <View style={{ marginTop: 8 }}>
              {q.type === 'mcq' && (q.choices || []).map(c => (
                <TouchableOpacity key={c} style={styles.choice} onPress={() => handleChange(q.id, c)}>
                  <Text style={{ color: answers[q.id] === c ? '#0077cc' : '#000' }}>{c}</Text>
                </TouchableOpacity>
              ))}
              {q.type === 'tf' && (
                <>
                  <TouchableOpacity style={styles.choice} onPress={() => handleChange(q.id, 'true')}><Text style={{ color: answers[q.id] === 'true' ? '#0077cc' : '#000' }}>True</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.choice} onPress={() => handleChange(q.id, 'false')}><Text style={{ color: answers[q.id] === 'false' ? '#0077cc' : '#000' }}>False</Text></TouchableOpacity>
                </>
              )}
              {q.type === 'id' && (
                <TouchableOpacity style={styles.choice}><TextInput placeholder="Answer" onChangeText={(t) => handleChange(q.id, t)} value={answers[q.id] || ''} /></TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        <View style={{ flexDirection: 'row', marginTop: 12 }}>
          <TouchableOpacity style={styles.button} onPress={submit}><Text style={styles.buttonText}>Submit Quiz</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#ccc', marginLeft: 8 }]} onPress={() => { setSelected(null); setQuestions([]); setAttemptId(null); setResult(null); }}><Text>Back</Text></TouchableOpacity>
        </View>

        {result && (
          <View style={{ marginTop: 12 }}>
            <Text>Score: {result.score}/{result.maxScore}</Text>
            <Text>Percent: {result.percent}%</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quizzes</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={quizzes}
        keyExtractor={(item) => String(item.id || item._id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.summary}>{item.description}</Text>
            <TouchableOpacity style={styles.button} onPress={() => startQuiz(item.id || item._id)}>
              <Text style={styles.buttonText}>Start</Text>
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
  error: { color: 'red' },
  item: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 12 },
  itemTitle: { fontWeight: '700' },
  summary: { marginTop: 8, color: '#333' },
  button: { marginTop: 10, backgroundColor: '#5bbfd1', padding: 8, borderRadius: 8, alignItems: 'center' },
  buttonText: { fontWeight: '700', color: '#031028' },
  questionBox: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 10 },
  choice: { paddingVertical: 8 }
});
