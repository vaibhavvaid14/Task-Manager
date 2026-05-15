import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const CreateTaskModal = ({ isOpen, onClose, onTaskCreated, projectId = null, taskToEdit = null }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Todo');
  const [assignedUser, setAssignedUser] = useState('');
  const [project, setProject] = useState(projectId || '');

  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchData();
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description);
        const date = new Date(taskToEdit.dueDate);
        setDueDate(date.toISOString().split('T')[0]);
        setPriority(taskToEdit.priority);
        setStatus(taskToEdit.status);
        setAssignedUser(taskToEdit.assignedUser?._id || taskToEdit.assignedUser || '');
        setProject(taskToEdit.project?._id || taskToEdit.project || '');
      } else {
        resetForm();
        if (projectId) setProject(projectId);
      }
    }
  }, [isOpen, taskToEdit, projectId]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('Medium');
    setStatus('Todo');
    setAssignedUser('');
    setProject(projectId || '');
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, projectsRes] = await Promise.all([
        api.get('/users'),
        api.get('/projects')
      ]);
      setUsers(usersRes.data.data || usersRes.data);
      setProjects(projectsRes.data.data || projectsRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !dueDate || !project) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const taskData = {
        title,
        description,
        dueDate,
        priority,
        status,
        project,
        assignedUser: assignedUser || null
      };

      if (taskToEdit) {
        const { data } = await api.put(`/tasks/${taskToEdit._id}`, taskData);
        toast.success('Task updated successfully');
        onTaskCreated(data); // "onTaskUpdated"
      } else {
        const { data } = await api.post('/tasks', taskData);
        toast.success('Task created successfully');
        onTaskCreated(data);
      }
      handleClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={taskToEdit ? "Edit Task" : "Create New Task"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="animate-spin h-10 w-10 text-accent" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Workspace...</p>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Task Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none transition-all font-medium text-slate-700 bg-slate-50/50"
                placeholder="e.g. Design homepage mockup"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none transition-all font-medium text-slate-700 bg-slate-50/50 min-h-[100px]"
                placeholder="What needs to be done?"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
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

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none transition-all font-medium text-slate-700 bg-slate-50/50 appearance-none"
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Assign To</label>
                <select
                  value={assignedUser}
                  onChange={(e) => setAssignedUser(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none transition-all font-medium text-slate-700 bg-slate-50/50 appearance-none"
                >
                  <option value="">Unassigned</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>{u.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {!projectId && (
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Project</label>
                <select
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none transition-all font-medium text-slate-700 bg-slate-50/50 appearance-none"
                  required
                >
                  <option value="">Select a project...</option>
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>{p.title}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="pt-6 flex justify-end gap-3 border-t border-slate-50 mt-6">
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
                {taskToEdit ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </>
        )}
      </form>
    </Modal>
  );
};

export default CreateTaskModal;
