import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckSquare, Users, BarChart2, Zap, Shield, Globe,
  ArrowRight, Star, ChevronRight
} from 'lucide-react';

const features = [
  {
    icon: CheckSquare,
    title: 'Task Management',
    desc: 'Create, assign, and track tasks with a beautiful Kanban board. Never miss a deadline again.',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    desc: 'Invite team members, assign roles, and collaborate seamlessly across projects.',
    color: 'text-purple-500',
    bg: 'bg-purple-50',
  },
  {
    icon: BarChart2,
    title: 'Analytics Dashboard',
    desc: 'Real-time insights on project progress, team performance and overdue tasks at a glance.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
  {
    icon: Zap,
    title: 'Fast & Reliable',
    desc: 'Lightning-fast performance with real-time updates. Built for teams that move quickly.',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
  {
    icon: Shield,
    title: 'Role-Based Access',
    desc: 'Admins control everything. Members see what they need. Secure and structured by design.',
    color: 'text-red-500',
    bg: 'bg-red-50',
  },
  {
    icon: Globe,
    title: 'Work from Anywhere',
    desc: 'Fully responsive design that works perfectly on desktop, tablet, and mobile devices.',
    color: 'text-cyan-500',
    bg: 'bg-cyan-50',
  },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Product Manager, Acme Inc.',
    text: 'TaskMgr transformed how our team works. We went from chaos to clarity in just one week. Absolutely love it!',
    rating: 5,
    avatar: 'S',
  },
  {
    name: 'Michael Chen',
    role: 'Engineering Lead, TechCorp',
    text: 'The Kanban board and analytics dashboard are exactly what we needed. Our productivity increased by 40%.',
    rating: 5,
    avatar: 'M',
  },
  {
    name: 'Emily Davis',
    role: 'Freelancer & Team Lead',
    text: 'Finally a project management tool that doesn\'t get in the way. Clean, fast, and powerful.',
    rating: 5,
    avatar: 'E',
  },
];

const stats = [
  { value: '10,000+', label: 'Active Users' },
  { value: '500+', label: 'Teams Onboarded' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '40%', label: 'Productivity Boost' },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <CheckSquare className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">TaskMgr</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Features</a>
              <a href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Testimonials</a>
              <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Pricing</a>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-slate-50">
                Sign In
              </Link>
              <Link to="/signup" className="text-sm font-medium text-white px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-gradient min-h-screen flex items-center pt-16 overflow-hidden relative">
        {/* BG blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full opacity-20 blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200 rounded-full opacity-20 blur-3xl animate-float-delay"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-sm font-medium mb-8 animate-slide-up">
              <Zap size={14} className="text-blue-500" />
              Built for modern teams — Free to get started
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
              Manage Your Team's{' '}
              <span className="gradient-text">Projects & Tasks</span>{' '}
              Like a Pro
            </h1>

            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              TaskMgr is a powerful SaaS platform for teams to collaborate, track projects, assign tasks, and ship faster — all in one beautiful dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold text-lg hover:opacity-90 transition-all shadow-xl shadow-primary/30"
              >
                Start for Free <ArrowRight size={20} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-slate-800 font-semibold text-lg border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
              >
                Sign In <ChevronRight size={20} />
              </Link>
            </div>

            <p className="text-slate-500 text-sm mt-6">
              No credit card required · Free forever for small teams
            </p>
          </div>

          {/* Dashboard Preview Card */}
          <div className="mt-20 relative mx-auto max-w-5xl">
            <div className="glass rounded-2xl border border-white/60 shadow-2xl shadow-slate-200 overflow-hidden p-6">
              {/* Mini dashboard mockup */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Projects', val: '12', color: 'from-blue-500 to-blue-600' },
                  { label: 'Total Tasks', val: '48', color: 'from-purple-500 to-purple-600' },
                  { label: 'Completed', val: '31', color: 'from-emerald-500 to-emerald-600' },
                  { label: 'Overdue', val: '4', color: 'from-red-500 to-red-600' },
                ].map((s) => (
                  <div key={s.label} className={`bg-gradient-to-br ${s.color} text-white p-4 rounded-xl`}>
                    <p className="text-xs opacity-80 mb-1">{s.label}</p>
                    <p className="text-2xl font-bold">{s.val}</p>
                  </div>
                ))}
              </div>
              {/* Fake Kanban preview */}
              <div className="grid grid-cols-4 gap-3">
                {['Todo', 'In Progress', 'Review', 'Completed'].map((col, ci) => (
                  <div key={col} className="bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-600">{col}</span>
                      <span className="text-xs bg-white text-slate-500 rounded-md px-1.5 py-0.5 border">{ci + 2}</span>
                    </div>
                    {[1, 2].map(i => (
                      <div key={i} className="bg-white rounded-lg p-2.5 mb-2 border border-slate-100 shadow-sm">
                        <div className={`h-1.5 w-16 rounded-full mb-2 ${['bg-blue-400', 'bg-purple-400', 'bg-amber-400', 'bg-emerald-400'][ci]}`}></div>
                        <div className="h-2 bg-slate-100 rounded w-full mb-1"></div>
                        <div className="h-2 bg-slate-100 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-primary to-accent py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
            {stats.map(s => (
              <div key={s.label}>
                <p className="text-4xl font-extrabold mb-2">{s.value}</p>
                <p className="text-blue-100 text-sm font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">Features</span>
            <h2 className="text-4xl font-extrabold text-slate-900 mt-3 mb-4">Everything Your Team Needs</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              All the tools you need to manage projects, track tasks, and collaborate with your team — in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="p-8 rounded-2xl border border-slate-100 card-hover bg-white shadow-sm">
                  <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-5`}>
                    <Icon className={`h-6 w-6 ${f.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-widest">Testimonials</span>
            <h2 className="text-4xl font-extrabold text-slate-900 mt-3 mb-4">Loved by Teams Worldwide</h2>
            <p className="text-slate-600 text-lg max-w-xl mx-auto">See what our users say about TaskMgr.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="glass p-8 rounded-2xl shadow-sm card-hover">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="py-24 bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-extrabold text-white mb-6">
            Ready to Get{' '}
            <span className="gradient-text">Started?</span>
          </h2>
          <p className="text-slate-300 text-xl mb-10 leading-relaxed">
            Join thousands of teams who ship faster with TaskMgr. Free to start, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold text-lg hover:opacity-90 transition-all shadow-2xl shadow-primary/30"
            >
              Create Free Account <ArrowRight size={20} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 text-white font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <CheckSquare className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-lg">TaskMgr</span>
            </div>
            <p className="text-sm">© {new Date().getFullYear()} TaskMgr. Built with ❤️ for productive teams.</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
