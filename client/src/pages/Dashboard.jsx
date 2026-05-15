import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  Loader2, Briefcase, CheckSquare, Clock, AlertCircle, Plus, 
  ArrowRight, TrendingUp, Calendar, Filter, Download, MoreHorizontal
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { CardSkeleton, TableRowSkeleton } from '../components/common/Skeleton';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b']; 

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0
  });
  const [taskStatusData, setTaskStatusData] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [projectsRes, tasksRes] = await Promise.all([
        api.get('/projects'),
        api.get('/tasks')
      ]);

      const projects = projectsRes.data.data || projectsRes.data;
      const tasks = tasksRes.data.data || tasksRes.data;

      const now = new Date();
      let completed = 0;
      let pending = 0;
      let overdue = 0;
      
      const statusCounts = {
        'Todo': 0,
        'In Progress': 0,
        'Review': 0,
        'Completed': 0
      };

      tasks.forEach(task => {
        if (task.status === 'Completed') {
          completed++;
        } else {
          pending++;
          if (new Date(task.dueDate) < now) {
            overdue++;
          }
        }
        
        if (statusCounts[task.status] !== undefined) {
          statusCounts[task.status]++;
        }
      });

      setStats({
        totalProjects: projects.length,
        totalTasks: tasks.length,
        completedTasks: completed,
        pendingTasks: pending,
        overdueTasks: overdue
      });

      setTaskStatusData(Object.keys(statusCounts).map(key => ({
        name: key,
        value: statusCounts[key]
      })));

      const sortedTasks = [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
      setRecentTasks(sortedTasks);

    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div className="space-y-2">
            <div className="h-10 w-64 bg-slate-200 animate-pulse rounded-xl" />
            <div className="h-4 w-48 bg-slate-100 animate-pulse rounded-lg" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-24 bg-slate-200 animate-pulse rounded-xl" />
            <div className="h-10 w-24 bg-slate-200 animate-pulse rounded-xl" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="card-premium p-8 lg:col-span-1 h-[400px] flex flex-col justify-center items-center gap-4">
             <div className="w-48 h-48 rounded-full border-8 border-slate-100 border-t-slate-200 animate-spin" />
             <div className="h-4 w-32 bg-slate-100 rounded-full animate-pulse" />
          </div>
          <div className="card-premium lg:col-span-2 divide-y divide-slate-50">
            {[1, 2, 3, 4, 5].map(i => <TableRowSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Projects', value: stats.totalProjects, icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-50', trend: '+2 this week' },
    { title: 'Active Tasks', value: stats.pendingTasks, icon: CheckSquare, color: 'text-indigo-500', bg: 'bg-indigo-50', trend: '5 due today' },
    { title: 'Completed', value: stats.completedTasks, icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-50', trend: '85% completion' },
    { title: 'Overdue', value: stats.overdueTasks, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', trend: '-20% from last month' },
  ];

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
            Workspace <span className="gradient-text">Overview</span>
          </h1>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <Calendar size={16} />
            Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button className="flex-1 lg:flex-none btn-secondary">
            <Filter size={18} /> Filter
          </button>
          <button className="flex-1 lg:flex-none btn-secondary">
            <Download size={18} /> Export
          </button>
          <Link to="/tasks" className="flex-1 lg:flex-none btn-primary">
            <Plus size={18} /> Create Task
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-premium p-6 group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${card.bg} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full uppercase tracking-wider">
                  <TrendingUp size={12} className="text-success" />
                  {card.trend}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{card.title}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{card.value}</h3>
                  <span className="text-xs font-bold text-slate-300">items</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart: Task Status Distribution */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card-premium p-8 lg:col-span-1 bg-white relative overflow-hidden"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Status Distribution</h3>
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
          
          <div className="h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  animationBegin={200}
                  animationDuration={1500}
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      strokeWidth={0}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    fontWeight: 'bold'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Info */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-3xl font-black text-slate-900 tracking-tighter">{stats.totalTasks}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Tasks</p>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            {taskStatusData.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-slate-500 uppercase tracking-wider">{s.name}</span>
                </div>
                <span className="text-slate-900">{s.value} ({Math.round((s.value / (stats.totalTasks || 1)) * 100)}%)</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Tasks Timeline */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card-premium p-8 lg:col-span-2 flex flex-col bg-white"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black text-slate-900 tracking-tight italic">Live Activity Feed</h3>
            <Link to="/tasks" className="text-xs font-bold text-accent hover:underline flex items-center gap-1 uppercase tracking-widest">
              Explore All <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {recentTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 border border-slate-100">
                  <CheckSquare size={32} className="opacity-20" />
                </div>
                <p className="font-bold uppercase tracking-widest text-xs">No recent updates found</p>
              </div>
            ) : (
              <div className="space-y-6">
                {recentTasks.map((task, i) => (
                  <motion.div 
                    key={task._id} 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-5 group relative"
                  >
                    {/* Vertical Line */}
                    {i !== recentTasks.length - 1 && (
                      <div className="absolute left-6 top-10 bottom-[-24px] w-0.5 bg-slate-100" />
                    )}
                    
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 z-10 transition-all duration-300 group-hover:scale-110 shadow-sm
                      ${task.status === 'Completed' ? 'bg-emerald-50 text-emerald-500' : 
                        task.status === 'In Progress' ? 'bg-blue-50 text-blue-500' : 'bg-slate-100 text-slate-400'}`}
                    >
                      <CheckSquare size={20} />
                    </div>

                    <div className="flex-1 pb-4">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-accent transition-colors duration-300">
                          {task.title}
                        </h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mb-3">
                        {task.project?.title || 'Personal Workspace'} • Assigned to You
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg uppercase tracking-widest shadow-sm
                          ${task.status === 'Completed' ? 'bg-emerald-500 text-white' : 
                            task.status === 'In Progress' ? 'bg-blue-500 text-white' : 
                            'bg-slate-200 text-slate-600'}`}
                        >
                          {task.status}
                        </span>
                        {new Date(task.dueDate) < new Date() && task.status !== 'Completed' && (
                          <span className="px-2.5 py-1 text-[10px] font-black bg-red-500 text-white rounded-lg uppercase tracking-widest animate-pulse shadow-lg shadow-red-500/20">
                            Overdue
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
