import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, Users, Loader2, ArrowLeft, MoreVertical, Plus, 
  Briefcase, Clock, CheckCircle2, AlertCircle, TrendingUp,
  Layout, Target, Settings, Share2, Mail, User as UserIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import { motion } from 'framer-motion';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get('/tasks')
      ]);

      const projectData = projectRes.data.data || projectRes.data;
      const allTasks = tasksRes.data.data || tasksRes.data;

      setProject(projectData);
      setTasks(allTasks.filter(t => t.project?._id === id || t.project === id));
    } catch (error) {
      toast.error('Failed to fetch project details');
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
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Project Data...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20 card-premium mx-auto max-w-lg">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-6" />
        <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Project not found</h3>
        <p className="text-slate-500 mb-8 font-medium">The project you're looking for might have been deleted or moved.</p>
        <Link to="/projects" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={18} /> Back to Projects
        </Link>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'text-emerald-500 bg-emerald-50';
      case 'In Progress': return 'text-blue-500 bg-blue-50';
      case 'Delayed': return 'text-red-500 bg-red-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  return (
    <div className="space-y-10 pb-10">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6"
      >
        <div className="flex-1">
          <Link to="/projects" className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-accent mb-4 transition-all">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>
          <div className="flex items-center gap-4 mb-3">
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter italic">
              {project.title}
            </h1>
            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          </div>
          <p className="text-slate-500 font-medium max-w-3xl leading-relaxed italic">
            {project.description}
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button className="flex-1 lg:flex-none btn-secondary">
            <Share2 size={18} /> Share
          </button>
          <button className="flex-1 lg:flex-none btn-secondary">
            <Settings size={18} /> Settings
          </button>
          <button
            onClick={() => setShowTaskModal(true)}
            className="flex-1 lg:flex-none btn-primary"
          >
            <Plus size={20} /> Add Task
          </button>
        </div>
      </motion.div>

      <CreateTaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        projectId={id}
        onTaskCreated={(newTask) => setTasks(prev => [...prev, newTask])}
      />

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card-premium p-8 lg:col-span-3 bg-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
          
          <div className="flex justify-between items-center mb-10 relative z-10">
            <h3 className="text-lg font-black text-slate-900 tracking-tight italic flex items-center gap-2">
              <Target size={20} className="text-accent" /> Project Pulse
            </h3>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Completion Score</p>
                <p className="text-2xl font-black text-slate-900 tracking-tighter">{project.progressPercentage || 0}%</p>
              </div>
            </div>
          </div>

          <div className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Project Priority</p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${project.priority === 'High' ? 'bg-red-500' : 'bg-amber-500'}`} />
                  <span className="font-black text-slate-900 tracking-tight italic">{project.priority}</span>
                </div>
              </div>
              <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Final Deadline</p>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-slate-400" />
                  <span className="font-black text-slate-900 tracking-tight italic">{new Date(project.deadline).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Resource Utilization</p>
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-emerald-500" />
                  <span className="font-black text-slate-900 tracking-tight italic">Optimal</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progressPercentage || 0}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-shimmer rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card-premium p-8 bg-white flex flex-col"
        >
          <h3 className="text-lg font-black text-slate-900 tracking-tight mb-8 italic flex items-center gap-2">
            <Users size={20} className="text-accent" /> Team Core
          </h3>
          {project.teamMembers?.length > 0 ? (
            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
              {project.teamMembers.map((member, i) => (
                <motion.div 
                  key={member._id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center font-black text-slate-500 group-hover:scale-110 group-hover:bg-accent/10 group-hover:text-accent transition-all duration-300">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-900 tracking-tight truncate group-hover:text-accent transition-colors">{member.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Mail size={10} /> {member.email.split('@')[0]}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-100 rounded-3xl">
              <UserIcon size={32} className="text-slate-200 mb-4" />
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Members Assigned</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Task Repository Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-premium bg-white overflow-hidden"
      >
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-900 tracking-tight italic">Initiative Backlog</h3>
          <span className="text-[10px] font-black text-white bg-slate-900 py-1 px-4 rounded-full uppercase tracking-widest">
            {tasks.length} Deliverables
          </span>
        </div>
        
        {tasks.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus size={32} className="text-slate-200" />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Backlog is currently empty</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-50">
                  <th className="p-8">Deliverable</th>
                  <th className="p-8">Stakeholder</th>
                  <th className="p-8">State</th>
                  <th className="p-8">Weight</th>
                  <th className="p-8 text-right">Target Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {tasks.map((task, i) => (
                  <motion.tr 
                    key={task._id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group hover:bg-slate-50 transition-all duration-300 cursor-pointer"
                  >
                    <td className="p-8">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 tracking-tight group-hover:text-accent transition-colors">{task.title}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {task._id.slice(-6)}</span>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 border border-white shadow-sm">
                          {task.assignedUser ? task.assignedUser.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <span className="text-xs font-bold text-slate-700">{task.assignedUser ? task.assignedUser.name : 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className="p-8">
                      <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm
                        ${task.status === 'Completed' ? 'bg-emerald-500 text-white' : 
                          task.status === 'In Progress' ? 'bg-blue-500 text-white' : 
                          'bg-slate-200 text-slate-600'}`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="p-8">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${task.priority === 'High' ? 'bg-red-500' : task.priority === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                        <span className="text-xs font-bold text-slate-700">{task.priority}</span>
                      </div>
                    </td>
                    <td className="p-8 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-black text-slate-900">{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest mt-1 ${new Date(task.dueDate) < new Date() ? 'text-red-500' : 'text-slate-400'}`}>
                          {new Date(task.dueDate) < new Date() ? 'Overdue' : 'Scheduled'}
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProjectDetails;
