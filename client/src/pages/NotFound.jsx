import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Compass, AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full text-center"
      >
        <div className="relative inline-block mb-10">
          <div className="text-[180px] font-black text-slate-900/5 leading-none select-none tracking-tighter">
            404
          </div>
          <motion.div 
            animate={{ 
              rotate: [0, 10, -10, 0],
              y: [0, -10, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Compass size={100} className="text-accent drop-shadow-2xl" />
          </motion.div>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter italic mb-4">
          Coordinates <span className="gradient-text">Lost</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg italic mb-10 max-w-lg mx-auto">
          The quadrant you are attempting to access does not exist or has been relocated within the grid.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/" className="btn-primary w-full sm:w-auto">
            <ArrowLeft size={20} /> Back to Command Center
          </Link>
          <button className="btn-secondary w-full sm:w-auto flex items-center gap-2">
            <AlertCircle size={20} /> Report Anomaly
          </button>
        </div>

        <div className="mt-20 pt-10 border-t border-slate-200">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
            TaskMgr Protocol Alpha // Unauthorized Access Detected
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
