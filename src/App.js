// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Donate from './pages/Donate';
import News from './pages/News';
import CreatePost from './pages/CreatePost';
import { HiveProvider } from './contexts/HiveContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <HiveProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Toaster position="top-center" />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/donate" element={
                <ProtectedRoute>
                  <Donate />
                </ProtectedRoute>
              } />
              <Route path="/news" element={<News />} />
              <Route path="/create-post" element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </div>
      </HiveProvider>
    </Router>
  );
}

export default App;