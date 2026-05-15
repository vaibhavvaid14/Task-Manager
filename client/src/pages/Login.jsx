import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight, CheckSquare, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your email and password');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Invalid email or password';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 overflow-hidden relative">
      {/* Decorative BG */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-8 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">TaskMgr</span>
          </Link>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Welcome Back</h2>
          <p className="text-slate-500 font-medium italic">
            Enter your credentials to manage your workflow.
          </p>
        </div>

        <div className="card-premium p-8 sm:p-10 bg-white shadow-2xl shadow-slate-200/50">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-300 group-focus-within:text-accent transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3.5 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none transition-all font-medium text-slate-700 bg-slate-50/50 placeholder:text-slate-300"
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                  <a href="#" className="text-xs font-bold text-accent hover:underline">
                    Forgot?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-300 group-focus-within:text-accent transition-colors" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3.5 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none transition-all font-medium text-slate-700 bg-slate-50/50 placeholder:text-slate-300"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-4 text-base shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-transform"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="animate-spin h-5 w-5" /> Validating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Sign In to Dashboard <ArrowRight size={20} />
                </div>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-sm text-slate-500 font-medium">
              New to TaskMgr?{' '}
              <Link to="/signup" className="font-bold text-accent hover:underline decoration-2 underline-offset-4 transition-all">
                Create Free Account
              </Link>
            </p>
          </div>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-4 text-slate-300">
          <Zap size={16} />
          <p className="text-[10px] font-bold uppercase tracking-widest">Enterprise-grade security built-in</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
