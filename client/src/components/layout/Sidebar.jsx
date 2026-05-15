import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, FolderKanban, CheckSquare, Users, BarChart2, Settings, ChevronRight } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Team', path: '/team', icon: Users },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Profile', path: '/profile', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col h-full sticky top-0 z-20">
      <div className="h-16 flex items-center px-6 border-b border-slate-100/60">
        <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Task<span className="gradient-text">Mgr</span>
          </span>
        </NavLink>
      </div>

      <div className="flex-1 py-8 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
          Main Menu
        </p>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `group relative flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                  isActive
                    ? 'text-accent'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3.5 relative z-10">
                    <div className={`p-1.5 rounded-lg transition-colors duration-300 ${isActive ? 'bg-accent-soft text-accent' : 'text-slate-400 group-hover:text-slate-600'}`}>
                      <Icon size={18} strokeWidth={2.5} />
                    </div>
                    <span className="text-sm">{link.name}</span>
                  </div>
                  
                  {isActive && (
                    <>
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-accent-soft rounded-xl -z-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                      <ChevronRight size={14} className="text-accent relative z-10" strokeWidth={3} />
                    </>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      <div className="p-4 mt-auto">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-1 opacity-10 group-hover:opacity-20 transition-opacity">
            <div className="w-16 h-16 bg-accent rounded-full -mr-8 -mt-8" />
          </div>
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-bold text-slate-900 shadow-sm border border-slate-100 uppercase tracking-tighter">
              {user?.name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate tracking-tight">{user?.name}</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <p className="text-[10px] text-slate-500 truncate font-bold uppercase tracking-wider">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
