import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client } from '@hiveio/dhive';
import toast from 'react-hot-toast';

const nodes = [
  'https://api.hive.blog',
  'https://api.hivekings.com',
  'https://anyx.io',
  'https://api.openhive.network'
];

const client = new Client(nodes);

const HiveContext = createContext();

export function useHive() {
  const context = useContext(HiveContext);
  if (!context) {
    throw new Error('useHive must be used within a HiveProvider');
  }
  return context;
}

export function HiveProvider({ children }) {
  const [username, setUsername] = useState(null);
  const [isKeychainAvailable, setIsKeychainAvailable] = useState(false);

  useEffect(() => {
    // Check for Hive Keychain availability
    const checkKeychain = () => {
      const result = window.hive_keychain ? true : false;
      setIsKeychainAvailable(result);
    };

    // Check immediately
    checkKeychain();

    // Also check after a short delay to ensure extension is loaded
    const timer = setTimeout(checkKeychain, 1000);

    return () => clearTimeout(timer);
  }, []);

  const login = async (username) => {
    if (!window.hive_keychain) {
      throw new Error('Hive Keychain is not installed');
    }

    try {
      // Request a signature to verify the user's identity
      const memo = `Login request for ${username} at ${new Date().toISOString()}`;
      
      return new Promise((resolve, reject) => {
        window.hive_keychain.requestSignBuffer(
          username,
          memo,
          'Posting',
          (response) => {
            if (response.success) {
              setUsername(username);
              resolve();
            } else {
              reject(new Error(response.message || 'Failed to authenticate'));
            }
          }
        );
      });
    } catch (error) {
      throw new Error('Failed to authenticate with Hive Keychain');
    }
  };

  const logout = () => {
    setUsername(null);
  };

  const createPost = async (title, body, tags) => {
    if (!username || !window.hive_keychain) {
      throw new Error('Please login first');
    }

    const operations = [
      ['comment',
        {
          parent_author: '',
          parent_permlink: tags[0],
          author: username,
          permlink: title.toLowerCase().replace(/\s+/g, '-'),
          title: title,
          body: body,
          json_metadata: JSON.stringify({ tags: tags, app: 'hospital-services' })
        }
      ]
    ];

    return new Promise((resolve, reject) => {
      window.hive_keychain.requestBroadcast(
        username,
        operations,
        'posting',
        (response) => {
          if (response.success) {
            resolve(response);
          } else {
            reject(new Error(response.message));
          }
        }
      );
    });
  };

  const vote = async (author, permlink, weight = 10000) => {
    if (!username || !window.hive_keychain) {
      throw new Error('Please login first');
    }

    return new Promise((resolve, reject) => {
      window.hive_keychain.requestVote(
        username,
        permlink,
        author,
        weight,
        (response) => {
          if (response.success) {
            resolve(response);
          } else {
            reject(new Error(response.message));
          }
        }
      );
    });
  };

  const transfer = async (to, amount, memo) => {
    if (!username || !window.hive_keychain) {
      throw new Error('Please login first');
    }

    // Format amount to have exactly 3 decimal places
    const formattedAmount = parseFloat(amount).toFixed(3).toString();

    return new Promise((resolve, reject) => {
      window.hive_keychain.requestTransfer(
        username,
        to,
        formattedAmount,
        memo,
        'HIVE',
        (response) => {
          if (response.success) {
            resolve(response);
          } else {
            reject(new Error(response.message));
          }
        }
      );
    });
  };

  const value = {
    username,
    isKeychainAvailable,
    login,
    logout,
    createPost,
    vote,
    transfer,
    client
  };

  return (
    <HiveContext.Provider value={value}>
      {children}
    </HiveContext.Provider>
  );
} 