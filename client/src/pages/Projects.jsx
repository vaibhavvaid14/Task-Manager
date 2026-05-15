import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, FolderKanban, Calendar, Users, Loader2, Edit2, Trash2, 
  Search, Filter, MoreVertical, LayoutGrid, List as ListIcon,
  Clock, CheckCircle2, AlertCircle, ArrowUpRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import { motion } from 'framer-motion';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data.data || data);
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this project and all its tasks?')) return;

    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted successfully');
      setProjects(projects.filter(p => p._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete project');
    }
  };

  const handleEditClick = (e, project) => {
    e.preventDefault();
    e.stopPropagation();
    setProjectToEdit(project);
    setShowCreateModal(true);
  };

  const handleProjectSaved = (savedProject) => {
    fetchProjects(); 
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full min-h-[400px] gap-4">
        <div className="relative">
          <Loader2 className="animate-spin h-12 w-12 text-accent" />
          <div className="absolute inset-0 blur-xl bg-accent/20 animate-pulse" />
        </div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Projects...</p>
      </div>
    );
  }

  const getStatusConfig = (status) => {
    switch(status) {
      case 'Completed': return { color: 'text-emerald-500', bg: 'bg-emerald-50', icon: CheckCircle2 };
      case 'In Progress': return { color: 'text-blue-500', bg: 'bg-blue-50', icon: Clock };
      case 'Delayed': return { color: 'text-red-500', bg: 'bg-red-50', icon: AlertCircle };
      default: return { color: 'text-slate-500', bg: 'bg-slate-50', icon: FolderKanban };
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-red-500 bg-red-50';
      case 'Medium': return 'text-amber-500 bg-amber-50';
      case 'Low': return 'text-emerald-500 bg-emerald-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
            Active <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-slate-500 font-medium">Manage, track, and collaborate on your team's initiatives.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none transition-all font-medium text-sm"
            />
          </div>
          {user?.role === 'Admin' && (
            <button 
              className="btn-primary"
              onClick={() => {
                setProjectToEdit(null);
                setShowCreateModal(true);
              }}
            >
              <Plus size={20} />
              New Project
            </button>
          )}
        </div>
      </div>

      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onProjectCreated={handleProjectSaved}
        projectToEdit={projectToEdit}
      />

      {filteredProjects.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium p-16 text-center bg-white/50 backdrop-blur-sm border-dashed border-2"
        >
          <div className="mx-auto w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 border border-slate-100">
            <FolderKanban className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">No projects found</h3>
          <p className="text-slate-500 font-medium max-w-xs mx-auto mb-8">
            {searchQuery ? `No results for "${searchQuery}"` : "Your workspace is empty. Create your first project to get started!"}
          </p>
          {!searchQuery && user?.role === 'Admin' && (
            <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
              Initialize Project
            </button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredProjects.map((project, i) => {
            const statusInfo = getStatusConfig(project.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <motion.div 
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link 
                  to={`/projects/${project._id}`}
                  className="card-premium p-8 bg-white flex flex-col h-full group relative overflow-hidden"
                >
                  {/* Hover Accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-[100px] -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                  
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className={`p-3 rounded-2xl ${statusInfo.bg} group-hover:scale-110 transition-transform duration-300`}>
                      <StatusIcon className={`h-6 w-6 ${statusInfo.color}`} />
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm ${getPriorityColor(project.priority)}`}>
                        {project.priority}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1 relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-accent transition-colors line-clamp-1">
                        {project.title}
                      </h3>
                      <ArrowUpRight size={18} className="text-slate-300 group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                    </div>
                    <p className="text-slate-500 font-medium text-sm mb-8 line-clamp-2 min-h-[40px] leading-relaxed">
                      {project.description}
                    </p>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-3 overflow-hidden">
                          {[1, 2, 3].map((_, idx) => (
                            <div key={idx} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                              {project.teamMembers?.[idx]?.name?.charAt(0) || <Users size={12} />}
                            </div>
                          ))}
                          {(project.teamMembers?.length > 3) && (
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-900 flex items-center justify-center text-[10px] font-bold text-white">
                              +{project.teamMembers.length - 3}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <Clock size={14} />
                          {new Date(project.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Workspace Progress</span>
                          <span className="text-sm font-black text-slate-900">{project.progressPercentage || 0}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progressPercentage || 0}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-shimmer rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Projects;
