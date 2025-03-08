// src/contexts/HiveAuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import HiveKeychainService from '../services/HiveKeychainService';

const HiveAuthContext = createContext();

export const useHiveAuth = () => useContext(HiveAuthContext);

export const HiveAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [keychainAvailable, setKeychainAvailable] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Keychain is available
    const checkKeychain = () => {
      const available = HiveKeychainService.checkKeychainAvailability();
      setKeychainAvailable(available);
    };

    // Restore session from localStorage if available
    const restoreSession = () => {
      const savedUser = localStorage.getItem('hive_user');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (e) {
          console.error('Failed to parse saved user data', e);
          localStorage.removeItem('hive_user');
        }
      }
      setLoading(false);
    };

    // Check immediately
    checkKeychain();
    restoreSession();

    // Also check if Keychain is loaded later
    window.addEventListener('load', checkKeychain);
    const timer = setTimeout(checkKeychain, 1500);

    return () => {
      window.removeEventListener('load', checkKeychain);
      clearTimeout(timer);
    };
  }, []);

  const login = async (username) => {
    setLoading(true);
    const result = await HiveKeychainService.authenticate(username);
    
    if (result.success) {
      const userData = {
        username: result.username,
        authTime: new Date().toISOString(),
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('hive_user', JSON.stringify(userData));
    }
    
    setLoading(false);
    return result;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('hive_user');
    return { success: true, message: 'Logged out successfully' };
  };

  // Function to broadcast any transaction
  const broadcastTransaction = async (operations, key = 'Active') => {
    if (!isAuthenticated || !user) {
      return { success: false, message: 'User not authenticated' };
    }
    
    return await HiveKeychainService.broadcastTransaction(user.username, operations, key);
  };

  // Transfer helper function
  const transfer = async (to, amount, memo, currency = 'HIVE') => {
    if (!isAuthenticated || !user) {
      return { success: false, message: 'User not authenticated' };
    }
    
    return await HiveKeychainService.transfer(user.username, to, amount, memo, currency);
  };

  // Vote helper function
  const vote = async (permlink, author, weight) => {
    if (!isAuthenticated || !user) {
      return { success: false, message: 'User not authenticated' };
    }
    
    return await HiveKeychainService.vote(user.username, permlink, author, weight);
  };

  // Custom JSON helper function
  const customJson = async (id, json, key = 'Posting', display_name = 'Custom Operation') => {
    if (!isAuthenticated || !user) {
      return { success: false, message: 'User not authenticated' };
    }
    
    return await HiveKeychainService.customJson(user.username, id, key, json, display_name);
  };

  // Post helper function
  const post = async (title, body, parentPermlink, parentAuthor = '', jsonMetadata = {}, permlink = '', options = {}) => {
    if (!isAuthenticated || !user) {
      return { success: false, message: 'User not authenticated' };
    }
    
    // Generate permlink if not provided
    if (!permlink) {
      permlink = title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .substring(0, 200);
    }
    
    return await HiveKeychainService.post(
      user.username,
      title,
      body,
      parentPermlink,
      parentAuthor,
      jsonMetadata,
      permlink,
      options
    );
  };

  const value = {
    user,
    isAuthenticated,
    keychainAvailable,
    loading,
    login,
    logout,
    broadcastTransaction,
    transfer,
    vote,
    customJson,
    post
  };

  return (
    <HiveAuthContext.Provider value={value}>
      {children}
    </HiveAuthContext.Provider>
  );
};