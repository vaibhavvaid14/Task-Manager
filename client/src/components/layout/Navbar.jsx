import React, { useContext } from 'react';
import { LogOut, Menu, User } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg">
          <Menu size={24} />
        </button>
        {/* We can put breadcrumbs or page title here dynamically later */}
        <h2 className="text-lg font-semibold text-slate-800 hidden sm:block">Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative group cursor-pointer">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors">
            <User size={20} className="text-slate-600" />
            <span className="text-sm font-medium text-slate-700 hidden sm:block">{user?.name}</span>
          </div>
          
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <div className="p-2">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
