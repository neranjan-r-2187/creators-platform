import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Use centralized API instance — token is NOT manually attached here.
      // The request interceptor in api.js handles that for all future requests.
      const response = await api.post('/users/login', { email, password });
      const { token, data: user } = response.data;

      // Store in context and localStorage via AuthContext
      login(user, token);

      // Redirect to the protected dashboard
      navigate('/dashboard');
    } catch (err) {
      const message =
        err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h1 style={titleStyle}>Login</h1>
        <p style={subtitleStyle}>Sign in to your account</p>

        {/* Error message */}
        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleLogin} style={formStyle}>
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
              placeholder="Your password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ ...submitBtnStyle, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p style={linkTextStyle}>
          Don't have an account?{' '}
          <Link to="/register" style={linkStyle}>
            Register here
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
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '1rem',
};

const linkTextStyle = { textAlign: 'center', marginTop: '1rem' };
const linkStyle = { color: '#007bff', textDecoration: 'none', fontWeight: 'bold' };

export default Login;