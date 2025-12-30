import React from 'react';
import { X, Edit2, Lock, Save } from 'lucide-react';

export const EditModal = ({ user, setUser, onSave, onClose }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl animate-in zoom-in-95">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Edit2 className="w-6 h-6 text-indigo-600" />
          Edit Profile
        </h3>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
          />
          <select
            value={user.sectionSelect}
            onChange={(e) => setUser({ ...user, sectionSelect: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
          >
            <option value="1">Section 1</option>
            <option value="2">Section 2</option>
            <option value="3">Section 3</option>
            <option value="other">Other</option>
          </select>
          <input
            type="text"
            placeholder="LeetCode"
            value={user.leetcode?.username || ''}
            onChange={(e) =>
              setUser({ ...user, leetcode: { ...user.leetcode, username: e.target.value } })
            }
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
          />
          <input
            type="text"
            placeholder="Codeforces"
            value={user.codeforces?.username || ''}
            onChange={(e) =>
              setUser({ ...user, codeforces: { ...user.codeforces, username: e.target.value } })
            }
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
          />
          <input
            type="text"
            placeholder="GeeksforGeek"
            value={user.gfg?.username || ''}
            onChange={(e) =>
              setUser({ ...user, gfg: { ...user.gfg , username: e.target.value } })
            }
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
          />
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-red-500 flex items-center gap-1">
              <Lock className="w-4 h-4" /> Confirm Password
            </label>
            <input
              type="password"
              placeholder="Enter password to save"
              value={user.password || ''}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full px-4 py-3 bg-red-50 border-2 border-red-100 rounded-xl outline-none"
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onSave}
            className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="px-6 py-4 bg-slate-100 text-slate-700 rounded-xl font-bold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
);
