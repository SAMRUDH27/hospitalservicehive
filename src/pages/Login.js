import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHive } from '../contexts/HiveContext';

const loginStyles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    padding: '1rem'
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: '0.5rem'
  },
  subtitle: {
    fontSize: '1rem',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: '2rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151'
  },
  input: {
    padding: '0.75rem',
    borderRadius: '0.375rem',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  button: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.75rem 1rem',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  error: {
    color: '#ef4444',
    fontSize: '0.875rem',
    marginTop: '0.5rem'
  },
  installMessage: {
    textAlign: 'center',
    color: '#ef4444',
    marginBottom: '1rem'
  },
  installLink: {
    color: '#2563eb',
    textDecoration: 'underline',
    cursor: 'pointer'
  }
};

function Login() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(true);
  const { login, isKeychainAvailable } = useHive();
  const navigate = useNavigate();

  useEffect(() => {
    // Give a short delay to ensure Hive Keychain is properly detected
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter your Hive username');
      return;
    }

    try {
      await login(username);
      navigate('/');
    } catch (error) {
      setError(error.message || 'Failed to login. Please try again.');
    }
  };

  if (isChecking) {
    return (
      <div style={loginStyles.container}>
        <div style={loginStyles.formContainer}>
          <h2 style={loginStyles.title}>Checking Hive Keychain...</h2>
        </div>
      </div>
    );
  }

  if (!isKeychainAvailable) {
    return (
      <div style={loginStyles.container}>
        <div style={loginStyles.formContainer}>
          <h2 style={loginStyles.title}>Hive Keychain Required</h2>
          <p style={loginStyles.installMessage}>
            Please install Hive Keychain extension to continue.
            <br />
            <a 
              href="https://chrome.google.com/webstore/detail/hive-keychain/jcacnejopjdphbnjgfaaobbfafkihpep"
              target="_blank"
              rel="noopener noreferrer"
              style={loginStyles.installLink}
            >
              Install Hive Keychain
            </a>
          </p>
          <p style={{ textAlign: 'center', marginTop: '1rem' }}>
            If you have already installed Hive Keychain, please refresh the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={loginStyles.container}>
      <div style={loginStyles.formContainer}>
        <h2 style={loginStyles.title}>Sign in with Hive Keychain</h2>
        <p style={loginStyles.subtitle}>
          Enter your Hive username to connect with Hive Keychain
        </p>
        <form onSubmit={handleSubmit} style={loginStyles.form}>
          <div style={loginStyles.inputGroup}>
            <label htmlFor="username" style={loginStyles.label}>
              Hive Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              style={loginStyles.input}
              autoComplete="username"
            />
          </div>
          {error && <p style={loginStyles.error}>{error}</p>}
          <button type="submit" style={loginStyles.button}>
            Connect with Hive Keychain
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login; 