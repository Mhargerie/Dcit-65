import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './../App.css';
import SideBar from './../SideBar.jsx'
function Lessons() {
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/api/lessons/');
        setLessons(res.data);
      } catch (err) {
        setError(err.response?.data?.msg || err.message || 'Failed to load');
      }
    };
    load();
  }, []);

  return (
    <>
    <SideBar />
    <main className="center">
      <div className="centerContent">
        <div className="headerClass">
          <div className="nameClass">Lessons</div>
        </div>

        {error && <div style={{ color: 'red' }}>{error}</div>}

        <div style={{ display: 'grid', gap: 12 }}>
          {lessons.map(l => (
            <div key={l.id} style={{ padding: 12, border: '1px solid #ccc', borderRadius: 6, background: l.locked ? '#ccc' : '#eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ color: '#102f35ff' }}>{l.title}</strong>
                {l.completed ? <span style={{ color: 'green' }}>Completed</span> : (l.locked ? <span style={{ color: 'orange' }}>Locked</span> : <span style={{ color: '#141414ff' }}>Available</span>)}
              </div>
              <div style={{ marginTop: 8 }}>{l.summary}</div>
              <div style={{ marginTop: 10 }}>
                <Link to={`/lessons/${l.id}`}><button style={{ padding: '6px 10px', background:'#00d4ff', border:'none', color:'#031028' }}>Open</button></Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
    </>
  );
}

export default Lessons;
