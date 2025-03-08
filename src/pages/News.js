import React, { useState, useEffect } from 'react';
import { useHive } from '../contexts/HiveContext';
import toast from 'react-hot-toast';

const newsStyles = {
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '2rem 1rem'
  },
  header: {
    marginBottom: '2rem',
    textAlign: 'center'
  },
  title: {
    fontSize: '2.25rem',
    fontWeight: '800',
    color: '#111827',
    marginBottom: '1rem'
  },
  subtitle: {
    fontSize: '1.125rem',
    color: '#6b7280'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem',
    marginTop: '2rem'
  },
  post: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer'
  },
  postImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
  },
  postContent: {
    padding: '1.5rem'
  },
  postTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '0.5rem',
    lineHeight: '1.4'
  },
  postMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '1rem'
  },
  postExcerpt: {
    color: '#374151',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    marginBottom: '1rem',
    display: '-webkit-box',
    WebkitLineClamp: '3',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  postFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 1.5rem',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb'
  },
  voteButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'background-color 0.2s'
  },
  voteCount: {
    fontSize: '0.875rem',
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  filterBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  sortSelect: {
    padding: '0.5rem',
    borderRadius: '0.375rem',
    border: '1px solid #d1d5db',
    backgroundColor: 'white',
    fontSize: '0.875rem',
    color: '#374151'
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    color: '#6b7280'
  },
  error: {
    textAlign: 'center',
    padding: '2rem',
    color: '#ef4444',
    backgroundColor: '#fee2e2',
    borderRadius: '0.5rem',
    marginBottom: '1rem'
  },
  message: {
    textAlign: 'center',
    padding: '2rem',
    color: '#6b7280'
  },
  retryButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    marginTop: '1rem'
  },
  searchForm: {
    marginBottom: '2rem',
    display: 'flex',
    justifyContent: 'center'
  },
  searchInput: {
    padding: '0.75rem',
    borderRadius: '0.375rem 0 0 0.375rem',
    border: '1px solid #d1d5db',
    borderRight: 'none',
    fontSize: '0.875rem',
    width: '100%',
    maxWidth: '400px'
  },
  searchButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '0 0.375rem 0.375rem 0',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500'
  }
};

function UserPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('created');
  const { client, username } = useHive();
  const [retryCount, setRetryCount] = useState(0);
  const [inputUsername, setInputUsername] = useState('esancsy');
  const [targetUsername, setTargetUsername] = useState('esancsy'); // Default to esancsy

  // Check if Hive Keychain is available
  const [keychainAvailable, setKeychainAvailable] = useState(false);

  useEffect(() => {
    // Check for Hive Keychain
    const checkKeychain = () => {
      if (window.hive_keychain) {
        console.log("Hive Keychain detected");
        setKeychainAvailable(true);
      } else {
        console.log("Hive Keychain not detected");
        // Check again after a short delay (keychain might load after page)
        setTimeout(() => {
          if (window.hive_keychain) {
            setKeychainAvailable(true);
          }
        }, 1000);
      }
    };
    
    checkKeychain();
  }, []);

  useEffect(() => {
    fetchUserPosts();
  }, [targetUsername, sortBy, retryCount]);

  // Function to vote using Hive Keychain
  const handleVote = async (author, permlink) => {
    if (!username) {
      toast.error('Please login to vote');
      return;
    }

    if (!window.hive_keychain) {
      toast.error('Hive Keychain extension not found');
      return;
    }

    try {
      // Use Hive Keychain for voting
      window.hive_keychain.requestVote(
        username,
        permlink,
        author,
        10000, // 100% upvote
        function(response) {
          if (response.success) {
            toast.success('Vote successful!');
            // Refresh posts to update vote count
            setTimeout(() => fetchUserPosts(), 3000);
          } else {
            toast.error('Failed to vote: ' + response.message);
          }
        }
      );
    } catch (error) {
      toast.error('Failed to vote: ' + error.message);
    }
  };

  const fetchUserPosts = async () => {
    try {
      // Make sure we have a valid username
      if (!targetUsername || targetUsername.trim() === '' || targetUsername === '@') {
        setError('Please enter a valid Hive username');
        setPosts([]);
        setLoading(false);
        return;
      }

      // Remove @ if it was included
      const cleanUsername = targetUsername.startsWith('@') 
        ? targetUsername.substring(1) 
        : targetUsername;
      
      setLoading(true);
      setError(null);

      console.log(`Fetching posts for user: ${cleanUsername}`);
      
      // Use the appropriate Hive API method to get user posts
      const userPosts = await client.database.getDiscussions('blog', {
        tag: cleanUsername, // Use the clean username without @
        limit: 20 // Adjust limit as needed
      });
      
      if (!userPosts || !Array.isArray(userPosts) || userPosts.length === 0) {
        setError(`No posts found for user @${cleanUsername}`);
        setPosts([]);
        return;
      }

      console.log(`Found ${userPosts.length} posts for @${cleanUsername}`);

      // Filter out any reblogged posts (optional - remove if you want to include reblogged content)
      const originalPosts = userPosts.filter(post => post.author === cleanUsername);
      
      // Sort posts based on selected criteria
      let sortedPosts = [...originalPosts];
      switch (sortBy) {
        case 'payout':
          sortedPosts.sort((a, b) => {
            const aValue = parseFloat(a.pending_payout_value.split(' ')[0]);
            const bValue = parseFloat(b.pending_payout_value.split(' ')[0]);
            return bValue - aValue;
          });
          break;
        case 'created':
          sortedPosts.sort((a, b) => 
            new Date(b.created) - new Date(a.created)
          );
          break;
        case 'votes':
          sortedPosts.sort((a, b) => b.net_votes - a.net_votes);
          break;
      }

      setPosts(sortedPosts);
      
    } catch (err) {
      console.error('Error fetching user posts:', err);
      setError(`Failed to fetch posts for @${targetUsername}: ${err.message}. Please try again.`);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const getPostImage = (post) => {
    try {
      // Try to get image from json_metadata
      const jsonMetadata = JSON.parse(post.json_metadata);
      if (jsonMetadata.image && jsonMetadata.image[0]) {
        return jsonMetadata.image[0];
      }
      
      // Try to extract first image from post body
      const imageMatch = post.body.match(/!\[.*?\]\((.*?)\)/);
      if (imageMatch) return imageMatch[1];
      
      // Try to find any img tags
      const imgTagMatch = post.body.match(/<img.*?src=["'](.*?)["']/);
      if (imgTagMatch) return imgTagMatch[1];
      
      return null;
    } catch {
      return null;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleRetry = () => {
    setRetryCount(prevCount => prevCount + 1);
  };

  const handleUsernameChange = (e) => {
    setInputUsername(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Update targetUsername which will trigger the fetch
    setTargetUsername(inputUsername);
  };

  if (loading) {
    return (
      <div style={newsStyles.container}>
        <div style={newsStyles.loading}>Loading posts from @{targetUsername}...</div>
      </div>
    );
  }

  return (
    <div style={newsStyles.container}>
      <div style={newsStyles.header}>
        <h1 style={newsStyles.title}>Hive User Posts</h1>
        <p style={newsStyles.subtitle}>
          Viewing posts from @{targetUsername.startsWith('@') ? targetUsername.substring(1) : targetUsername}
        </p>
      </div>

      <form onSubmit={handleSearch} style={newsStyles.searchForm}>
        <input
          type="text"
          value={inputUsername}
          onChange={handleUsernameChange}
          placeholder="Enter Hive username"
          style={newsStyles.searchInput}
        />
        <button
          type="submit"
          style={newsStyles.searchButton}
        >
          Search
        </button>
      </form>

      <div style={newsStyles.filterBar}>
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={newsStyles.sortSelect}
        >
          <option value="created">Most Recent</option>
          <option value="votes">Most Voted</option>
          <option value="payout">Highest Payout</option>
        </select>
      </div>

      {error && (
        <div style={newsStyles.error}>
          {error}
          <div>
            <button onClick={handleRetry} style={newsStyles.retryButton}>
              Retry
            </button>
          </div>
        </div>
      )}

      {posts.length === 0 && !error ? (
        <div style={newsStyles.message}>
          No posts found for @{targetUsername.startsWith('@') ? targetUsername.substring(1) : targetUsername}. Try changing the username or check your network connection.
          <div>
            <button onClick={handleRetry} style={newsStyles.retryButton}>
              Retry
            </button>
          </div>
        </div>
      ) : (
        <div style={newsStyles.grid}>
          {posts.map((post) => {
            const image = getPostImage(post);
            return (
              <div 
                key={`${post.author}-${post.permlink}`} 
                style={newsStyles.post}
              >
                {image && (
                  <img
                    src={image}
                    alt={post.title}
                    style={newsStyles.postImage}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
                <div style={newsStyles.postContent}>
                  <h2 style={newsStyles.postTitle}>{post.title}</h2>
                  <div style={newsStyles.postMeta}>
                    <span>@{post.author}</span>
                    <span>•</span>
                    <span>{formatDate(post.created)}</span>
                  </div>
                  <p style={newsStyles.postExcerpt}>
                    {post.body
                      .replace(/!\[.*?\]\(.*?\)/g, '')
                      .replace(/<[^>]*>/g, '')
                      .substring(0, 150)}...
                  </p>
                </div>
                <div style={newsStyles.postFooter}>
                  <button
                    style={{
                      ...newsStyles.voteButton,
                      backgroundColor: keychainAvailable ? '#2563eb' : '#93c5fd',
                      cursor: keychainAvailable ? 'pointer' : 'not-allowed'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (keychainAvailable) {
                        handleVote(post.author, post.permlink);
                      } else {
                        toast.error('Hive Keychain not available');
                      }
                    }}
                    disabled={!keychainAvailable}
                  >
                    <span>👍</span>
                    <span>Vote</span>
                  </button>
                  <div style={newsStyles.voteCount}>
                    <span>💰 {post.pending_payout_value}</span>
                    <span>•</span>
                    <span>👥 {post.net_votes}</span>
                  </div>
                </div>
                <a
                  href={`https://hive.blog/@${post.author}/${post.permlink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '0.75rem',
                    backgroundColor: '#f3f4f6',
                    textDecoration: 'none',
                    color: '#4b5563',
                    borderTop: '1px solid #e5e7eb',
                    fontSize: '0.875rem'
                  }}
                >
                  View on Hive Blog
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default UserPosts;