# Hospital Services Blockchain Platform

A decentralized platform for hospital services built with React and integrated with the Hive blockchain. This application allows users to access healthcare news, support healthcare initiatives through transparent donations, and participate in community updates.

![image](https://github.com/user-attachments/assets/c1d382df-0761-47b8-a686-79472c27dc49)
![image](https://github.com/user-attachments/assets/13a9432d-107e-4b07-a3ec-2ec6f26df94c)


## 🌟 Features

- *Hive Blockchain Integration*: Secure authentication using Hive Keychain
- *News Feed*: Browse and interact with healthcare-related posts from the Hive blockchain
- *Content Creation*: Create and publish healthcare content directly to the Hive blockchain
- *Transparent Donations*: Make blockchain-based donations to various hospital initiatives
- *User Profile*: View and interact with user posts and activities
- *Real-time Voting*: Upvote valuable content using Hive's voting mechanism
- *Progress Tracking*: Track donation goals with visual progress indicators

## 🚀 Technologies Used

- *Frontend*: React.js with React Router for navigation
- *Blockchain*: Hive blockchain for authentication, transactions, and content storage
- *Authentication*: Hive Keychain browser extension
- *State Management*: React Context API
- *Styling*: Inline CSS with responsive design patterns
- *Notifications*: React Hot Toast for user notifications

## 🔧 Prerequisites

To run this application, you need:

- Node.js (v14 or higher)
- Hive Keychain browser extension installed
- A Hive blockchain account

## 📦 Installation

1. Clone the repository:
   bash
   https://github.com/SAMRUDH27/Hive-Hospital-Service.git
   cd hospital-services
   

2. Install dependencies:
   bash
   npm install
   

3. Start the development server:
   bash
   npm start
   

4. Open your browser and navigate to http://localhost:3000

## 💻 Component Structure

The application is structured with the following main components:

- *Home.js*: Landing page with service overviews and call-to-action
- *Login.js*: Hive Keychain authentication integration
- *News.js*: Browse and interact with Hive blockchain content
- *CreatePost.js*: Create and publish content to the Hive blockchain
- *Donate.js*: Make transparent donations to healthcare initiatives

## 🔐 Authentication

This application uses the Hive Keychain browser extension for secure authentication:

1. Install the [Hive Keychain extension](https://chrome.google.com/webstore/detail/hive-keychain/jcacnejopjdphbnjgfaaobbfafkihpep)
2. Enter your Hive username in the login screen
3. Approve the authentication request in the Keychain popup

## 💰 Donation System

The platform features a transparent donation system with:

- Multiple donation initiatives with specific goals
- Real-time progress tracking
- Direct Hive token transfers to initiative accounts
- Optional memo messages with donations

## 📝 Content Creation

Users can create healthcare-related content with:

- Markdown formatting support
- Automatic tagging with 'hospital-services'
- Custom tags for better content discovery
- Direct publishing to the Hive blockchain

## 📱 Responsive Design

The application is designed to work seamlessly across devices:

- Responsive grid layouts
- Mobile-friendly components
- Adaptive UI elements

## 🔄 Context API Integration

The application uses React's Context API for blockchain interactions:

- HiveContext provides authentication, transaction, and content methods
- Consistent blockchain state across the application
- Simplified blockchain interactions through custom hooks

## 🚧 Future Improvements

- [ ] Add multi-language support
- [ ] Implement advanced content filtering
- [ ] Create a dashboard for donation tracking
- [ ] Add direct messaging between users
- [ ] Integrate more blockchain features like delegations

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Hive Blockchain](https://hive.io/) for the decentralized content and value transfer
- [Hive Keychain](https://hive-keychain.com/) for secure authentication
- [React](https://reactjs.org/) for the frontend framework
- [Unsplash](https://unsplash.com/) for the images used in the application
