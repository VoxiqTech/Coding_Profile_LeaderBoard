import React, { useState, useEffect } from 'react';
import { Trophy, Award, Star } from 'lucide-react';
import { LeaderboardHeader } from './LeaderboardHeader';
import { RegistrationForm } from './RegistrationForm';
import { LeaderboardTable } from './LeaderboardTable';
import { EditModal } from './EditModal';

const API_BASE = "http://localhost:5000";

export default function CodingLeaderboard() {
  const [users, setUsers] = useState([]);
  const [sections, setSections] = useState([]);
  const [currentSection, setCurrentSection] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', section: '', sectionSelect: '', leetcode: '', codeforces: '', password: '' 
  });

  useEffect(() => {
    loadSections();
    loadLeaderboard('all');
  }, []);

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
    if (!section || !formData.password || (!formData.leetcode && !formData.codeforces)) {
      alert("Please fill in all required fields (Name, Section, Password, and at least one Username)");
      return;
    }

    const payload = { 
      name: formData.name, 
      section, 
      password: formData.password,
      leetcodeUsername: formData.leetcode,
      codeforcesUsername: formData.codeforces
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
      setFormData({ name: '', section: '', sectionSelect: '', leetcode: '', codeforces: '', password: '' });
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
      sectionSelect: ['1', '2', '3'].includes(user.section) ? user.section : 'other',
      password: '' // Reset password field for security
    });
  };

  const handleEditSave = async () => {
    const section = editingUser.sectionSelect === 'other' ? editingUser.section : editingUser.sectionSelect;
    const payload = {
      name: editingUser.name,
      section,
      password: editingUser.password,
      leetcodeUsername: editingUser.leetcode?.username,
      codeforcesUsername: editingUser.codeforces?.username
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
    if (index === 0) return <Trophy className="w-5 h-5" />;
    if (index === 1) return <Award className="w-5 h-5" />;
    if (index === 2) return <Star className="w-5 h-5" />;
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
            onClick={() => handleSectionChange('all')} 
            className={`px-6 py-2 rounded-xl font-bold transition-all ${currentSection === 'all' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
          >
            All Users
          </button>
          {sections.map(s => (
            <button 
              key={s} 
              onClick={() => handleSectionChange(s)} 
              className={`px-6 py-2 rounded-xl font-bold transition-all ${currentSection === s ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
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