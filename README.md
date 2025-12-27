# 🏆 Coding Profile LeaderBoard

A dynamic leaderboard system that ranks users based on their performance across multiple competitive coding platforms including LeetCode, Codeforces, and more.

Live Demo : https://coding-profile-leaderboard.netlify.app/
## 📋 Overview

This project provides a comprehensive leaderboard that aggregates and ranks users based on their profiles from various coding platforms. It automatically fetches and updates user statistics to maintain an up-to-date ranking system.

## ✨ Features

- 📊 **Multi-Platform Integration**: Aggregates data from LeetCode, Codeforces, and other competitive coding platforms
- 🔄 **Automatic Updates**: Scheduled cron jobs to keep user statistics current
- 🎯 **Real-time Leaderboard**: Dynamic ranking based on user performance metrics
- 🌐 **RESTful API**: Clean API endpoints for leaderboard and user management
- 💾 **MongoDB Integration**: Persistent data storage for user profiles and statistics
- 🎨 **Modern Frontend**: Responsive UI built with React
- 🚀 **Deployed & Live**: Backend and frontend deployed separately for optimal performance

## 🛠️ Tech Stack

### Backend
- **Node.js** with **Express.js** - Server framework
- **MongoDB** with **Mongoose** - Database and ODM
- **Axios** - HTTP client for API requests
- **node-cron** - Automated task scheduling
- **dotenv** - Environment configuration
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **JavaScript** - Primary language
- **Netlify** - Frontend hosting

### Backend Hosting
- **MongoDB Atlas** - Database hosting
- **Express Server** - Backend deployment

## 📁 Project Structure

```
Coding_Profile_LeaderBoard/
├── leaderboard-backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── leaderboard. routes.js
│   │   │   └── addUser.routes.js
│   │   ├── controllers/
│   │   ├── models/
│   │   └── utils/
│   │       └── cron_update.utils. js
│   ├── server.js
│   ├── package.json
│   └── .env
└── leaderboard-frontend/
    ├── src/
    ├── public/
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Divyansh-132006/Coding_Profile_LeaderBoard.git
   cd Coding_Profile_LeaderBoard/leaderboard-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the backend directory: 
   ```env
   PORT=5000
   MONGO_DB_ANTARA_AI=your_mongodb_connection_string
   ```

4. **Run the backend server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

   The server will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../leaderboard-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the frontend**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173` (or the port shown in terminal)

## 📡 API Endpoints

### Leaderboard Routes
- `GET /api/leaderboard` - Fetch current leaderboard rankings
- Additional leaderboard endpoints available

### User Routes
- `POST /api/users` - Add a new user
- `GET /api/users` - Get all users
- Additional user management endpoints

## 🔄 Automated Updates

The system uses **node-cron** to automatically fetch and update user statistics from various coding platforms at scheduled intervals, ensuring the leaderboard stays current without manual intervention.

## 🌐 Live Demo

Check out the live application:  [Coding Profile LeaderBoard](https://coding-profile-leaderboard.netlify. app)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Future Enhancements

- [ ] Add support for more coding platforms (HackerRank, CodeChef, etc.)
- [ ] Implement user authentication
- [ ] Add detailed user profile pages
- [ ] Include performance graphs and analytics
- [ ] Add filtering and search functionality
- [ ] Implement real-time updates using WebSockets

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Divyansh**
- GitHub: [@Divyansh-132006](https://github.com/Divyansh-132006)

## 🙏 Acknowledgments

- Thanks to the APIs provided by various competitive coding platforms
- Inspired by the competitive programming community

---

⭐ Star this repository if you find it helpful! 
```
