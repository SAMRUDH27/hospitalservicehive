// src/components/HiveAuth.js

import React, { useState } from 'react';
import { useHiveAuth } from '../contexts/HiveAuthContext';

const HiveAuth = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  const { 
    isAuthenticated, 
    keychainAvailable, 
    loading, 
    user, 
    login, 
    logout 
  } = useHiveAuth();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleLogin = async () => {
    setMessage('');
    
    if (!username.trim()) {
      setMessage('Please enter a valid Hive username');
      setMessageType('error');
      return;
    }
    
    const result = await login(username);
    
    setMessage(result.message);
    setMessageType(result.success ? 'success' : 'error');
    
    if (result.success) {
      setUsername('');
    }
  };

  const handleLogout = () => {
    const result = logout();
    setMessage(result.message);
    setMessageType('success');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="hive-auth-container">
      <h2>Hive Authentication</h2>
      
      {!keychainAvailable && (
        <div className="warning">
          <p>Hive Keychain extension is not installed. Please install it to proceed.</p>
          <a 
            href="https://chrome.google.com/webstore/detail/hive-keychain/jcacnejopjdphbnjgfaaobbfafkihpep" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Install Hive Keychain for Chrome
          </a>
        </div>
      )}
      
      {!isAuthenticated ? (
        <div className="login-form">
          <input
            type="text"
            placeholder="Enter your Hive username"
            value={username}
            onChange={handleUsernameChange}
            disabled={!keychainAvailable}
          />
          <button 
            onClick={handleLogin} 
            disabled={!keychainAvailable || loading}
          >
            {loading ? 'Logging in...' : 'Login with Hive Keychain'}
          </button>
        </div>
      ) : (
        <div className="user-info">
          <p>Logged in as: <strong>{user.username}</strong></p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
      
      {message && (
        <p className={`message ${messageType}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default HiveAuth;