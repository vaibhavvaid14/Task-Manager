import React, { useState, useEffect, useContext } from 'react';
import { Loader2, Search, Filter, Plus, Edit2, Trash2, Calendar, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import CreateTaskModal from '../components/tasks/CreateTaskModal';

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
    if (taskToEdit) {
      setTasks(tasks.map(t => t._id === savedTask._id ? savedTask : t));
    } else {
      setTasks([savedTask, ...tasks]);
    }
    fetchTasks(); // Refresh for populated data
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  const columns = ['Todo', 'In Progress', 'Review', 'Completed'];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Task Board</h1>
          <p className="text-slate-600 mt-1">Manage, assign and track tasks across projects.</p>
        </div>
        {user?.role === 'Admin' && (
          <button
            onClick={() => {
              setTaskToEdit(null);
              setShowTaskModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
          >
            <Plus size={20} /> New Task
          </button>
        )}
      </div>

      <CreateTaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onTaskCreated={handleTaskSaved}
        taskToEdit={taskToEdit}
      />

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search tasks or descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
        </div>
        <div className="relative min-w-[180px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none bg-white font-medium text-slate-700"
          >
            <option value="All">All Statuses</option>
            {columns.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200">
        <div className="flex gap-6 min-w-max h-full">
          {columns.map(column => {
            const columnTasks = filteredTasks.filter(t => t.status === column);
            
            return (
              <div key={column} className="w-80 flex flex-col bg-slate-50/50 rounded-2xl border border-slate-200 shadow-inner">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white/50 rounded-t-2xl">
                  <h3 className="font-bold text-slate-700 tracking-tight">{column}</h3>
                  <span className="bg-slate-200 text-slate-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
                
                <div className="p-4 flex-1 overflow-y-auto space-y-4">
                  {columnTasks.map(task => {
                    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Completed';
                    return (
                      <div key={task._id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-3">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md 
                            ${task.priority === 'High' ? 'bg-red-50 text-red-600' : 
                              task.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 
                              'bg-emerald-50 text-emerald-600'}`}
                          >
                            {task.priority}
                          </span>
                          
                          {user?.role === 'Admin' && (
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => { setTaskToEdit(task); setShowTaskModal(true); }}
                                className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button 
                                onClick={() => handleDeleteTask(task._id)}
                                className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                        
                        <h4 className="font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors leading-tight">{task.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">{task.description}</p>
                        
                        {task.project && (
                          <div className="mb-4">
                            <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded">
                              {task.project.title || task.project}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                          <div className="flex items-center gap-2">
                            {task.assignedUser ? (
                              <div className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-[10px] border border-accent/20" title={task.assignedUser.name}>
                                {task.assignedUser.name.charAt(0).toUpperCase()}
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200" title="Unassigned">
                                ?
                              </div>
                            )}
                          </div>
                          <div className={`flex items-center gap-1 text-[10px] font-bold ${isOverdue ? 'text-red-500' : 'text-slate-400'}`}>
                            {isOverdue && <AlertCircle size={10} />}
                            <Calendar size={10} />
                            {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </div>
                        </div>

                        {/* Quick status change for everyone (Admin all, Member assigned) */}
                        {(user?.role === 'Admin' || task.assignedUser?._id === user?._id || task.assignedUser === user?._id) && (
                          <div className="mt-4 pt-3 border-t border-slate-50">
                            <select 
                              className="w-full text-[10px] font-bold text-slate-500 bg-slate-50 border-none rounded p-1 outline-none hover:bg-slate-100 transition-colors"
                              value={task.status}
                              onChange={(e) => handleStatusChange(task._id, e.target.value)}
                            >
                              {columns.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {columnTasks.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-xs font-medium">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
