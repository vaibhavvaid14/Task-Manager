import React, { useState, useContext } from 'react';
import { User, Mail, Shield, Camera, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await api.put(`/users/${user._id}`, { name });
      // Update local storage and context
      const updatedUser = { ...user, name: data.name || name };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-600 mt-1">Manage your account information.</p>
      </div>

      {/* Avatar Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <button className="absolute bottom-0 right-0 bg-white border border-slate-200 text-slate-600 rounded-full p-1.5 shadow-sm hover:bg-slate-50 transition-colors">
            <Camera size={14} />
          </button>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
          <p className="text-slate-500 text-sm">{user?.email}</p>
          <span className={`mt-2 inline-block px-2.5 py-1 text-xs font-semibold rounded-full 
            ${user?.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}
          >
            {user?.role}
          </span>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Edit Information</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                value={email}
                disabled
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed outline-none"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">Email address cannot be changed.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Shield className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={user?.role}
                disabled
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting && <Loader2 className="animate-spin h-4 w-4" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
