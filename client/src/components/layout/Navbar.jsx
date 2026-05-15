import React, { useContext, useState } from 'react';
import { LogOut, Menu, User, Bell, Search, ChevronDown } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 glass border-b border-slate-200/50 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-6 flex-1">
        <button className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
          <Menu size={20} />
        </button>
        
        <div className="hidden md:flex items-center gap-3 bg-slate-100/50 border border-slate-200/50 px-3.5 py-1.5 rounded-xl w-full max-w-md focus-within:bg-white focus-within:border-accent/30 focus-within:shadow-sm transition-all duration-300">
          <Search size={16} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search tasks, projects..." 
            className="bg-transparent border-none outline-none text-sm text-slate-600 w-full placeholder:text-slate-400 placeholder:font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors group">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-white" />
        </button>

        <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block" />

        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-all duration-300 group"
          >
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-bold text-xs shadow-sm group-hover:scale-105 transition-transform">
              {user?.name?.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-none mb-0.5">{user?.name}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Admin</p>
            </div>
            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-0" 
                  onClick={() => setIsDropdownOpen(false)}
                />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-10"
                >
                  <div className="p-4 bg-slate-50/50 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors font-semibold group">
                      <User size={18} className="text-slate-400 group-hover:text-accent transition-colors" />
                      View Profile
                    </button>
                    <div className="h-px bg-slate-100 my-1 mx-2" />
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-semibold group"
                    >
                      <LogOut size={18} className="text-red-400 group-hover:text-red-600 transition-colors" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
