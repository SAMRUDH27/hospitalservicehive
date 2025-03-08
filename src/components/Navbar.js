import React from 'react';
import { Link } from 'react-router-dom';
import { useHive } from '../contexts/HiveContext';

const navStyles = {
  nav: {
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: '1rem 0'
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#2563eb',
    textDecoration: 'none'
  },
  navLinks: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center'
  },
  link: {
    color: '#111827',
    textDecoration: 'none',
    padding: '0.5rem',
    borderBottom: '2px solid transparent',
    transition: 'border-color 0.2s'
  },
  button: {
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    border: 'none'
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    marginLeft: '1rem'
  },
  dangerButton: {
    backgroundColor: '#ef4444',
    color: 'white'
  },
  username: {
    color: '#4b5563',
    marginRight: '1rem'
  }
};

function Navbar() {
  const { username, logout } = useHive();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <nav style={navStyles.nav}>
      <div style={navStyles.container}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={navStyles.logo}>
            Hospital Services
          </Link>
          <div style={{ marginLeft: '2rem', ...navStyles.navLinks }}>
            <Link to="/" style={navStyles.link}>
              Home
            </Link>
            <Link to="/news" style={navStyles.link}>
              News
            </Link>
            <Link to="/donate" style={navStyles.link}>
              Donate
            </Link>
          </div>
        </div>
        <div style={navStyles.navLinks}>
          {username ? (
            <>
              <span style={navStyles.username}>
                Connected as @{username}
              </span>
              <Link
                to="/create-post"
                style={{ ...navStyles.button, ...navStyles.primaryButton }}
              >
                Create Post
              </Link>
              <button
                onClick={handleLogout}
                style={{ ...navStyles.button, ...navStyles.dangerButton }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{ ...navStyles.button, ...navStyles.primaryButton }}
              >
                Login with Hive
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 