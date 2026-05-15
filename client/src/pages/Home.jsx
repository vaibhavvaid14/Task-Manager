import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckSquare, Users, BarChart2, Zap, Shield, Globe,
  ArrowRight, Star, ChevronRight, Play, Layout, Rocket
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

const features = [
  {
    icon: Layout,
    title: 'Intuitive Kanban',
    desc: 'Visualize your workflow with our advanced Kanban boards. Drag, drop, and deliver faster than ever.',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    icon: Users,
    title: 'Team Dynamics',
    desc: 'Empower your team with role-based permissions, collaborative comments, and real-time activity feeds.',
    color: 'text-indigo-500',
    bg: 'bg-indigo-50',
  },
  {
    icon: BarChart2,
    title: 'Deep Analytics',
    desc: 'Data-driven insights to optimize your team\'s performance and identify bottlenecks before they happen.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
  {
    icon: Rocket,
    title: 'Rapid Deployment',
    desc: 'Built for speed. Our platform ensures lightning-fast updates and zero downtime for your critical projects.',
    color: 'text-purple-500',
    bg: 'bg-purple-50',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    desc: 'Bank-grade encryption and secure access controls to keep your proprietary project data safe.',
    color: 'text-slate-700',
    bg: 'bg-slate-100',
  },
  {
    icon: Zap,
    title: 'Smart Automation',
    desc: 'Automate repetitive tasks and focus on what matters most — building great products.',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-white selection:bg-accent/20">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <CheckSquare className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900">
                Task<span className="gradient-text">Mgr</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-10">
              {['Features', 'Testimonials', 'Pricing'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="text-sm font-bold text-slate-500 hover:text-accent transition-colors tracking-tight"
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Link to="/login" className="hidden sm:block text-sm font-bold text-slate-600 hover:text-primary transition-colors px-4 py-2">
                Sign In
              </Link>
              <Link to="/signup" className="btn-primary py-2.5">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100/40 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-accent/5 border border-accent/10 rounded-full text-accent text-xs font-bold uppercase tracking-widest mb-10 animate-pulse-soft">
              <Zap size={14} className="fill-accent" />
              Version 2.0 is now live
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 mb-8 leading-[0.95]">
              Streamline your <br />
              <span className="gradient-text">Workflow</span> with Ease
            </h1>

            <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
              TaskMgr is the next-generation project management platform for high-performance teams. Build, track, and ship products faster.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link to="/signup" className="btn-primary px-10 py-5 text-lg group">
                Get Started Free 
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="btn-secondary px-10 py-5 text-lg">
                <Play className="fill-slate-900 size-4" />
                Watch Demo
              </button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 grayscale opacity-40">
              <div className="font-bold text-2xl tracking-tighter">VERCEL</div>
              <div className="font-bold text-2xl tracking-tighter">stripe</div>
              <div className="font-bold text-2xl tracking-tighter">Linear</div>
              <div className="font-bold text-2xl tracking-tighter">ClickUp</div>
            </div>
          </motion.div>

          {/* Product Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="mt-24 relative"
          >
            <div className="absolute inset-0 bg-accent/20 blur-[100px] -z-10 rounded-full scale-90" />
            <div className="card-premium p-2 bg-slate-50/50 border-white shadow-2xl overflow-hidden group">
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-inner aspect-[16/9] flex items-center justify-center">
                <div className="text-center p-10">
                  <div className="w-20 h-20 bg-accent/5 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Layout className="text-accent size-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Interactive Dashboard Preview</h3>
                  <p className="text-slate-500 font-medium">Coming soon: A fully interactive visual editor for your projects.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-6">
              Everything you need to <br />
              <span className="text-accent">scale your team</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
              TaskMgr combines simple UI with complex project management features to provide a seamless experience.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((f, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                className="card-premium p-8 group"
              >
                <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm`}>
                  <f.icon className={`size-7 ${f.color}`} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium text-sm">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 overflow-hidden relative">
        <div className="absolute inset-0 bg-primary -z-10" />
        <div className="absolute top-0 right-0 w-[50%] h-full bg-accent/20 blur-[150px] -z-10 rounded-full translate-x-1/2" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl sm:text-6xl font-black tracking-tight mb-8">
              Join the future of <br />
              <span className="text-accent">productivity</span>
            </h2>
            <p className="text-xl text-blue-100/70 mb-12 max-w-2xl mx-auto font-medium">
              Start managing your projects like a pro today. No credit card required, free forever for small teams.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link to="/signup" className="btn-primary bg-white text-primary px-12 py-5 text-xl shadow-white/10 hover:shadow-white/20">
                Create Free Account
              </Link>
              <button className="px-12 py-5 text-xl font-bold border border-white/20 rounded-2xl hover:bg-white/5 transition-all">
                Contact Sales
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 bg-white border-t border-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-8">
                <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/10">
                  <CheckSquare className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-slate-900">Task<span className="gradient-text">Mgr</span></span>
              </div>
              <p className="text-slate-500 font-medium max-w-sm leading-relaxed italic mb-8">
                The high-performance workspace for elite teams. Architected for speed, security, and global collaboration.
              </p>
              <div className="flex gap-4">
                {['Twitter', 'GitHub', 'Discord', 'LinkedIn'].map((social) => (
                  <button key={social} className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-accent hover:bg-accent/5 hover:border-accent/20 transition-all">
                    <Globe size={18} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6">Product</h4>
              <ul className="space-y-4">
                {['Intelligence', 'Kanban Force', 'Team Metrics', 'Integrations'].map(item => (
                  <li key={item}><a href="#" className="text-sm font-bold text-slate-400 hover:text-accent transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6">Company</h4>
              <ul className="space-y-4">
                {['About Us', 'Operatives', 'Security', 'Manifesto'].map(item => (
                  <li key={item}><a href="#" className="text-sm font-bold text-slate-400 hover:text-accent transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6">Legal</h4>
              <ul className="space-y-4">
                {['Privacy Policy', 'Terms of Access', 'Cookie Protocol', 'Compliance'].map(item => (
                  <li key={item}><a href="#" className="text-sm font-bold text-slate-400 hover:text-accent transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="pt-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">
              © {new Date().getFullYear()} TaskMgr Global Systems Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-8">
              <span className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> All Systems Nominal
              </span>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">
                Deployed via Railway Protocol
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
