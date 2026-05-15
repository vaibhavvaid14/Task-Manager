import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Loader2, Briefcase, CheckSquare, Clock, AlertCircle, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']; 

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
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  const statCards = [
    { title: 'Total Projects', value: stats.totalProjects, icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Total Tasks', value: stats.totalTasks, icon: CheckSquare, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { title: 'Completed Tasks', value: stats.completedTasks, icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'Overdue Tasks', value: stats.overdueTasks, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back, {user?.name}! 👋</h1>
          <p className="text-slate-500 mt-1 font-medium">Here is a summary of your organization's progress today.</p>
        </div>
        <div className="flex gap-3">
          <Link 
            to="/tasks" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 font-bold text-sm"
          >
            <Plus size={18} /> New Task
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{card.title}</p>
                  <h3 className="text-3xl font-extrabold text-slate-900">{card.value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${card.bg} group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart: Task Status Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-1">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Task Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
            <Link to="/tasks" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            {recentTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <CheckSquare size={48} className="opacity-20 mb-3" />
                <p className="font-medium">No recent activity found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTasks.map(task => (
                  <div key={task._id} className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${
                        task.status === 'Completed' ? 'bg-emerald-500' : 
                        task.status === 'In Progress' ? 'bg-blue-500' : 'bg-slate-300'
                      }`} />
                      <div>
                        <p className="font-bold text-slate-900 text-sm group-hover:text-primary transition-colors">{task.title}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                          {task.project?.title || 'Personal Project'} • Due {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded uppercase tracking-wider 
                      ${task.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 
                        task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 
                        'bg-slate-200 text-slate-600'}`}
                    >
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
