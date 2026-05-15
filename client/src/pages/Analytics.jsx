import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { Loader2, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const COLORS = ['#3b82f6', '#a855f7', '#10b981', '#f59e0b', '#ef4444'];

const Analytics = () => {
  const [data, setData] = useState({
    statusData: [],
    priorityData: [],
    trendData: [],
    stats: {
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      overdueTasks: 0,
      completionRate: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data: tasks } = await api.get('/tasks');
      const allTasks = tasks.data || tasks;

      // Status distribution
      const statusMap = allTasks.reduce((acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
      }, {});
      const statusData = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

      // Priority distribution
      const priorityMap = allTasks.reduce((acc, t) => {
        acc[t.priority] = (acc[t.priority] || 0) + 1;
        return acc;
      }, {});
      const priorityData = Object.entries(priorityMap).map(([name, value]) => ({ name, value }));

      // Completion trend (last 7 days - mock for now as we don't have historical snapshots)
      const trendData = [
        { day: 'Mon', completed: 4, pending: 8 },
        { day: 'Tue', completed: 6, pending: 7 },
        { day: 'Wed', completed: 8, pending: 5 },
        { day: 'Thu', completed: 7, pending: 6 },
        { day: 'Fri', completed: 10, pending: 4 },
        { day: 'Sat', completed: 5, pending: 3 },
        { day: 'Sun', completed: 3, pending: 2 },
      ];

      const completed = allTasks.filter(t => t.status === 'Completed').length;
      const overdue = allTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Completed').length;

      setData({
        statusData,
        priorityData,
        trendData,
        stats: {
          totalTasks: allTasks.length,
          completedTasks: completed,
          pendingTasks: allTasks.length - completed,
          overdueTasks: overdue,
          completionRate: allTasks.length > 0 ? Math.round((completed / allTasks.length) * 100) : 0
        }
      });
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics Insights</h1>
        <p className="text-slate-600 mt-1">Detailed performance metrics and task distributions.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Completion Rate', val: `${data.stats.completionRate}%`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Completed Tasks', val: data.stats.completedTasks, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pending Work', val: data.stats.pendingTasks, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Overdue Tasks', val: data.stats.overdueTasks, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((s) => (
          <div key={s.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-4`}>
              <s.icon className={`h-6 w-6 ${s.color}`} />
            </div>
            <p className="text-sm font-medium text-slate-500">{s.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{s.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Task Status Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Priority Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.priorityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Productivity Trend */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Productivity Trend (Last 7 Days)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trendData}>
                <defs>
                  <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="completed" stroke="#3b82f6" fillOpacity={1} fill="url(#colorComp)" strokeWidth={2} />
                <Area type="monotone" dataKey="pending" stroke="#d1d5db" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
