import React, { useEffect, useState } from 'react';
import './../App.css'
import api from '../utils/api';
import SideBar from  './../SideBar.jsx'

function Quiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [attemptId, setAttemptId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/api/quizzes');
        setQuizzes(res.data);
      } catch (err) {
        setError(err.response?.data?.msg || err.message || 'Failed to load quizzes');
      }
    };
    load();
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
      console.error(err);
      setError('Failed to start quiz');
    }
  };

  const handleChange = (qid, val) => setAnswers(a => ({ ...a, [qid]: val }));

  const submit = async () => {
    try {
      const res = await api.post(`/api/quizzes/submit/${attemptId}`, { answers });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to submit quiz');
    }
  };

  if (selected && questions.length > 0) {
    return (
      <>
      <SideBar />
      <main className="center">
        <div className="centerContent">
          <div className="headerClass"><div className="nameClass">Quiz</div></div>
          <div style={{ marginTop: 12 }}>
            {questions.map((q, idx) => (
              <div key={q.id} style={{ padding: 10, border: '1px solid #333', marginBottom: 10 }}>
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
              <button onClick={submit} style={{ padding:'8px 12px', background:'#00d4ff', border:'none' }}>Submit Quiz</button>
              <button onClick={() => { setSelected(null); setQuestions([]); setAttemptId(null); setResult(null); }} style={{ marginLeft: 8 }}>Back</button>
            </div>
            {result && (
              <div style={{ marginTop: 12 }}>
                <div>Score: {result.score}/{result.maxScore}</div>
                <div>Percent: {result.percent}%</div>
                <div>Color: {result.color}</div>
              </div>
            )}
          </div>
        </div>
      </main>
      </>
    );
  }

  return (
    <>
    <SideBar />
    <main className="center">
      <div className="centerContent">
        <div className="headerClass"><div className="nameClass">Quizzes</div></div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
          {quizzes.map(q => (
            <div key={q.id} style={{ padding: 12, border: '1px solid #ccc', borderRadius: 6, background: '#ccc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ color: '#103238ff' }}>{q.title}</strong>
              </div>
              <div style={{ marginTop: 8 }}>{q.description}</div>
              <div style={{ marginTop: 10 }}>
                <button onClick={() => startQuiz(q.id)} style={{ padding: '6px 10px', background:'#5bbfd1ff', border:'none', color:'#031028' }}>Start</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
    </>
  );
}

export default Quiz;