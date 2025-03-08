// src/services/HiveBlockchainService.js

class HiveBlockchainService {
    constructor() {
      // Default Hive API nodes
      this.apiNodes = [
        'https://api.hive.blog',
        'https://api.openhive.network',
        'https://api.hive.blog'
      ];
      
      this.currentNodeIndex = 0;
      this.apiUrl = this.apiNodes[this.currentNodeIndex];
    }
  
    // Switch to next API node if current one fails
    switchNode() {
      this.currentNodeIndex = (this.currentNodeIndex + 1) % this.apiNodes.length;
      this.apiUrl = this.apiNodes[this.currentNodeIndex];
      console.log(`Switching to Hive API node: ${this.apiUrl}`);
      return this.apiUrl;
    }
  
    // Make API call with automatic node switching on failure
    async call(method, params) {
      const body = {
        jsonrpc: '2.0',
        method: method,
        params: params,
        id: Date.now()
      };
  
      let attempts = 0;
      const maxAttempts = this.apiNodes.length * 2; // Try each node twice at most
  
      while (attempts < maxAttempts) {
        try {
          const response = await fetch(this.apiUrl, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
              'Content-Type': 'application/json'
            }
          });
  
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
  
          const data = await response.json();
          
          if (data.error) {
            console.error('API error:', data.error);
            throw new Error(data.error.message || 'Unknown API error');
          }
          
          return data.result;
        } catch (error) {
          console.error(`Error with node ${this.apiUrl}:`, error);
          attempts++;
          this.switchNode();
        }
      }
  
      throw new Error('Failed to connect to any Hive API node');
    }
  
    // Get account information
    async getAccount(username) {
      try {
        const accounts = await this.call('condenser_api.get_accounts', [[username]]);
        return accounts && accounts.length > 0 ? accounts[0] : null;
      } catch (error) {
        console.error('Error fetching account:', error);
        throw error;
      }
    }
  
    // Get account history
    async getAccountHistory(username, from = -1, limit = 100) {
      try {
        return await this.call('condenser_api.get_account_history', [username, from, limit]);
      } catch (error) {
        console.error('Error fetching account history:', error);
        throw error;
      }
    }
  
    // Get content (post or comment)
    async getContent(author, permlink) {
      try {
        return await this.call('condenser_api.get_content', [author, permlink]);
      } catch (error) {
        console.error('Error fetching content:', error);
        throw error;
      }
    }
  
    // Get content replies
    async getContentReplies(author, permlink) {
      try {
        return await this.call('condenser_api.get_content_replies', [author, permlink]);
      } catch (error) {
        console.error('Error fetching content replies:', error);
        throw error;
      }
    }
  
    // Get discussions by trending, created, hot, etc.
    async getDiscussions(by, query) {
      try {
        return await this.call(`condenser_api.get_discussions_by_${by}`, [query]);
      } catch (error) {
        console.error(`Error fetching discussions by ${by}:`, error);
        throw error;
      }
    }
  
    // Get blog posts of a user
    async getBlogEntries(username, startIndex = 0, limit = 10) {
      try {
        return await this.call('condenser_api.get_blog_entries', [username, startIndex, limit]);
      } catch (error) {
        console.error('Error fetching blog entries:', error);
        throw error;
      }
    }
  
    // Get blog posts with content
    async getBlog(username, startIndex = 0, limit = 10) {
      try {
        return await this.call('condenser_api.get_blog', [username, startIndex, limit]);
      } catch (error) {
        console.error('Error fetching blog:', error);
        throw error;
      }
    }
  
    // Get blockchain dynamic global properties
    async getDynamicGlobalProperties() {
      try {
        return await this.call('condenser_api.get_dynamic_global_properties', []);
      } catch (error) {
        console.error('Error fetching global properties:', error);
        throw error;
      }
    }
  
    // Get follow count
    async getFollowCount(username) {
      try {
        return await this.call('condenser_api.get_follow_count', [username]);
      } catch (error) {
        console.error('Error fetching follow count:', error);
        throw error;
      }
    }
  
    // Get followers
    async getFollowers(username, startFollower = '', followType = 'blog', limit = 100) {
      try {
        return await this.call('condenser_api.get_followers', [username, startFollower, followType, limit]);
      } catch (error) {
        console.error('Error fetching followers:', error);
        throw error;
      }
    }
  
    // Get following
    async getFollowing(username, startFollowing = '', followType = 'blog', limit = 100) {
      try {
        return await this.call('condenser_api.get_following', [username, startFollowing, followType, limit]);
      } catch (error) {
        console.error('Error fetching following:', error);
        throw error;
      }
    }
  
    // Get witness by account
    async getWitnessByAccount(accountName) {
      try {
        return await this.call('condenser_api.get_witness_by_account', [accountName]);
      } catch (error) {
        console.error('Error fetching witness information:', error);
        throw error;
      }
    }
  
    // Get conversion requests
    async getConversionRequests(accountName) {
      try {
        return await this.call('condenser_api.get_conversion_requests', [accountName]);
      } catch (error) {
        console.error('Error fetching conversion requests:', error);
        throw error;
      }
    }
  
    // Get reward fund
    async getRewardFund(name = 'post') {
      try {
        return await this.call('condenser_api.get_reward_fund', [name]);
      } catch (error) {
        console.error('Error fetching reward fund:', error);
        throw error;
      }
    }
  
    // Get current median history price
    async getCurrentMedianHistoryPrice() {
      try {
        return await this.call('condenser_api.get_current_median_history_price', []);
      } catch (error) {
        console.error('Error fetching median history price:', error);
        throw error;
      }
    }
  }
  
  export default new HiveBlockchainService();