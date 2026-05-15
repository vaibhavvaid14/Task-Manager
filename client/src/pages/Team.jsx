import React, { useState, useEffect, useContext } from 'react';
import { 
  Users, Mail, Shield, UserPlus, Loader2, Trash2, 
  MoreVertical, Search, Filter, ShieldCheck, UserCheck,
  Calendar, ArrowUpRight, Award, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Team = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
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
      toast.error("You cannot terminate your own access!");
      return;
    }

    if (!window.confirm('Are you sure you want to remove this operative?')) return;

    try {
      await api.delete(`/users/${userId}`);
      toast.success('Operative removed from workspace');
      setUsers(users.filter(u => u._id !== userId));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Removal failed');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full min-h-[400px] gap-4">
        <div className="relative">
          <Loader2 className="animate-spin h-12 w-12 text-accent" />
          <div className="absolute inset-0 blur-xl bg-accent/20 animate-pulse" />
        </div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Operatives...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter italic mb-2">
            Team <span className="gradient-text">Force</span>
          </h1>
          <p className="text-slate-500 font-medium italic flex items-center gap-2">
            <Users size={16} /> Manage {users.length} active workspace operatives.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search operatives..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none transition-all font-medium text-sm"
            />
          </div>
          {currentUser?.role === 'Admin' && (
            <button 
              className="btn-primary"
              onClick={() => toast.success('Protocol: Invitation system is pending deployment.')}
            >
              <UserPlus size={20} />
              Invite Member
            </button>
          )}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-premium bg-white overflow-hidden"
      >
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-50">
                <th className="p-8">Operative</th>
                <th className="p-8">Credential</th>
                <th className="p-8">Authorization</th>
                <th className="p-8">Activation</th>
                <th className="p-8 text-right">Directives</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user, i) => (
                <motion.tr 
                  key={user._id} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group hover:bg-slate-50/50 transition-all duration-300"
                >
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-accent to-primary bg-[length:200%_100%] animate-shimmer flex items-center justify-center text-white text-lg font-black italic shadow-lg border-2 border-white group-hover:scale-110 transition-transform">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        {user._id === currentUser._id && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 tracking-tight group-hover:text-accent transition-colors flex items-center gap-2">
                          {user.name}
                          {user._id === currentUser._id && (
                            <span className="text-[9px] bg-slate-900 text-white px-2 py-0.5 rounded-lg font-black uppercase tracking-widest italic">You</span>
                          )}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {user._id.slice(-6)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex items-center gap-2 font-bold text-slate-600 italic tracking-tight">
                      <Mail size={14} className="text-slate-300" />
                      {user.email}
                    </div>
                  </td>
                  <td className="p-8">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-sm border
                      ${user.role === 'Admin' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}
                    >
                      {user.role === 'Admin' ? <ShieldCheck size={12} /> : <UserCheck size={12} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="p-8">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 italic">
                      <Calendar size={14} />
                      {new Date(user.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="p-8 text-right">
                    {currentUser?.role === 'Admin' && user._id !== currentUser._id ? (
                      <button 
                        onClick={() => handleDeleteUser(user._id)}
                        className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all group/btn"
                        title="Revoke Access"
                      >
                        <Trash2 size={20} className="group-hover/btn:rotate-12 transition-transform" />
                      </button>
                    ) : (
                      <div className="flex justify-end pr-3">
                         <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-200">
                           <Zap size={18} />
                         </div>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Team Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Active Force', value: users.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Privileged Access', value: users.filter(u => u.role === 'Admin').length, icon: Shield, color: 'text-purple-500', bg: 'bg-purple-50' },
          { label: 'Performance Metric', value: '98%', icon: Award, color: 'text-emerald-500', bg: 'bg-emerald-50' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + (i * 0.1) }}
            className="card-premium p-6 bg-white flex items-center gap-6"
          >
            <div className={`p-4 rounded-2xl ${stat.bg}`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900 tracking-tighter italic">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Team;
