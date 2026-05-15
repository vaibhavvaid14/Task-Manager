import React, { useState, useEffect, useContext } from 'react';
import { 
  Loader2, Search, Filter, Plus, Edit2, Trash2, Calendar, 
  AlertCircle, ChevronRight, MoreHorizontal, Layout, CheckCircle2,
  Clock, ArrowUpRight, User as UserIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import { motion, AnimatePresence } from 'framer-motion';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data.data || data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Task deleted successfully');
      setTasks(tasks.filter(t => t._id !== id));
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      toast.success('Status updated');
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleTaskSaved = (savedTask) => {
    fetchTasks(); 
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full min-h-[400px] gap-4">
        <div className="relative">
          <Loader2 className="animate-spin h-12 w-12 text-accent" />
          <div className="absolute inset-0 blur-xl bg-accent/20 animate-pulse" />
        </div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Task Board...</p>
      </div>
    );
  }

  const columns = ['Todo', 'In Progress', 'Review', 'Completed'];

  return (
    <div className="space-y-10 h-full flex flex-col pb-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
            Task <span className="gradient-text">Board</span>
          </h1>
          <p className="text-slate-500 font-medium italic flex items-center gap-2">
            <Layout size={16} /> Centralized workspace for all your initiatives.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none transition-all font-medium text-sm"
            />
          </div>
          {user?.role === 'Admin' && (
            <button 
              className="btn-primary"
              onClick={() => {
                setTaskToEdit(null);
                setShowTaskModal(true);
              }}
            >
              <Plus size={20} />
              New Task
            </button>
          )}
        </div>
      </div>

      <CreateTaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onTaskCreated={handleTaskSaved}
        taskToEdit={taskToEdit}
      />

      <div className="flex gap-8 overflow-x-auto pb-8 custom-scrollbar">
        {columns.map((column, colIdx) => {
          const columnTasks = filteredTasks.filter(t => t.status === column);
          
          return (
            <div key={column} className="min-w-[320px] w-[320px] flex flex-col gap-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-6 rounded-full ${
                    column === 'Todo' ? 'bg-slate-300' : 
                    column === 'In Progress' ? 'bg-blue-400' : 
                    column === 'Review' ? 'bg-purple-400' : 'bg-emerald-400'
                  }`} />
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">{column}</h3>
                  <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{columnTasks.length}</span>
                </div>
                <button className="text-slate-400 hover:text-slate-900 transition-colors">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              <div className="flex-1 space-y-4">
                <AnimatePresence>
                  {columnTasks.map((task, taskIdx) => {
                    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Completed';
                    const priorityColor = 
                      task.priority === 'High' ? 'text-red-500 bg-red-50' : 
                      task.priority === 'Medium' ? 'text-amber-500 bg-amber-50' : 
                      'text-emerald-500 bg-emerald-50';

                    return (
                      <motion.div
                        key={task._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: taskIdx * 0.05 }}
                        className="card-premium p-6 bg-white hover:border-accent transition-all group cursor-pointer relative"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${priorityColor}`}>
                            {task.priority}
                          </span>
                          
                          {(user?.role === 'Admin' || task.assignedUser?._id === user?._id) && (
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                              <button 
                                onClick={(e) => { e.stopPropagation(); setTaskToEdit(task); setShowTaskModal(true); }}
                                className="p-1.5 text-slate-400 hover:text-accent hover:bg-accent/5 rounded-lg transition-all"
                              >
                                <Edit2 size={14} />
                              </button>
                              {user?.role === 'Admin' && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleDeleteTask(task._id); }}
                                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        <h4 className="font-bold text-slate-900 mb-2 group-hover:text-accent transition-colors leading-snug">
                          {task.title}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium mb-6 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>

                        <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden group-hover:scale-110 transition-transform">
                              {task.assignedUser ? (
                                <span className="text-[10px] font-black text-slate-500" title={task.assignedUser.name}>
                                  {task.assignedUser.name.charAt(0).toUpperCase()}
                                </span>
                              ) : (
                                <UserIcon size={14} className="text-slate-300" />
                              )}
                            </div>
                            {task.project && (
                              <span className="text-[9px] font-black text-accent bg-accent/5 px-2 py-0.5 rounded-full uppercase tracking-tighter max-w-[100px] truncate">
                                {task.project.title || task.project}
                              </span>
                            )}
                          </div>
                          
                          <div className={`flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase ${isOverdue ? 'text-red-500' : 'text-slate-400'}`}>
                            {isOverdue && <AlertCircle size={12} className="animate-pulse" />}
                            <Calendar size={12} />
                            {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </div>
                        </div>

                        {/* Status Quick Switcher */}
                        <div className="mt-4 pt-3 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
                           <select 
                              className="w-full text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 border-none rounded-lg p-2 outline-none hover:bg-slate-100 transition-colors"
                              value={task.status}
                              onChange={(e) => handleStatusChange(task._id, e.target.value)}
                            >
                              {columns.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                
                {columnTasks.length === 0 && (
                  <div className="h-40 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center gap-2 bg-slate-50/20">
                    <CheckCircle2 size={24} className="text-slate-200" />
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Active Tasks</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tasks;
