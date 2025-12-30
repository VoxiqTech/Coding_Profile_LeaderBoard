import React, { useState, useEffect } from 'react';
import { Trophy, Award, Star, RefreshCw } from 'lucide-react';
import { LeaderboardHeader } from './LeaderboardHeader';
import { RegistrationForm } from './RegistrationForm';
import { LeaderboardTable } from './LeaderboardTable';
import { EditModal } from './EditModal';


// const API_BASE ="http://localhost:5000";
const API_BASE = import.meta.env.REACT_APP_API_BASE || "http://localhost:5000";

export default function CodingLeaderboard() {
  const [users, setUsers] = useState([]);
  const [sections, setSections] = useState([]);
  const [currentSection, setCurrentSection] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canRefresh, setCanRefresh] = useState(true);
  const [refreshStatus, setRefreshStatus] = useState(null);
  const [formData, setFormData] = useState({
    name: '', section: '', sectionSelect: '', leetcode: '', codeforces: '', password: ''
  });

  useEffect(() => {
    loadSections();
    loadLeaderboard('all');
    checkRefreshStatus();
  
    const interval = setInterval(checkRefreshStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const checkRefreshStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/leaderboard/refresh-status`);
      const data = await res.json();
      setCanRefresh(data.canRefresh);
      setRefreshStatus(data);
    } catch (err) {
      console.error("Failed to check refresh status:", err);
    }
  };

  const getRefreshMessage = () => {
    if (canRefresh) return "Refresh Leaderboard";
    
    if (refreshStatus?.timeRemaining) {
      const hours = Math.floor(refreshStatus.timeRemaining / (60 * 60 * 1000));
      const minutes = Math.floor((refreshStatus.timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
      return `Refreshed recently. Available in ${hours}h ${minutes}m`;
    }
    
    return "Refresh done today";
  };

  const handleRefresh = async () => {
    if (!canRefresh) return;
    
    setIsRefreshing(true);
    try {
      const res = await fetch(`${API_BASE}/api/leaderboard/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          alert(` Refresh is on cooldown!\n\nPlease wait ${data.hoursRemaining}h ${data.minutesRemaining}m before refreshing again.`);
          setCanRefresh(false);
          setRefreshStatus(data);
          return;
        }
        throw new Error(data.message || `Server error: ${res.status}`);
      }

      await loadLeaderboard(currentSection);
      setCanRefresh(false);
      setRefreshStatus(data);
      
      if (data.failed > 0) {
        alert(`Refresh partially completed!\nSuccess: ${data.success}\nFailed: ${data.failed}`);
      } else {
        alert(` Leaderboard refreshed successfully!\nUpdated ${data.success} users\n\nNext refresh available in 24 hours.`);
      }
    } catch (err) {
      console.error("Refresh error:", err);
      alert(` Refresh failed!\n\nError: ${err.message}`);
    } finally {
      setIsRefreshing(false);
    }
  };

  const loadSections = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/leaderboard/sections`);
      const data = await res.json();
      setSections(data);
    } catch (err) {
      console.error("Failed to load sections:", err);
    }
  };

  const loadLeaderboard = async (section = 'all') => {
    try {
      const url = section === 'all'
        ? `${API_BASE}/api/leaderboard`
        : `${API_BASE}/api/leaderboard?section=${section}`;
      const res = await fetch(url);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
    }
  };

  const handleSectionChange = (section) => {
    setCurrentSection(section);
    loadLeaderboard(section);
  };

  const handleSubmit = async () => {
    const section = formData.sectionSelect === 'other' ? formData.section : formData.sectionSelect;
    if (!section || !formData.password || (!formData.leetcode && !formData.codeforces && !formData.gfg)) {
      alert("Please fill in all required fields (Name, Section, Password, and at least one Username)");
      return;
    }

    const payload = {
      name: formData.name,
      section,
      password: formData.password,
      leetcodeUsername: formData.leetcode,
      codeforcesUsername: formData.codeforces,
      gfgUsername:formData.gfg
    };

    try {
      const res = await fetch(`${API_BASE}/api/users/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add user");

      alert("User added successfully!");
      setFormData({ name: '', section: '', sectionSelect: '', leetcode: '', codeforces: '', gfg:'', password: '' });
      setIsFormOpen(false);
      loadSections();
      loadLeaderboard(currentSection);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser({
      ...user,
      sectionSelect: ['1', '2', '3','4','5'].includes(user.section) ? user.section : 'other',
      password: ''
    });
  };

  const handleEditSave = async () => {
    const section = editingUser.sectionSelect === 'other' ? editingUser.section : editingUser.sectionSelect;
    const payload = {
      name: editingUser.name,
      section,
      password: editingUser.password,
      leetcodeUsername: editingUser.leetcode?.username,
      codeforcesUsername: editingUser.codeforces?.username,
      gfgUsername: editingUser.gfg?.username
    };

    try {
      const res = await fetch(`${API_BASE}/api/users/${editingUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      alert("Profile updated successfully!");
      setEditingUser(null);
      loadLeaderboard(currentSection);
    } catch (err) {
      alert(err.message);
    }
  };

  const getRankStyle = (index) => {
    if (index === 0) return 'from-yellow-400 to-orange-500 text-white shadow-yellow-200';
    if (index === 1) return 'from-slate-300 to-slate-500 text-white shadow-slate-200';
    if (index === 2) return 'from-amber-600 to-orange-700 text-white shadow-orange-200';
    return 'bg-slate-100 text-slate-600 border border-slate-200';
  };

  const getRankIcon = (index) => {
    if (index === 0) return <h1>1</h1>;
    if (index === 1) return <h1>2</h1>;
    if (index === 2) return <h1>3</h1>;
    return <span className="font-bold">{index + 1}</span>;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto relative z-10">
        <LeaderboardHeader isFormOpen={isFormOpen} setIsFormOpen={setIsFormOpen} />

        {isFormOpen && (
          <RegistrationForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} />
        )}

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || !canRefresh}
            className={`px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
              isRefreshing || !canRefresh
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
            }`}
            title={canRefresh ? "Click to refresh all user data" : getRefreshMessage()}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : getRefreshMessage()}
          </button>

          <button
            onClick={() => handleSectionChange('all')}
            className={`px-6 py-2 rounded-xl font-bold transition-all ${
              currentSection === 'all' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Users
          </button>
          {sections.map(s => (
            <button
              key={s}
              onClick={() => handleSectionChange(s)}
              className={`px-6 py-2 rounded-xl font-bold transition-all ${
                currentSection === s ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              Sec {s}
            </button>
          ))}
        </div>

        <LeaderboardTable
          users={users}
          onEditClick={handleEditClick}
          getRankStyle={getRankStyle}
          getRankIcon={getRankIcon}
        />
      </div>

      {editingUser && (
        <EditModal
          user={editingUser}
          setUser={setEditingUser}
          onSave={handleEditSave}
          onClose={() => setEditingUser(null)}
        />
      )}
    </div>
  );
}