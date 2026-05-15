import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  Loader2, TrendingUp, CheckCircle2, Clock, AlertCircle, 
  BarChart3, PieChart as PieChartIcon, Activity, Target,
  Calendar, ArrowUpRight, ArrowDownRight, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { motion } from 'framer-motion';

const COLORS = ['#3b82f6', '#a855f7', '#10b981', '#f59e0b', '#ef4444'];
const GRADIENTS = [
  'linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)',
  'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
  'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
];

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

      const statusMap = allTasks.reduce((acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
      }, {});
      const statusData = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

      const priorityMap = allTasks.reduce((acc, t) => {
        acc[t.priority] = (acc[t.priority] || 0) + 1;
        return acc;
      }, {});
      const priorityData = Object.entries(priorityMap).map(([name, value]) => ({ name, value }));

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
      <div className="flex flex-col justify-center items-center h-full min-h-[400px] gap-4">
        <div className="relative">
          <Loader2 className="animate-spin h-12 w-12 text-accent" />
          <div className="absolute inset-0 blur-xl bg-accent/20 animate-pulse" />
        </div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Computing Metrics...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 pb-10"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter italic mb-2">
            Intelligence <span className="gradient-text">Insights</span>
          </h1>
          <p className="text-slate-500 font-medium italic flex items-center gap-2">
            <Activity size={16} /> Advanced performance diagnostics for your workspace.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
            Real-time Telemetry
          </span>
          <button className="btn-secondary">
            <Calendar size={18} /> Last 30 Days
          </button>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Yield Rate', val: `${data.stats.completionRate}%`, icon: Target, color: 'text-blue-500', bg: 'bg-blue-50', trend: '+2.4%' },
          { label: 'Closed Initiatives', val: data.stats.completedTasks, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50', trend: '+12' },
          { label: 'Active Pipeline', val: data.stats.pendingTasks, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', trend: '-5%' },
          { label: 'Critical Risk', val: data.stats.overdueTasks, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', trend: 'Stable' },
        ].map((s, i) => (
          <motion.div 
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="card-premium p-8 bg-white relative overflow-hidden group hover:-translate-y-1 transition-all"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-bl-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500" />
            <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center mb-6 relative z-10`}>
              <s.icon className={`h-6 w-6 ${s.color}`} />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-black text-slate-900 tracking-tighter italic">{s.val}</p>
                <span className={`text-[10px] font-black italic flex items-center gap-0.5 ${s.trend.startsWith('+') ? 'text-emerald-500' : s.trend.startsWith('-') ? 'text-red-500' : 'text-slate-400'}`}>
                  {s.trend.startsWith('+') ? <ArrowUpRight size={12} /> : s.trend.startsWith('-') ? <ArrowDownRight size={12} /> : <Zap size={12} />}
                  {s.trend}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Analysis */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card-premium p-8 bg-white"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-900 tracking-tight italic flex items-center gap-2">
              <PieChartIcon size={20} className="text-accent" /> State Distribution
            </h3>
            <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-accent transition-colors">Export Map</button>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {data.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 'bold'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {data.statusData.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.name}</span>
                <span className="text-[10px] font-black text-slate-900 ml-auto">{s.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Priority Vector */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card-premium p-8 bg-white"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-900 tracking-tight italic flex items-center gap-2">
              <BarChart3 size={20} className="text-accent" /> Priority Vector
            </h3>
            <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-accent transition-colors">Adjust Weights</button>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.priorityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 'bold'
                  }} 
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} barSize={40}>
                  {data.priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Velocity Trend */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium p-8 bg-white lg:col-span-2 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-10 relative z-10">
            <h3 className="text-xl font-black text-slate-900 tracking-tight italic flex items-center gap-2">
              <Activity size={24} className="text-accent" /> Velocity Telemetry
            </h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-slate-300" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target</span>
              </div>
            </div>
          </div>

          <div className="h-[350px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trendData}>
                <defs>
                  <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 'bold', fill: '#94a3b8' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 'bold', fill: '#94a3b8' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '24px', 
                    border: 'none', 
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 'black'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#3b82f6" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorComp)" 
                  animationDuration={2000}
                />
                <Area 
                  type="monotone" 
                  dataKey="pending" 
                  stroke="#cbd5e1" 
                  strokeWidth={2}
                  fill="transparent" 
                  strokeDasharray="8 8" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Analytics;
