import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { hashPasswordClientSide, validatePasswordStrength } from './utils/security';

const Register = () => {
  const navigate = useNavigate();
  
  // State for all required fields
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '', // Added as good practice, though not strictly in your list
    age: '',
    birthdate: '',
    school: '',
    description: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Password Confirmation Check
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match!");
    }

    // 2. Password Strength Check (8 chars, alphanumeric, special char)
    if (!validatePasswordStrength(formData.password)) {
      return setError("Password must be at least 8 chars, contain letters, numbers, and special characters.");
    }

    // 3. Client-Side Hashing (Security Layer 1)
    const hashedPassword = hashPasswordClientSide(formData.password);

    try {
      // Send data to backend
      await axios.post('http://localhost:5000/api/auth/register', {
        full_name: formData.full_name,
        username: formData.username,
        email: formData.email,
        age: formData.age,
        birthdate: formData.birthdate,
        school: formData.school,
        description: formData.description, // Will be encrypted by Server
        password: hashedPassword 
      });

      // Show Success Popup
      setShowSuccessPopup(true);

    } catch (err) {
      setError(err.response?.data?.msg || "Registration Failed");
    }
  };

  // Function to close popup and go to Login
  const handlePopupClose = () => {
    setShowSuccessPopup(false);
    navigate('/login'); // Redirect to Login Page
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{color: '#030f11ff'}}>Create Account</h2>
        {error && <p style={{color: 'red', background: 'rgba(255,0,0,0.1)', padding: '5px'}}>{error}</p>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <input name="full_name" placeholder="Full Name" onChange={handleChange} required style={styles.input} />
          <input name="username" placeholder="Username" onChange={handleChange} required style={styles.input} />
          <div style={{display:'flex', gap:'10px'}}>
            <input name="age" type="number" placeholder="Age" onChange={handleChange} required style={styles.input} />
            <input name="birthdate" type="date" onChange={handleChange} required style={styles.input} />
          </div>
          <input name="school" placeholder="School" onChange={handleChange} required style={styles.input} />
          <textarea name="description" placeholder="Short Description (Will be Encrypted)" onChange={handleChange} style={{...styles.input, height: '60px'}} />
          
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required style={styles.input} />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} required style={styles.input} />
          
          <button type="submit" style={styles.button}>Register</button>
        </form>
        
        <p style={{marginTop: '15px', color: '#ccc'}}>
          Already have an account? <Link to="/login" style={{color: '#020a0cff'}}>Log In</Link>
        </p>
      </div>

      {/* SUCCESS POPUP */}
      {showSuccessPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popup}>
            <h3 style={{color: 'green'}}>Success!</h3>
            <p style={{color: 'black'}}>Account created successfully.</p>
            <button onClick={handlePopupClose} style={styles.button}>Go to Login</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Basic Styling to match "Blue/Neon" theme [cite: 1]
const styles = {
  container: { background: '#eee', width: '100%', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  card: { background: '#d4d4d4ff', padding: '30px', borderRadius: '10px', width: '400px' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '10px', borderRadius: '5px', border: '1px solid #aaa', background: '#ddd', color: '#111' },
  button: { padding: '10px', background: '#00d4ff', color: '#0a0f29', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  popupOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  popup: { background: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center', minWidth: '250px' }
};

export default Register;