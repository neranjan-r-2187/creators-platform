import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validation: passwords must match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      // Use centralized API utility — no token needed (public route)
      await api.post('/users/register', { name, email, password });

      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const message =
        err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h1 style={titleStyle}>Create Account</h1>
        <p style={subtitleStyle}>Join Creators Platform today</p>

        {/* Error / success messages */}
        {error && <div style={errorStyle}>{error}</div>}
        {success && <div style={successStyle}>{success}</div>}

        <form onSubmit={handleRegister} style={formStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
              placeholder="Your full name"
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
              placeholder="you@example.com"
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
              placeholder="Create a password"
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={inputStyle}
              placeholder="Repeat your password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ ...submitBtnStyle, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p style={linkTextStyle}>
          Already have an account?{' '}
          <Link to="/login" style={linkStyle}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

const containerStyle = {
  minHeight: '80vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
};

const formContainerStyle = {
  maxWidth: '400px',
  width: '100%',
  padding: '2rem',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const titleStyle = { textAlign: 'center', marginBottom: '0.5rem', color: '#333' };
const subtitleStyle = { textAlign: 'center', color: '#666', marginBottom: '1.5rem' };

const errorStyle = {
  backgroundColor: '#fee2e2',
  color: '#dc2626',
  padding: '0.75rem 1rem',
  borderRadius: '4px',
  marginBottom: '1rem',
  fontSize: '0.9rem',
};

const successStyle = {
  backgroundColor: '#dcfce7',
  color: '#16a34a',
  padding: '0.75rem 1rem',
  borderRadius: '4px',
  marginBottom: '1rem',
  fontSize: '0.9rem',
};

const formStyle = {
  backgroundColor: '#f8f9fa',
  padding: '1.5rem',
  borderRadius: '5px',
  marginBottom: '1rem',
};

const fieldStyle = { marginBottom: '1rem' };
const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: '500' };

const inputStyle = {
  width: '100%',
  padding: '0.5rem',
  boxSizing: 'border-box',
  border: '1px solid #ddd',
  borderRadius: '4px',
};

const submitBtnStyle = {
  width: '100%',
  padding: '0.75rem',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '1rem',
};

const linkTextStyle = { textAlign: 'center', marginTop: '1rem' };
const linkStyle = { color: '#007bff', textDecoration: 'none', fontWeight: 'bold' };

export default Register;