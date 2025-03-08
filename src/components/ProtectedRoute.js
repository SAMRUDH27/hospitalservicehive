import React from 'react';
import { Navigate } from 'react-router-dom';
import { useHive } from '../contexts/HiveContext';

function ProtectedRoute({ children }) {
  const { username, isKeychainAvailable } = useHive();

  if (!isKeychainAvailable) {
    return <Navigate to="/login" />;
  }

  if (!username) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute; 