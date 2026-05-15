import React, { useState, useEffect, useContext } from 'react';
import { Users, Mail, Shield, UserPlus, Loader2, Trash2, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Team = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data.data || data);
    } catch (error) {
      toast.error('Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (userId === currentUser._id) {
      toast.error("You cannot delete yourself!");
      return;
    }

    if (!window.confirm('Are you sure you want to remove this team member?')) return;

    try {
      await api.delete(`/users/${userId}`);
      toast.success('User removed successfully');
      setUsers(users.filter(u => u._id !== userId));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove user');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team Members</h1>
          <p className="text-slate-600 mt-1">Manage your organization's members and their roles.</p>
        </div>
        
        {currentUser?.role === 'Admin' && (
          <button 
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            onClick={() => toast.success('Invite system coming soon!')}
          >
            <UserPlus size={20} />
            Invite Member
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="font-medium p-4 pl-6">Member</th>
                <th className="font-medium p-4">Email</th>
                <th className="font-medium p-4">Role</th>
                <th className="font-medium p-4">Joined</th>
                <th className="font-medium p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-900">{user.name}</span>
                      {user._id === currentUser._id && (
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase">You</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Mail size={14} className="text-slate-400" />
                      {user.email}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full 
                      ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}
                    >
                      <Shield size={12} />
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-500">
                    {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    {currentUser?.role === 'Admin' && user._id !== currentUser._id ? (
                      <button 
                        onClick={() => handleDeleteUser(user._id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove Member"
                      >
                        <Trash2 size={18} />
                      </button>
                    ) : (
                      <button className="p-2 text-slate-300 cursor-not-allowed">
                        <MoreVertical size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Team;
