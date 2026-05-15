import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Shield, Loader2, CheckCircle2, CheckSquare, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Member'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error creating account. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-20 overflow-hidden relative">
      {/* Decorative BG */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-xl w-full"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-8 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">TaskMgr</span>
          </Link>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Create Account</h2>
          <p className="text-slate-500 font-medium italic">
            Join thousands of teams shipping faster every day.
          </p>
        </div>

        <div className="card-premium p-8 sm:p-10 bg-white shadow-2xl shadow-slate-200/50">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-300 group-focus-within:text-accent transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-3.5 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none transition-all font-medium text-slate-700 bg-slate-50/50 placeholder:text-slate-300"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-300 group-focus-within:text-accent transition-colors" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-3.5 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none transition-all font-medium text-slate-700 bg-slate-50/50 placeholder:text-slate-300"
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-300 group-focus-within:text-accent transition-colors" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-3.5 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none transition-all font-medium text-slate-700 bg-slate-50/50 placeholder:text-slate-300"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Confirm</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <CheckCircle2 className="h-5 w-5 text-slate-300 group-focus-within:text-accent transition-colors" />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-3.5 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none transition-all font-medium text-slate-700 bg-slate-50/50 placeholder:text-slate-300"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Your Role</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-slate-300 group-focus-within:text-accent transition-colors" />
                  </div>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-3.5 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none transition-all font-medium text-slate-700 bg-slate-50/50 appearance-none"
                  >
                    <option value="Member">Team Member</option>
                    <option value="Admin">Administrator</option>
                  </select>
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
                  <Loader2 className="animate-spin h-5 w-5" /> Creating Account...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Get Started Now <ArrowRight size={20} />
                </div>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-accent hover:underline decoration-2 underline-offset-4 transition-all">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
