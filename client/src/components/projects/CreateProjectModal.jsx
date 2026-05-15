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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Project Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            placeholder="e.g. Website Redesign"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none min-h-[100px]"
            placeholder="Describe the project..."
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Deadline *</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Team Members</label>
          {isLoadingUsers ? (
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Loader2 className="animate-spin h-4 w-4" /> Loading users...
            </div>
          ) : (
            <div className="max-h-32 overflow-y-auto border border-slate-200 rounded-lg p-2 space-y-1">
              {users.map(u => (
                <label key={u._id} className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={teamMembers.includes(u._id)}
                    onChange={() => handleMemberToggle(u._id)}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-slate-700">{u.name} <span className="text-slate-400 text-xs">({u.role})</span></span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg flex items-center gap-2 transition-colors disabled:opacity-70"
          >
            {isSubmitting && <Loader2 className="animate-spin h-4 w-4" />}
            {projectToEdit ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;
