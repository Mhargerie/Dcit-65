import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import SideBar from './../SideBar.jsx'

function Profile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/api/profile');
        setProfile(res.data);
+        setForm({ full_name: res.data.full_name || '', birthdate: res.data.birthdate ? new Date(res.data.birthdate).toISOString().slice(0,10) : '', school: res.data.school || '', description: '' });
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const handleChange = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    try {
      await api.put('/api/profile', form);
      setEditing(false);
      const r = await api.get('/api/profile');
      setProfile(r.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <>
    <SideBar />
    <main className="center">
      <div className="centerContent">
        <div className="headerClass"><div className="nameClass">Profile</div></div>
        {!editing && (
          <div>
            <div><strong>Full Name:</strong> {profile.full_name}</div>
            <div><strong>Birthdate:</strong> {profile.birthdate ? new Date(profile.birthdate).toLocaleDateString() : ''}</div>
            <div><strong>School:</strong> {profile.school}</div>
            <div><strong>Description:</strong> {profile.description_enc}</div>
            <button onClick={() => setEditing(true)} style={{ marginTop: 10, padding: '6px 10px', background:'#00d4ff', border:'none' }}>Edit</button>
          </div>
        )}
        {editing && (
          <div style={{ display: 'grid', gap: 8 }}>
            <input value={form.full_name} onChange={e => handleChange('full_name', e.target.value)} />
            <input type="date" value={form.birthdate} onChange={e => handleChange('birthdate', e.target.value)} />
            <input value={form.school} onChange={e => handleChange('school', e.target.value)} />
            <textarea placeholder="Description" value={form.description} onChange={e => handleChange('description', e.target.value)} />
            <div>
              <button onClick={save} style={{ padding:'6px 10px', background:'#00d4ff', border:'none' }}>Save</button>
              <button onClick={() => setEditing(false)} style={{ marginLeft:8 }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </main>
    </>
  );
}

export default Profile;
