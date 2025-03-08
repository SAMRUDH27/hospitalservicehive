// src/components/HiveBlockchainReader.js

import React, { useState, useEffect } from 'react';
import HiveBlockchainService from '../services/HiveBlockchainService';
import { useHiveAuth } from '../contexts/HiveAuthContext';

const HiveBlockchainReader = () => {
  const { isAuthenticated, user } = useHiveAuth();
  const [dataType, setDataType] = useState('account');
  const [username, setUsername] = useState('');
  const [permlink, setPermlink] = useState('');
  const [limit, setLimit] = useState(10);
  const [tag, setTag] = useState('hive');
  const [sortBy, setSortBy] = useState('trending');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Set the username to the logged-in user's username when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setUsername(user.username);
    }
  }, [isAuthenticated, user]);

  // Function to fetch data based on the selected type
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      let result;

      switch (dataType) {
        case 'account':
          if (!username) {
            throw new Error('Username is required');
          }
          result = await HiveBlockchainService.getAccount(username);
          break;

        case 'accountHistory':
          if (!username) {
            throw new Error('Username is required');
          }
          result = await HiveBlockchainService.getAccountHistory(username, -1, limit);
          break;

        case 'content':
          if (!username || !permlink) {
            throw new Error('Both author and permlink are required');
          }
          result = await HiveBlockchainService.getContent(username, permlink);
          break;

        case 'replies':
          if (!username || !permlink) {
            throw new Error('Both author and permlink are required');
          }
          result = await HiveBlockchainService.getContentReplies(username, permlink);
          break;

        case 'discussions':
          result = await HiveBlockchainService.getDiscussions(sortBy, { tag, limit });
          break;

        case 'blog':
          if (!username) {
            throw new Error('Username is required');
          }
          result = await HiveBlockchainService.getBlog(username, 0, limit);
          break;

        case 'globalProperties':
          result = await HiveBlockchainService.getDynamicGlobalProperties();
          break;

        case 'followCount':
          if (!username) {
            throw new Error('Username is required');
          }
          result = await HiveBlockchainService.getFollowCount(username);
          break;

        case 'followers':
          if (!username) {
            throw new Error('Username is required');
          }
          result = await HiveBlockchainService.getFollowers(username, '', 'blog', limit);
          break;

        case 'following':
          if (!username) {
            throw new Error('Username is required');
          }
          result = await HiveBlockchainService.getFollowing(username, '', 'blog', limit);
          break;

        case 'witness':
          if (!username) {
            throw new Error('Username is required');
          }
          result = await HiveBlockchainService.getWitnessByAccount(username);
          break;

        case 'priceHistory':
          result = await HiveBlockchainService.getCurrentMedianHistoryPrice();
          break;

        case 'rewardFund':
          result = await HiveBlockchainService.getRewardFund();
          break;

        default:
          throw new Error('Unknown data type');
      }

      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
      console.error('Error fetching blockchain data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle data type change
  const handleDataTypeChange = (e) => {
    setDataType(e.target.value);
    setData(null);
    setError(null);
  };

  return (
    <div className="blockchain-reader-container">
      <h2>Hive Blockchain Data Reader</h2>

      <div className="reader-controls">
        <div className="control-section">
          <label htmlFor="dataType">Select Data Type:</label>
          <select
            id="dataType"
            value={dataType}
            onChange={handleDataTypeChange}
            className="select-input"
          >
            <option value="account">Account Information</option>
            <option value="accountHistory">Account History</option>
            <option value="content">Post/Comment Content</option>
            <option value="replies">Content Replies</option>
            <option value="discussions">Discussions/Posts</option>
            <option value="blog">Blog Entries</option>
            <option value="globalProperties">Blockchain Properties</option>
            <option value="followCount">Follow Count</option>
            <option value="followers">Followers List</option>
            <option value="following">Following List</option>
            <option value="witness">Witness Info</option>
            <option value="priceHistory">Price Feed</option>
            <option value="rewardFund">Reward Fund</option>
          </select>
        </div>

        {['account', 'accountHistory', 'content', 'replies', 'blog', 'followCount', 'followers', 'following', 'witness'].includes(dataType) && (
          <div className="control-section">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Hive username"
              className="text-input"
            />
          </div>
        )}

        {['content', 'replies'].includes(dataType) && (
          <div className="control-section">
            <label htmlFor="permlink">Permlink:</label>
            <input
              id="permlink"
              type="text"
              value={permlink}
              onChange={(e) => setPermlink(e.target.value)}
              placeholder="Enter post permlink"
              className="text-input"
            />
          </div>
        )}

        {['accountHistory', 'discussions', 'blog', 'followers', 'following'].includes(dataType) && (
          <div className="control-section">
            <label htmlFor="limit">Limit:</label>
            <input
              id="limit"
              type="number"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              min="1"
              max="100"
              className="number-input"
            />
          </div>
        )}

        {dataType === 'discussions' && (
          <>
            <div className="control-section">
              <label htmlFor="tag">Tag:</label>
              <input
                id="tag"
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Enter tag"
                className="text-input"
              />
            </div>
            <div className="control-section">
              <label htmlFor="sortBy">Sort By:</label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="select-input"
              >
                <option value="trending">Trending</option>
                <option value="created">New</option>
                <option value="hot">Hot</option>
                <option value="promoted">Promoted</option>
                <option value="payout">Payout</option>
              </select>
            </div>
          </>
        )}

        <button onClick={fetchData} disabled={loading} className="fetch-button">
          {loading ? 'Loading...' : 'Fetch Data'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {data && (
        <div className="data-result">
          <h3>Result:</h3>
          <div className="json-viewer">
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default HiveBlockchainReader;