import React, { useState, useEffect } from 'react';
import { Trophy, Code2, Award, Users, TrendingUp, Star, Github, ChevronRight, ExternalLink, Edit2, X, Save } from 'lucide-react';

// const API_BASE = "http://localhost:5000";
const API_BASE = "https://coding-profile-leaderboard.onrender.com";

export default function CodingLeaderboard() {
    const [users, setUsers] = useState([]);
    const [sections, setSections] = useState([]);
    const [currentSection, setCurrentSection] = useState('all');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        section: '',
        sectionSelect: '',
        leetcode: '',
        codeforces: ''
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

        if (!section) {
            alert("Please select or enter a section");
            return;
        }

        const payload = { name: formData.name, section };

        if (formData.leetcode) payload.leetcodeUsername = formData.leetcode;
        if (formData.codeforces) payload.codeforcesUsername = formData.codeforces;

        if (!payload.leetcodeUsername && !payload.codeforcesUsername) {
            alert("Enter at least one platform username");
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/api/users/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Failed to add user");
                return;
            }

            alert("User added successfully!");
            setFormData({ name: '', section: '', sectionSelect: '', leetcode: '', codeforces: '' });
            setIsFormOpen(false);
            loadSections();
            loadLeaderboard(currentSection);
        } catch (err) {
            alert("Server error");
        }
    };

    const handleEditClick = (user) => {
        setEditingUser({
            ...user,
            originalSection: user.section,
            sectionSelect: ['1', '2', '3'].includes(user.section) ? user.section : 'other'
        });
    };

    const handleEditSave = async () => {
        const section = editingUser.sectionSelect === 'other' ? editingUser.section : editingUser.sectionSelect;

        if (!section) {
            alert("Please select or enter a section");
            return;
        }

        const payload = {
            name: editingUser.name,
            section
        };

        if (editingUser.leetcode?.username) payload.leetcodeUsername = editingUser.leetcode.username;
        if (editingUser.codeforces?.username) payload.codeforcesUsername = editingUser.codeforces.username;

        if (!payload.leetcodeUsername && !payload.codeforcesUsername) {
            alert("At least one platform username is required");
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/api/users/${editingUser._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const data = await res.json();
                alert(data.message || "Failed to update user");
                return;
            }

            alert("Data Updated!");
            setEditingUser(null);
            loadLeaderboard(currentSection);
        } catch (err) {
            alert("Server error");
        }
    };

    const getRankStyle = (index) => {
        switch (index) {
            case 0: return 'from-yellow-400 to-orange-500 text-white shadow-yellow-200';
            case 1: return 'from-slate-300 to-slate-500 text-white shadow-slate-200';
            case 2: return 'from-amber-600 to-orange-700 text-white shadow-orange-200';
            default: return 'bg-slate-100 text-slate-600 shadow-none border border-slate-200';
        }
    };

    const getRankIcon = (index) => {
        if (index === 0) return <Trophy className="w-5 h-5" />;
        if (index === 1) return <Award className="w-5 h-5" />;
        if (index === 2) return <Star className="w-5 h-5" />;
        return <span className="font-bold">{index + 1}</span>;
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 font-sans">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse delay-700"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Code2 className="w-12 h-12 text-indigo-600" />
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">
                            Coding <span className="text-indigo-600">Leaderboard</span>
                        </h1>
                    </div>
                    <p className="text-slate-600 text-lg font-medium">Elevate your competitive programming game</p>
                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white shadow-sm border border-slate-200 rounded-full">
                        <TrendingUp className="w-4 h-4 text-indigo-500" />
                        <span className="text-sm font-semibold text-slate-600">Board-Update every 24 hours</span>
                    </div>
                </div>

                <div className="flex justify-center mb-8">
                    <button
                        onClick={() => setIsFormOpen(!isFormOpen)}
                        className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                    >
                        {isFormOpen ? 'Hame nahi Matlab-Banda Kar do Form' : 'Apna Level Jano -Join Karo'}
                    </button>
                </div>

                {isFormOpen && (
                    <div className="mb-8 bg-white border border-slate-200 rounded-3xl p-8 shadow-xl animate-in fade-in zoom-in-95 duration-300">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800">
                            <Github className="w-6 h-6 text-slate-700" />
                            Register Your Profile
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-500 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Divyansh"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-500 ml-1">Academic Section</label>
                                    <select
                                        value={formData.sectionSelect}
                                        onChange={(e) => setFormData({ ...formData, sectionSelect: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 transition-all outline-none"
                                    >
                                        <option value="">Select Section</option>
                                        <option value="1">Section 1</option>
                                        <option value="2">Section 2</option>
                                        <option value="3">Section 3</option>
                                        <option value="other">Other Section</option>
                                    </select>
                                </div>

                                {formData.sectionSelect === 'other' && (
                                    <input
                                        type="text"
                                        placeholder="Enter your section name"
                                        value={formData.section}
                                        onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                                        className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 transition-all outline-none"
                                    />
                                )}

                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-500 ml-1">LeetCode Username</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Divyansh2006"
                                        value={formData.leetcode}
                                        onChange={(e) => setFormData({ ...formData, leetcode: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 transition-all outline-none"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-500 ml-1">Codeforces Username</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Divyansh_cf"
                                        value={formData.codeforces}
                                        onChange={(e) => setFormData({ ...formData, codeforces: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                className="w-full px-6 py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-black transform hover:scale-[1.01] transition-all duration-300"
                            >
                                Create Profile
                            </button>
                        </div>
                    </div>
                )}

                {editingUser && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                    <Edit2 className="w-6 h-6 text-indigo-600" />
                                    Edit Profile
                                </h3>
                                <button
                                    onClick={() => setEditingUser(null)}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-slate-500 ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={editingUser.name}
                                            onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-slate-500 ml-1">Academic Section</label>
                                        <select
                                            value={editingUser.sectionSelect}
                                            onChange={(e) => setEditingUser({ ...editingUser, sectionSelect: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 transition-all outline-none"
                                        >
                                            <option value="">Select Section</option>
                                            <option value="1">Section 1</option>
                                            <option value="2">Section 2</option>
                                            <option value="3">Section 3</option>
                                            <option value="other">Other Section</option>
                                        </select>
                                    </div>

                                    {editingUser.sectionSelect === 'other' && (
                                        <input
                                            type="text"
                                            placeholder="Enter your section name"
                                            value={editingUser.section}
                                            onChange={(e) => setEditingUser({ ...editingUser, section: e.target.value })}
                                            className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 transition-all outline-none"
                                        />
                                    )}

                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-slate-500 ml-1">LeetCode Username</label>
                                        <input
                                            type="text"
                                            value={editingUser.leetcode?.username || ''}
                                            onChange={(e) => setEditingUser({
                                                ...editingUser,
                                                leetcode: { ...editingUser.leetcode, username: e.target.value }
                                            })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 transition-all outline-none"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-slate-500 ml-1">Codeforces Username</label>
                                        <input
                                            type="text"
                                            value={editingUser.codeforces?.username || ''}
                                            onChange={(e) => setEditingUser({
                                                ...editingUser,
                                                codeforces: { ...editingUser.codeforces, username: e.target.value }
                                            })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={handleEditSave}
                                        className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transform hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <Save className="w-5 h-5" />
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => setEditingUser(null)}
                                        className="px-6 py-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all duration-300"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mb-8 bg-white/70 backdrop-blur-md border border-white rounded-3xl p-4 shadow-sm">
                    <div className="flex flex-wrap justify-center gap-2">
                        <button
                            onClick={() => handleSectionChange('all')}
                            className={`px-6 py-2 rounded-xl font-bold transition-all duration-300 ${currentSection === 'all'
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                                    : 'text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            All Users
                        </button>
                        {sections.map((section) => (
                            <button
                                key={section}
                                onClick={() => handleSectionChange(section)}
                                className={`px-6 py-2 rounded-xl font-bold transition-all duration-300 ${currentSection === section
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                                        : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                Section {section}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Rank</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Coder</th>
                                    <th className="px-6 py-5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Group</th>
                                    <th className="px-6 py-5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">LC Solved</th>
                                    <th className="px-6 py-5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">CF Solved</th>
                                    <th className="px-6 py-5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Total Solved(LC + CF)</th>
                                    <th className="px-6 py-5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Rating</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.map((user, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-slate-50/80 transition-colors duration-200 group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${getRankStyle(index)} shadow-sm font-bold`}>
                                                {getRankIcon(index)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEditClick(user)}
                                                    className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors hover:underline flex items-center gap-1"
                                                >
                                                    {user.name}
                                                    <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase">
                                                Sec {user.section}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {user.leetcode?.username ? (
                                                <a
                                                    href={`https://leetcode.com/${user.leetcode.username}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex flex-col items-center group/link hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors"
                                                >
                                                    <div className="flex items-center gap-1 text-slate-700 font-bold group-hover/link:text-emerald-700">
                                                        {user.leetcode?.total ?? 0}
                                                        <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                                    </div>
                                                    <div className="text-[10px] text-emerald-600 font-bold">Score: {user.leetcode?.score ?? 0}</div>
                                                </a>
                                            ) : (
                                                <div>
                                                    <div className="text-slate-700 font-bold">0</div>
                                                    <div className="text-[10px] text-slate-400 font-bold">N/A</div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {user.codeforces?.username ? (
                                                <a
                                                    href={`https://codeforces.com/profile/${user.codeforces.username}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex flex-col items-center group/link hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                                                >
                                                    <div className="flex items-center gap-1 text-slate-700 font-bold group-hover/link:text-blue-700">
                                                        {user.codeforces?.solved ?? 0}
                                                        <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                                    </div>
                                                    <div className="text-[10px] text-blue-600 font-bold">Score: {user.codeforces?.score ?? 0}</div>
                                                </a>
                                            ) : (
                                                <div>
                                                    <div className="text-slate-700 font-bold">0</div>
                                                    <div className="text-[10px] text-slate-400 font-bold">N/A</div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="text-slate-900 font-extrabold text-lg">
                                                {user.totalSolved ?? 0}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <span className="text-2xl font-black text-slate-900">
                                                    {user.overallScore}
                                                </span>
                                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {users.length === 0 && (
                    <div className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-3xl mt-8">
                        <Code2 className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                        <p className="text-xl font-bold text-slate-400">The leaderboard is empty.</p>
                        <p className="text-slate-400">Be the first to claim the top spot!</p>
                    </div>
                )}
            </div>
        </div>
    );
}