import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Users, Loader2, ArrowLeft, MoreVertical, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import CreateTaskModal from '../components/tasks/CreateTaskModal';

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
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-bold text-slate-900">Project not found</h3>
        <Link to="/projects" className="text-primary hover:underline mt-2 inline-block">Back to Projects</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link to="/projects" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 mb-2 transition-colors">
            <ArrowLeft size={16} /> Back to Projects
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">{project.title}</h1>
          <p className="text-slate-600 mt-1 max-w-2xl">{project.description}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-medium transition-colors">
            Edit Project
          </button>
          <button
            onClick={() => setShowTaskModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium transition-colors flex items-center gap-2"
          >
            <Plus size={18} /> Add Task
          </button>
        </div>
      </div>

      <CreateTaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        projectId={id}
        onTaskCreated={(newTask) => setTasks(prev => [...prev, newTask])}
      />

      {/* Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm col-span-2">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Project Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <span className="text-slate-500">Status</span>
              <span className="font-medium text-slate-900">{project.status}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <span className="text-slate-500">Priority</span>
              <span className="font-medium text-slate-900">{project.priority}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <span className="text-slate-500">Deadline</span>
              <div className="flex items-center gap-2 font-medium text-slate-900">
                <Calendar size={18} className="text-slate-400" />
                {new Date(project.deadline).toLocaleDateString()}
              </div>
            </div>
            <div className="pt-2">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-slate-700">Overall Progress</span>
                <span className="text-slate-500">{project.progressPercentage || 0}%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent transition-all duration-500"
                  style={{ width: `${project.progressPercentage || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Users size={20} className="text-slate-400" /> Team Members
          </h3>
          {project.teamMembers?.length > 0 ? (
            <ul className="space-y-3">
              {project.teamMembers.map(member => (
                <li key={member._id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{member.name}</p>
                    <p className="text-xs text-slate-500">{member.email}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No members assigned.</p>
          )}
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">Project Tasks</h3>
          <span className="bg-slate-100 text-slate-600 py-1 px-3 rounded-full text-sm font-medium">
            {tasks.length} Total
          </span>
        </div>
        
        {tasks.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-500">No tasks created for this project yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                  <th className="font-medium p-4 pl-6">Task Title</th>
                  <th className="font-medium p-4">Assigned To</th>
                  <th className="font-medium p-4">Status</th>
                  <th className="font-medium p-4">Priority</th>
                  <th className="font-medium p-4">Due Date</th>
                  <th className="font-medium p-4 pr-6"></th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 pl-6 font-medium text-slate-900">{task.title}</td>
                    <td className="p-4 text-sm text-slate-600">
                      {task.assignedUser ? task.assignedUser.name : 'Unassigned'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full 
                        ${task.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 
                          task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 
                          'bg-slate-100 text-slate-700'}`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600">{task.priority}</td>
                    <td className="p-4 text-sm text-slate-600">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button className="text-slate-400 hover:text-slate-600">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
