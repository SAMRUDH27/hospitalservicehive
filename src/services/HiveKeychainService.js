// src/services/HiveKeychainService.js

class HiveKeychainService {
    constructor() {
      this.isKeychainAvailable = false;
      this.checkKeychainAvailability();
    }
  
    checkKeychainAvailability() {
      if (window.hive_keychain) {
        this.isKeychainAvailable = true;
        return true;
      }
      this.isKeychainAvailable = false;
      return false;
    }
  
    isKeychainInstalled() {
      return this.isKeychainAvailable;
    }
  
    async authenticate(username) {
      if (!this.isKeychainAvailable) {
        return { success: false, message: 'Hive Keychain extension is not installed' };
      }
  
      if (!username) {
        return { success: false, message: 'Please enter a Hive username' };
      }
  
      // Create a random memo for authentication
      const memo = `Auth-${Math.floor(Math.random() * 1000000000)}`;
      
      // Return a promise for better async handling
      return new Promise((resolve) => {
        window.hive_keychain.requestSignBuffer(
          username,
          memo,
          'Posting',
          (response) => {
            console.log('Keychain auth response:', response);
            
            if (response.success) {
              // In a real application, you would verify this signature
              resolve({ 
                success: true, 
                message: 'Successfully authenticated',
                username,
                memo,
                result: response
              });
            } else {
              let message = 'Authentication failed';
              if (response.error === 'user_cancel') {
                message = 'Authentication cancelled by user';
              } else if (response.message) {
                message = response.message;
              }
              resolve({ success: false, message });
            }
          }
        );
      });
    }
  
    async transfer(from, to, amount, memo, currency = 'HIVE') {
      if (!this.isKeychainAvailable) {
        return { success: false, message: 'Hive Keychain extension is not installed' };
      }
  
      return new Promise((resolve) => {
        window.hive_keychain.requestTransfer(
          from,
          to,
          amount,
          memo,
          currency,
          (response) => {
            console.log('Transfer response:', response);
            resolve(response);
          }
        );
      });
    }
  
    async broadcastTransaction(username, operations, key = 'Active') {
      if (!this.isKeychainAvailable) {
        return { success: false, message: 'Hive Keychain extension is not installed' };
      }
  
      return new Promise((resolve) => {
        window.hive_keychain.requestBroadcast(
          username,
          operations,
          key,
          (response) => {
            console.log('Broadcast response:', response);
            resolve(response);
          }
        );
      });
    }
  
    async customJson(username, id, key, json, display_name) {
      if (!this.isKeychainAvailable) {
        return { success: false, message: 'Hive Keychain extension is not installed' };
      }
  
      return new Promise((resolve) => {
        window.hive_keychain.requestCustomJson(
          username,
          id,
          key,
          json,
          display_name,
          (response) => {
            console.log('Custom JSON response:', response);
            resolve(response);
          }
        );
      });
    }
  
    async vote(username, permlink, author, weight) {
      if (!this.isKeychainAvailable) {
        return { success: false, message: 'Hive Keychain extension is not installed' };
      }
  
      return new Promise((resolve) => {
        window.hive_keychain.requestVote(
          username,
          permlink,
          author,
          weight,
          (response) => {
            console.log('Vote response:', response);
            resolve(response);
          }
        );
      });
    }
  
    async post(username, title, body, parentPermlink, parentAuthor, jsonMetadata, permlink, options) {
      if (!this.isKeychainAvailable) {
        return { success: false, message: 'Hive Keychain extension is not installed' };
      }
  
      return new Promise((resolve) => {
        window.hive_keychain.requestPost(
          username,
          title,
          body,
          parentPermlink,
          parentAuthor,
          jsonMetadata,
          permlink,
          options,
          (response) => {
            console.log('Post response:', response);
            resolve(response);
          }
        );
      });
    }
  }
  
  export default new HiveKeychainService();