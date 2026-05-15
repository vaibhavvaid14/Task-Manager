import React, { useState, useContext } from 'react';
import { 
  User, Mail, Shield, Camera, Loader2, Key, Bell, 
  Settings, ExternalLink, ShieldCheck, Fingerprint, LogOut
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

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
      const updatedUser = { ...user, name: data.name || name };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      toast.success('Identity profile synchronized');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Synchronization failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-10 pb-20"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter italic mb-2">
            Account <span className="gradient-text">Settings</span>
          </h1>
          <p className="text-slate-500 font-medium italic">Manage your professional identity and workspace preferences.</p>
        </div>
        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all border border-transparent hover:border-red-100">
          <LogOut size={14} /> Terminate Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Navigation Sidebar */}
        <div className="space-y-2">
          {[
            { icon: User, label: 'Public Profile', active: true },
            { icon: ShieldCheck, label: 'Security & Access' },
            { icon: Bell, label: 'Notifications' },
            { icon: Settings, label: 'Preferences' },
            { icon: ExternalLink, label: 'Integrations' }
          ].map((item, i) => (
            <button 
              key={i}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold italic tracking-tight ${
                item.active 
                ? 'bg-white text-accent shadow-[0_10px_20px_rgba(0,0,0,0.02)] border border-slate-100 scale-105' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Avatar Section */}
          <div className="card-premium p-8 bg-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-150 transition-transform duration-700" />
            
            <div className="flex items-center gap-8 relative z-10">
              <div className="relative">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary via-accent to-primary bg-[length:200%_100%] animate-shimmer flex items-center justify-center text-white text-4xl font-black italic shadow-2xl shadow-accent/20 border-4 border-white group-hover:rotate-6 transition-transform">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <button className="absolute -bottom-2 -right-2 bg-slate-900 text-white rounded-xl p-2 shadow-xl hover:scale-110 transition-all border-2 border-white">
                  <Camera size={16} />
                </button>
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight italic mb-1">{user?.name}</h2>
                <p className="text-slate-400 font-medium mb-3 italic">{user?.email}</p>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm border ${
                    user?.role === 'Admin' 
                    ? 'bg-purple-50 text-purple-600 border-purple-100' 
                    : 'bg-blue-50 text-blue-600 border-blue-100'
                  }`}>
                    {user?.role} Access
                  </span>
                  <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm bg-slate-50 text-slate-400 border border-slate-100">
                    Verified ID
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="card-premium p-8 bg-white">
            <div className="flex items-center gap-3 mb-8">
              <Fingerprint className="text-accent" size={20} />
              <h3 className="text-lg font-black text-slate-900 tracking-tight italic uppercase">Identity Management</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Legal Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-300 group-focus-within:text-accent transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none transition-all font-bold text-slate-700 italic tracking-tight"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Workspace Email</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-300" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 cursor-not-allowed outline-none font-bold italic tracking-tight"
                    />
                  </div>
                  <p className="text-[10px] font-bold text-slate-300 mt-2 px-1 italic">Contact system administrator to modify organizational email.</p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary group"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    <Shield size={18} className="group-hover:rotate-12 transition-transform" />
                  )}
                  Synchronize Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
