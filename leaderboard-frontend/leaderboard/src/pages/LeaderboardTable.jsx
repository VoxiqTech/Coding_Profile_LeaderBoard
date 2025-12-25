import React from 'react';
import { Trophy, Award, Star, ExternalLink, ChevronRight, Edit2, Code2 } from 'lucide-react';

const SolvedCell = ({ username, total, score, url, platform }) => (
  <td className="px-6 py-4 text-center">
    {username ? (
      <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex flex-col items-center group/link hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors">
        <div className="flex items-center gap-1 text-slate-700 font-bold">
          {total ?? 0} <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
        </div>
        <div className={`text-[10px] font-bold ${platform === 'leetcode' ? 'text-emerald-600' : 'text-blue-600'}`}>Score: {score ?? 0}</div>
      </a>
    ) : (
      <div className="text-slate-400 font-bold">0 <br/><span className="text-[10px]">N/A</span></div>
    )}
  </td>
);

export const LeaderboardTable = ({ users, onEditClick, getRankStyle, getRankIcon }) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-3xl mt-8">
        <Code2 className="w-16 h-16 mx-auto mb-4 text-slate-300" />
        <p className="text-xl font-bold text-slate-400">The leaderboard is empty.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-5 text-left text-xs font-bold text-slate-500 uppercase">Rank</th>
              <th className="px-6 py-5 text-left text-xs font-bold text-slate-500 uppercase">Coder</th>
              <th className="px-6 py-5 text-center text-xs font-bold text-slate-500 uppercase">Group</th>
              <th className="px-6 py-5 text-center text-xs font-bold text-slate-500 uppercase">LC Solved</th>
              <th className="px-6 py-5 text-center text-xs font-bold text-slate-500 uppercase">CF Solved</th>
              <th className="px-6 py-5 text-center text-xs font-bold text-slate-500 uppercase">Total</th>
              <th className="px-6 py-5 text-center text-xs font-bold text-slate-500 uppercase">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user, index) => (
              <tr key={user._id || index} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-6 py-4">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${getRankStyle(index)} font-bold`}>
                    {getRankIcon(index)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => onEditClick(user)} className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 flex items-center gap-1">
                    {user.name} <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                  </button>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase">Sec {user.section}</span>
                </td>
                <SolvedCell platform="leetcode" username={user.leetcode?.username} total={user.leetcode?.total} score={user.leetcode?.score} url={`https://leetcode.com/${user.leetcode?.username}`} />
                <SolvedCell platform="codeforces" username={user.codeforces?.username} total={user.codeforces?.solved} score={user.codeforces?.score} url={`https://codeforces.com/profile/${user.codeforces?.username}`} />
                <td className="px-6 py-4 text-center font-extrabold text-lg text-slate-900">{user.totalSolved ?? 0}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-2xl font-black text-slate-900">{user.overallScore}</span>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};