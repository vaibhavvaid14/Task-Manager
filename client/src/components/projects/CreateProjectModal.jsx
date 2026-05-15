import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const CreateProjectModal = ({ isOpen, onClose, onProjectCreated, projectToEdit = null }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [teamMembers, setTeamMembers] = useState([]);
  
  const [users, setUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      if (projectToEdit) {
        setTitle(projectToEdit.title);
        setDescription(projectToEdit.description);
        // Format date for input[type="date"]
        const date = new Date(projectToEdit.deadline);
        setDeadline(date.toISOString().split('T')[0]);
        setPriority(projectToEdit.priority);
        setTeamMembers(projectToEdit.teamMembers?.map(m => typeof m === 'object' ? m._id : m) || []);
      } else {
        resetForm();
      }
    }
  }, [isOpen, projectToEdit]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDeadline('');
    setPriority('Medium');
    setTeamMembers([]);
  };

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const { data } = await api.get('/users');
      setUsers(data.data || data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !deadline) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const projectData = {
        title,
        description,
        deadline,
        priority,
        teamMembers
      };

      if (projectToEdit) {
        const { data } = await api.put(`/projects/${projectToEdit._id}`, projectData);
        toast.success('Project updated successfully');
        onProjectCreated(data); // In this context it means "onProjectUpdated"
      } else {
        const { data } = await api.post('/projects', projectData);
        toast.success('Project created successfully');
        onProjectCreated(data);
      }
      handleClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleMemberToggle = (userId) => {
    if (teamMembers.includes(userId)) {
      setTeamMembers(teamMembers.filter(id => id !== userId));
    } else {
      setTeamMembers([...teamMembers, userId]);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={projectToEdit ? "Edit Project" : "Create New Project"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Project Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none transition-all font-medium text-slate-700 bg-slate-50/50"
            placeholder="e.g. Website Redesign"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none transition-all font-medium text-slate-700 bg-slate-50/50 min-h-[120px]"
            placeholder="What's this project about?"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-3 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none transition-all font-medium text-slate-700 bg-slate-50/50"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-3 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none transition-all font-medium text-slate-700 bg-slate-50/50 appearance-none"
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Team Members</label>
          {isLoadingUsers ? (
            <div className="flex items-center gap-3 text-slate-400 text-xs font-bold py-4">
              <Loader2 className="animate-spin h-4 w-4" /> Fetching team...
            </div>
          ) : (
            <div className="max-h-40 overflow-y-auto border border-slate-100 rounded-2xl p-3 space-y-1 custom-scrollbar">
              {users.map(u => (
                <label key={u._id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer group transition-colors">
                  <input
                    type="checkbox"
                    checked={teamMembers.includes(u._id)}
                    onChange={() => handleMemberToggle(u._id)}
                    className="w-4 h-4 rounded border-slate-200 text-accent focus:ring-accent transition-all"
                  />
                  <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                    {u.name} <span className="text-slate-400 font-medium ml-1">({u.role})</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="pt-6 flex justify-end gap-3 border-t border-slate-50">
          <button
            type="button"
            onClick={handleClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting && <Loader2 className="animate-spin h-4 w-4" />}
            {projectToEdit ? 'Update Project' : 'Launch Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;
