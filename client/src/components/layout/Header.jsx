import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        {/* Logo/Brand Name */}
        <h1 style={logoStyle}>
          <Link to="/" style={linkStyle}>
            Creator's Platform
          </Link>
        </h1>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={navLinkStyle}>Home</Link>
          {user ? (
            <>
              <Link to="/dashboard" style={navLinkStyle}>Dashboard</Link>
              <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={navLinkStyle}>Login</Link>
              <Link to="/register" style={navLinkStyle}>Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

// Basic inline styles (you can move these to CSS later)
const headerStyle = {
  backgroundColor: '#333',
  color: 'white',
  padding: '1rem 0',
};

const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 2rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const logoStyle = {
  margin: 0,
  fontSize: '1.5rem',
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
};

const navLinkStyle = {
  color: 'white',
  textDecoration: 'none',
  marginLeft: '2rem',
};

const logoutButtonStyle = {
  backgroundColor: 'transparent',
  border: 'none',
  color: 'white',
  cursor: 'pointer',
  marginLeft: '2rem',
  fontSize: '1rem',
  padding: 0,
};

export default Header;