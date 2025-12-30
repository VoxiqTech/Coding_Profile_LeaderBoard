import React from 'react';
import { Github, Lock } from 'lucide-react';

export const RegistrationForm = ({ formData, setFormData, onSubmit }) => (
  <div className="mb-8 bg-white border border-slate-200 rounded-3xl p-8 shadow-xl animate-in fade-in zoom-in-95 duration-300">
    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800">
      <Github className="w-6 h-6 text-slate-700" /> Register Your Profile
    </h3>
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Full Name (e.g. Divyansh)"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none"
        />
        <select
          value={formData.sectionSelect}
          onChange={(e) => setFormData({ ...formData, sectionSelect: e.target.value })}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
        >
          <option value="">Select Section</option>
          <option value="1">Section 1</option>
          <option value="2">Section 2</option>
          <option value="3">Section 3</option>
          <option value="3">Section 4</option>
          <option value="3">Section 5</option>
          <option value="other">Other Section</option>
        </select>
        {formData.sectionSelect === 'other' && (
          <input
            type="text"
            placeholder="Enter your section name"
            value={formData.section}
            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
            className="md:col-span-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none"
          />
        )}
        <input
          type="text"
          placeholder="LeetCode Username"
          value={formData.leetcode}
          onChange={(e) => setFormData({ ...formData, leetcode: e.target.value })}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
        />
        <input
          type="text"
          placeholder="Codeforces Username"
          value={formData.codeforces}
          onChange={(e) => setFormData({ ...formData, codeforces: e.target.value })}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
        />
        <input
          type="text"
          placeholder="GFG Username"
          value={formData.gfg}
          onChange={(e) => setFormData({ ...formData, gfg: e.target.value })}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
        />
        <div className="md:col-span-2 space-y-1">
          <label className="text-sm font-semibold text-slate-500 flex items-center gap-1"><Lock className="w-4 h-4" /> Password</label>
          <input
            type="password"
            placeholder="Create a password to edit later"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
          />
        </div>
      </div>
      <button onClick={onSubmit} className="w-full px-6 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all">
        Create Profile
      </button>
    </div>
  </div>
);