import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import SideBar from './../SideBar.jsx'

function LessonView() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/lessons/${id}`);
        setLesson(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [id]);

  const startAssessment = async () => {
    try {
      const res = await api.get(`/api/assessments/lesson/${id}`);
      setAttempt(res.data.attemptId);
      setQuestions(res.data.questions || []);
      setAnswers({});
      setResult(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (qid, val) => {
    setAnswers(a => ({ ...a, [qid]: val }));
  };

  const submit = async () => {
    try {
      const res = await api.post(`/api/assessments/submit/${attempt}`, { answers });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
    <SideBar />
    <main className="center">
      <div className="centerContent">
        <div className="headerClass">
          <div className="nameClass">{lesson ? lesson.title : 'Lesson'}</div>
        </div>

        {lesson && <div style={{ marginBottom: 12 }}>{lesson.summary}</div>}

        {!attempt && <button onClick={startAssessment} style={{ padding: '8px 12px', background:'#00d4ff', border:'none' }}>Start Assessment</button>}

        {questions.length > 0 && (
          <div style={{ marginTop: 16 }}>
            {questions.map((q, idx) => (
              <div key={q.id} style={{ marginBottom: 12, padding: 10, border: '1px solid #333' }}>
                <div><strong>{idx+1}. </strong>{q.question}</div>
                <div style={{ marginTop: 8 }}>
                  {q.type === 'mcq' && (q.choices || []).map(c => (
                    <label key={c} style={{ display: 'block' }}>
                      <input type="radio" name={q.id} onChange={() => handleChange(q.id, c)} /> {c}
                    </label>
                  ))}
                  {q.type === 'tf' && (
                    <>
                      <label><input type="radio" name={q.id} onChange={() => handleChange(q.id, 'true')} /> True</label>
                      <label style={{ marginLeft: 8 }}><input type="radio" name={q.id} onChange={() => handleChange(q.id, 'false')} /> False</label>
                    </>
                  )}
                  {q.type === 'id' && (
                    <input placeholder="Answer" onChange={e => handleChange(q.id, e.target.value)} />
                  )}
                </div>
              </div>
            ))}

            <div>
              <button onClick={submit} style={{ padding: '8px 12px', background:'#00d4ff', border:'none' }}>Submit</button>
            </div>
          </div>
        )}

        {result && (
          <div style={{ marginTop: 12 }}>
            <div>Score: {result.score}/{result.maxScore}</div>
            <div>Percent: {result.percent}%</div>
            <div>Color: {result.color}</div>
          </div>
        )}
      </div>
    </main>
    </>
  );
}

export default LessonView;
