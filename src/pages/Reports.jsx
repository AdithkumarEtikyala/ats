import React, { useContext } from 'react';
import { MOCK_ANALYTICS } from '../utils/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { BarChart3, LineChart, PieChart as PieIcon, CheckCircle2, Clock } from 'lucide-react';
import { HotelContext } from '../contexts/HotelContext';

export default function Reports() {
  const { darkMode } = useContext(HotelContext);
  const analytics = MOCK_ANALYTICS;

  const COLORS = ['#14b8a6', '#0d9488', '#0f766e', '#115e59', '#134e4a'];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Reports & Analytics</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Analyze compliance scores, response metrics, and request breakdowns</p>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Overall SLA compliance</span>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 mt-1">
              {analytics.complianceRate}%
            </div>
            <span className="text-[10px] text-emerald-500 font-semibold block mt-1">Goal target met (&gt;90%)</span>
          </div>
          <div className="h-10 w-10 bg-teal-500/10 text-teal-650 rounded-xl flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Average Response Time</span>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 mt-1">
              {Math.floor(analytics.avgResponseSeconds / 60)}m {analytics.avgResponseSeconds % 60}s
            </div>
            <span className="text-[10px] text-slate-450 block mt-1">Across all departments</span>
          </div>
          <div className="h-10 w-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center">
            <Clock size={20} />
          </div>
        </div>
      </div>

      {/* Recharts Graphical Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance rate per dept */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <BarChart3 size={16} className="text-teal-600" /> SLA Compliance rate (%)
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.deptCompliance} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="name" stroke={darkMode ? '#94a3b8' : '#64748b'} fontSize={10} />
                <YAxis domain={[0, 100]} stroke={darkMode ? '#94a3b8' : '#64748b'} fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                    border: `1px stroke ${darkMode ? '#1e293b' : '#cbd5e1'}`
                  }}
                />
                <Bar dataKey="compliance" fill="#14b8a6" radius={[6, 6, 0, 0]}>
                  {analytics.deptCompliance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Requests categories */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <PieIcon size={16} className="text-teal-650" /> Guest Requests breakdown
          </h3>

          <div className="h-64 flex flex-col justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={analytics.requestBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {analytics.requestBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-2 gap-2 text-[10px] mt-4 px-4 font-semibold text-slate-500 dark:text-slate-400">
              {analytics.requestBreakdown.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full block" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span className="truncate w-24">{item.name}</span>
                  <span className="text-slate-850 dark:text-slate-200">({item.count})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
