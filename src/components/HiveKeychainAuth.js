import React, { useState, useEffect } from 'react';

// Component for Hive Keychain Authentication
const HiveKeychainAuth = () => {
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [keychainAvailable, setKeychainAvailable] = useState(false);

  // Check if Keychain is available when component mounts
  useEffect(() => {
    const checkKeychain = () => {
      if (window.hive_keychain) {
        setKeychainAvailable(true);
        console.log('Hive Keychain extension is installed');
      } else {
        setKeychainAvailable(false);
        console.log('Hive Keychain extension is not installed');
      }
    };

    // Check immediately
    checkKeychain();

    // Also add event listener for keychain
    window.addEventListener('load', checkKeychain);
    
    // Check again after a delay in case extension loads after page
    const timer = setTimeout(checkKeychain, 1000);

    return () => {
      window.removeEventListener('load', checkKeychain);
      clearTimeout(timer);
    };
  }, []);

  // Handle username input change
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  // Function to authenticate with Hive Keychain
  const authenticate = () => {
    if (!keychainAvailable) {
      setStatus('Error: Hive Keychain extension is not installed');
      return;
    }

    if (!username) {
      setStatus('Error: Please enter a Hive username');
      return;
    }

    // Create a random memo for authentication
    const memo = `Auth-${Math.floor(Math.random() * 1000000)}`;
    
    // Use keychain to request a signature
    window.hive_keychain.requestSignBuffer(
      username,
      memo,
      'Posting',
      (response) => {
        console.log('Keychain response:', response);
        
        if (response.success) {
          // Verify the signature on your backend or here if possible
          // For this example, we'll just consider a successful signature as authentication
          setIsAuthenticated(true);
          setStatus('Successfully authenticated!');
        } else {
          setIsAuthenticated(false);
          if (response.error === 'user_cancel') {
            setStatus('Authentication cancelled by user');
          } else if (response.message === 'Request rejected') {
            setStatus('Request was rejected. Please check your username');
          } else {
            setStatus(`Error: ${response.message}`);
          }
        }
      }
    );
  };

  // Function to logout
  const logout = () => {
    setIsAuthenticated(false);
    setStatus('Logged out successfully');
  };

  return (
    <div className="hive-auth-container">
      <h2>Hive Keychain Authentication</h2>
      
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
          />
          <button onClick={authenticate} disabled={!keychainAvailable}>
            Login with Hive Keychain
          </button>
        </div>
      ) : (
        <div className="user-info">
          <p>Logged in as: <strong>{username}</strong></p>
          <button onClick={logout}>Logout</button>
        </div>
      )}
      
      {status && <p className="status-message">{status}</p>}
    </div>
  );
};

export default HiveKeychainAuth;