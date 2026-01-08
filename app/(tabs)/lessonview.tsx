import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '../../src/utils/api';

type Question = {
  id: string;
  question: string;
  type: 'mcq' | 'tf' | 'id';
  choices?: string[];
};

type Lesson = {
  id?: string;
  _id?: string;
  title?: string;
  summary?: string;
};

type Result = {
  score: number;
  maxScore: number;
  percent: number;
};

export default function LessonView() {
  const params = useLocalSearchParams();
  const id = String(params.id || '');
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [attempt, setAttempt] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await api.get(`/api/lessons/${id}`);
        setLesson(res.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) console.error(err.message);
        else if (err instanceof Error) console.error(err.message);
      }
    })();
  }, [id]);

  const startAssessment = async () => {
    try {
      const res = await api.get(`/api/assessments/lesson/${id}`);
      setAttempt(String(res.data.attemptId));
      setQuestions(res.data.questions || []);
      setAnswers({});
      setResult(null);
    } catch (err: unknown) {
      Alert.alert('Error', 'Failed to start assessment');
    }
  };

  const handleChange = (qid: string, val: string) => setAnswers(a => ({ ...a, [qid]: val }));

  const submit = async () => {
    try {
      const res = await api.post(`/api/assessments/submit/${attempt}`, { answers });
      setResult(res.data);
    } catch (err: unknown) {
      Alert.alert('Error', 'Failed to submit answers');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{lesson ? lesson.title : 'Lesson'}</Text>
      {lesson && <Text style={styles.summary}>{lesson.summary}</Text>}

      {!attempt && (
        <TouchableOpacity style={styles.button} onPress={startAssessment}>
          <Text style={styles.buttonText}>Start Assessment</Text>
        </TouchableOpacity>
      )}

      {questions.length > 0 && (
        <View style={{ marginTop: 12 }}>
          {questions.map((q, idx) => (
            <View key={q.id} style={styles.questionBox}>
              <Text style={{ fontWeight: '700' }}>{idx + 1}. {q.question}</Text>
              <View style={{ marginTop: 8 }}>
                {q.type === 'mcq' && (q.choices || []).map((c) => (
                  <TouchableOpacity key={c} style={styles.choice} onPress={() => handleChange(q.id, c)}>
                    <Text style={{ color: answers[q.id] === c ? '#0077cc' : '#000' }}>{c}</Text>
                  </TouchableOpacity>
                ))}
                {q.type === 'tf' && (
                  <View>
                    <TouchableOpacity style={styles.choice} onPress={() => handleChange(q.id, 'true')}><Text style={{ color: answers[q.id] === 'true' ? '#0077cc' : '#000' }}>True</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.choice} onPress={() => handleChange(q.id, 'false')}><Text style={{ color: answers[q.id] === 'false' ? '#0077cc' : '#000' }}>False</Text></TouchableOpacity>
                  </View>
                )}
                {q.type === 'id' && (
                  <TextInput style={styles.input} placeholder="Answer" onChangeText={(t) => handleChange(q.id, t)} value={answers[q.id] || ''} />
                )}
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.button} onPress={submit}><Text style={styles.buttonText}>Submit</Text></TouchableOpacity>
        </View>
      )}

      {result && (
        <View style={{ marginTop: 12 }}>
          <Text>Score: {result.score}/{result.maxScore}</Text>
          <Text>Percent: {result.percent}%</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f7f7f7' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  summary: { color: '#333', marginBottom: 12 },
  button: { backgroundColor: '#00d4ff', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#031123', fontWeight: '700' },
  questionBox: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 10 },
  choice: { paddingVertical: 8 },
  input: { backgroundColor: '#fff', padding: 8, borderRadius: 6, marginTop: 6 }
});
