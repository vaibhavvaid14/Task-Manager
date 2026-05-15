import React from 'react';
import { motion } from 'framer-motion';

const Skeleton = ({ className }) => {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      className={`bg-slate-200 rounded-lg ${className}`}
    />
  );
};

export const CardSkeleton = () => (
  <div className="card-premium p-6 space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="w-12 h-12 rounded-2xl" />
      <Skeleton className="w-20 h-4 rounded-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="w-32 h-3 rounded-full" />
      <Skeleton className="w-48 h-8 rounded-lg" />
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <div className="flex items-center gap-4 p-6 border-b border-slate-50">
    <Skeleton className="w-12 h-12 rounded-2xl" />
    <div className="flex-1 space-y-2">
      <Skeleton className="w-1/3 h-4" />
      <Skeleton className="w-1/4 h-3" />
    </div>
    <Skeleton className="w-24 h-6" />
    <Skeleton className="w-24 h-4" />
  </div>
);

export default Skeleton;
