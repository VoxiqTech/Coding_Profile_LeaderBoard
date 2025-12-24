import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import CodingLeaderboard from './pages/leadervoard.jsx'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/leaderboard" element={<CodingLeaderboard />} />
      </Routes>
    </Router>
  );
}

export default App;