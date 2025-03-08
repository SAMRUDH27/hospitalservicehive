// src/components/HiveTransactions.js

import React, { useState } from 'react';
import { useHiveAuth } from '../contexts/HiveAuthContext';

const HiveTransactions = () => {
  const { isAuthenticated, user, transfer, vote, customJson, broadcastTransaction } = useHiveAuth();
  
  const [transferData, setTransferData] = useState({
    to: '',
    amount: '',
    memo: '',
    currency: 'HIVE'
  });
  
  const [voteData, setVoteData] = useState({
    author: '',
    permlink: '',
    weight: 10000 // 100% upvote
  });
  
  const [customJsonData, setCustomJsonData] = useState({
    id: 'custom-operation',
    json: '',
    key: 'Posting',
    displayName: 'Custom Operation'
  });
  
  const [broadcastData, setbroadcastData] = useState({
    operations: '',
    key: 'Active'
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleTransferChange = (e) => {
    setTransferData({
      ...transferData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleVoteChange = (e) => {
    let value = e.target.value;
    if (e.target.name === 'weight') {
      value = parseInt(value, 10);
    }
    setVoteData({
      ...voteData,
      [e.target.name]: value
    });
  };
  
  const handleCustomJsonChange = (e) => {
    setCustomJsonData({
      ...customJsonData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleBroadcastChange = (e) => {
    setbroadcastData({
      ...broadcastData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleTransfer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    
    const res = await transfer(
      transferData.to,
      transferData.amount,
      transferData.memo,
      transferData.currency
    );
    
    setResult(res);
    setLoading(false);
  };
  
  const handleVote = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    
    const res = await vote(
      voteData.permlink,
      voteData.author,
      voteData.weight
    );
    
    setResult(res);
    setLoading(false);
  };
  
  const handleCustomJson = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    
    let jsonData;
    try {
      jsonData = JSON.parse(customJsonData.json);
    } catch (error) {
      setResult({
        success: false,
        message: 'Invalid JSON: ' + error.message
      });
      setLoading(false);
      return;
    }
    
    const res = await customJson(
      customJsonData.id,
      jsonData,
      customJsonData.key,
      customJsonData.displayName
    );
    
    setResult(res);
    setLoading(false);
  };
  
  const handleBroadcast = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    
    let operations;
    try {
      operations = JSON.parse(broadcastData.operations);
      if (!Array.isArray(operations)) {
        throw new Error('Operations must be an array');
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Invalid operations format: ' + error.message
      });
      setLoading(false);
      return;
    }
    
    const res = await broadcastTransaction(
      operations,
      broadcastData.key
    );
    
    setResult(res);
    setLoading(false);
  };
  
  if (!isAuthenticated) {
    return (
      <div className="transactions-container">
        <h2>Hive Transactions</h2>
        <p>Please log in with your Hive account to perform transactions.</p>
      </div>
    );
  }
  
  return (
    <div className="transactions-container">
      <h2>Hive Transactions</h2>
      <p>Logged in as: <strong>{user.username}</strong></p>
      
      <div className="transaction-sections">
        <div className="transaction-section">
          <h3>Transfer HIVE/HBD</h3>
          <form onSubmit={handleTransfer}>
            <div>
              <label>To:</label>
              <input
                type="text"
                name="to"
                value={transferData.to}
                onChange={handleTransferChange}
                required
              />
            </div>
            <div>
              <label>Amount:</label>
              <input
                type="text"
                name="amount"
                value={transferData.amount}
                onChange={handleTransferChange}
                required
                pattern="[0-9]*\.?[0-9]+"
              />
            </div>
            <div>
              <label>Currency:</label>
              <select
                name="currency"
                value={transferData.currency}
                onChange={handleTransferChange}
              >
                <option value="HIVE">HIVE</option>
                <option value="HBD">HBD</option>
              </select>
            </div>
            <div>
              <label>Memo:</label>
              <input
                type="text"
                name="memo"
                value={transferData.memo}
                onChange={handleTransferChange}
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Send Transfer'}
            </button>
          </form>
        </div>
        
        <div className="transaction-section">
          <h3>Vote for Content</h3>
          <form onSubmit={handleVote}>
            <div>
              <label>Author:</label>
              <input
                type="text"
                name="author"
                value={voteData.author}
                onChange={handleVoteChange}
                required
              />
            </div>
            <div>
              <label>Permlink:</label>
              <input
                type="text"
                name="permlink"
                value={voteData.permlink}
                onChange={handleVoteChange}
                required
              />
            </div>
            <div>
              <label>Weight (10000 = 100%):</label>
              <input
                type="number"
                name="weight"
                value={voteData.weight}
                onChange={handleVoteChange}
                min="-10000"
                max="10000"
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Vote'}
            </button>
          </form>
        </div>
        
        <div className="transaction-section">
          <h3>Custom JSON Operation</h3>
          <form onSubmit={handleCustomJson}>
            <div>
              <label>ID:</label>
              <input
                type="text"
                name="id"
                value={customJsonData.id}
                onChange={handleCustomJsonChange}
                required
              />
            </div>
            <div>
              <label>Key:</label>
              <select
                name="key"
                value={customJsonData.key}
                onChange={handleCustomJsonChange}
              >
                <option value="Posting">Posting</option>
                <option value="Active">Active</option>
              </select>
            </div>
            <div>
              <label>Display Name:</label>
              <input
                type="text"
                name="displayName"
                value={customJsonData.displayName}
                onChange={handleCustomJsonChange}
              />
            </div>
            <div>
              <label>JSON:</label>
              <textarea
                name="json"
                value={customJsonData.json}
                onChange={handleCustomJsonChange}
                required
                rows="4"
                placeholder='{"sample": "data"}'
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Broadcast Custom JSON'}
            </button>
          </form>
        </div>
        
        <div className="transaction-section">
          <h3>Broadcast Any Operation</h3>
          <form onSubmit={handleBroadcast}>
            <div>
              <label>Key:</label>
              <select
                name="key"
                value={broadcastData.key}
                onChange={handleBroadcastChange}
              >
                <option value="Posting">Posting</option>
                <option value="Active">Active</option>
              </select>
            </div>
            <div>
              <label>Operations (JSON Array):</label>
              <textarea
                name="operations"
                value={broadcastData.operations}
                onChange={handleBroadcastChange}
                required
                rows="6"
                placeholder={`[
  ["vote", {
    "voter": "username",
    "author": "author",
    "permlink": "permlink",
    "weight": 10000
  }]
]`}
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Broadcast Operations'}
            </button>
          </form>
        </div>
      </div>
      
      {result && (
        <div className={`result ${result.success ? 'success' : 'error'}`}>
          <h3>Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default HiveTransactions;