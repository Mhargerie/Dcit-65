import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { hashPasswordClientSide } from './utils/security.js';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // [cite_start]// 1. Client Side Hashing [cite: 14]
    const hashedPassword = hashPasswordClientSide(password);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password: hashedPassword 
      });

      // Save token securely (in memory or storage)
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      // Redirect to Dashboard
      navigate('/dashboard');
      
    } catch (err) {
      setError('Login Failed: ' + (err.response?.data?.msg || "Server Error"));
    }
  };

  return (
    <div style={{ background: '#eee', color: '#071518ff', height: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div>
        <h2>Login to your Account</h2>
        <form onSubmit={handleLogin}>
          <input 
              type="text" 
              placeholder="Username" 
              onChange={e => setUsername(e.target.value)} 
              style={{ display:'block', margin:'10px 0', padding:'10px' }}
          />
          <input 
              type="password" 
              placeholder="Password" 
              onChange={e => setPassword(e.target.value)} 
              style={{ display:'block', margin:'10px 0', padding:'10px' }}
          />
          <button type="submit" style={{ padding:'10px 20px', background:'#00d4ff', border:'none' }}>
              Login
          </button>
          <Link to="/">
            <button type="button" style={{ padding:'10px 20px', background:'#00d4ff', border:'none', marginLeft: "10px" }}>
                Register
            </button>
          </Link>
          
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      
    </div>
  );
};

export default Login;