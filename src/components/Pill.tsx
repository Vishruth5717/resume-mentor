import React from 'react';
import { Check, X } from 'lucide-react';

interface PillProps {
  type: 'match' | 'missing';
  label: string;
}

export default function Pill({ type, label }: PillProps) {
  const isMatch = type === 'match';
  
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-transform hover:scale-105 ${
      isMatch 
        ? 'bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20' 
        : 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20'
    }`}>
      {isMatch ? <Check size={14} /> : <X size={14} />}
      {label}
    </div>
  );
}
