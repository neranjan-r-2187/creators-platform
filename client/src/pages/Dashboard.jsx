import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import socket from '../services/socket';

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/me');
        setProfile(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    // Socket.io initialization
    socket.connect();

    socket.on('connect', () => {
      console.log('✅ Connected to socket server. ID:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from socket server');
    });

    socket.on('connect_error', (err) => {
      console.error('⚠️ Socket connection error:', err.message);
    });

    // Cleanup on unmount
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.disconnect();
    };
  }, []);


  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>Dashboard</h1>
        <p>Welcome back, <strong>{user?.name || user?.email}</strong>!</p>
      </div>

      <div style={contentStyle}>

        {/* Profile Card — fetched via authenticated API call */}
        <div style={cardStyle}>
          <h2 style={cardTitleStyle}>👤 Your Profile</h2>
          <p style={cardSubtitle}>Fetched from the server using your JWT token</p>

          {loading && <p style={mutedStyle}>Loading profile...</p>}
          {error && <div style={errorStyle}>{error}</div>}

          {profile && (
            <div style={profileGridStyle}>
              <div style={profileItemStyle}>
                <span style={profileLabelStyle}>Name</span>
                <span style={profileValueStyle}>{profile.name}</span>
              </div>
              <div style={profileItemStyle}>
                <span style={profileLabelStyle}>Email</span>
                <span style={profileValueStyle}>{profile.email}</span>
              </div>
              <div style={profileItemStyle}>
                <span style={profileLabelStyle}>User ID</span>
                <span style={{ ...profileValueStyle, fontSize: '0.8rem', color: '#888' }}>{profile._id}</span>
              </div>
            </div>
          )}
        </div>

        {/* Security Info Card */}
        <div style={cardStyle}>
          <h2 style={cardTitleStyle}>🔐 Security Info</h2>
          <p style={cardSubtitle}>How this request was authenticated</p>
          <ul style={listStyle}>
            <li>Your JWT token is stored in <code>localStorage</code></li>
            <li>The Axios request interceptor in <code>api.js</code> reads the token automatically</li>
            <li>It attaches <code>Authorization: Bearer &lt;token&gt;</code> to every request</li>
            <li>The backend middleware verifies the token before sending this data</li>
            <li>If the token is invalid, you are automatically logged out</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

const containerStyle = { minHeight: '80vh', padding: '2rem' };

const headerStyle = {
  maxWidth: '1200px',
  margin: '0 auto 2rem',
};

const contentStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '1.5rem',
};

const cardStyle = {
  backgroundColor: 'white',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '1.5rem',
  boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
};

const cardTitleStyle = { marginTop: 0, marginBottom: '0.25rem', color: '#1a202c' };
const cardSubtitle = { color: '#718096', fontSize: '0.875rem', marginBottom: '1.25rem' };

const profileGridStyle = { display: 'flex', flexDirection: 'column', gap: '0.75rem' };
const profileItemStyle = { display: 'flex', flexDirection: 'column', gap: '0.25rem' };
const profileLabelStyle = { fontSize: '0.75rem', textTransform: 'uppercase', color: '#718096', fontWeight: '600' };
const profileValueStyle = { fontSize: '1rem', color: '#2d3748', fontWeight: '500' };

const listStyle = { paddingLeft: '1.5rem', color: '#4a5568', lineHeight: '2' };

const mutedStyle = { color: '#718096' };

const errorStyle = {
  backgroundColor: '#fee2e2',
  color: '#dc2626',
  padding: '0.75rem',
  borderRadius: '4px',
};

export default Dashboard;