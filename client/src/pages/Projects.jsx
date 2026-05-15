import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FolderKanban, Calendar, Users, Loader2, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import CreateProjectModal from '../components/projects/CreateProjectModal';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
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
    if (projectToEdit) {
      setProjects(projects.map(p => p._id === savedProject._id ? savedProject : p));
    } else {
      setProjects([savedProject, ...projects]);
    }
    fetchProjects(); // Refresh to get populated data
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Delayed': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-red-600 bg-red-50';
      case 'Medium': return 'text-amber-600 bg-amber-50';
      case 'Low': return 'text-emerald-600 bg-emerald-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-600 mt-1">Manage and track your team's projects.</p>
        </div>
        
        {user?.role === 'Admin' && (
          <button 
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
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

      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onProjectCreated={handleProjectSaved}
        projectToEdit={projectToEdit}
      />

      {projects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <FolderKanban className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No projects found</h3>
          <p className="text-slate-500">Get started by creating your first project.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link 
              key={project._id} 
              to={`/projects/${project._id}`}
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-[rgba(170,59,255,0.08)_0px_10px_20px] transition-all group relative"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2">
                  <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-md ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-md ${getPriorityColor(project.priority)}`}>
                    {project.priority}
                  </span>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors line-clamp-1">
                {project.title}
              </h3>
              <p className="text-slate-500 text-sm mb-6 line-clamp-2 min-h-[40px]">
                {project.description}
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-400" />
                    {new Date(project.deadline).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={14} className="text-slate-400" />
                    {project.teamMembers?.length || 0} Members
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5 font-bold">
                    <span className="text-slate-500 uppercase tracking-tight">Progress</span>
                    <span className="text-slate-900">{project.progressPercentage || 0}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                      style={{ width: `${project.progressPercentage || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
