"use client";

import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export default function TextArea({ label, className = '', ...props }: TextAreaProps) {
  return (
    <div className="w-full flex flex-col gap-2">
      <label className="text-sm font-semibold text-foreground">{label}</label>
      <div className="relative group">
        <textarea 
          className={`w-full min-h-[192px] p-4 rounded-xl border border-border bg-background text-foreground shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 resize-y ${className}`}
          {...props}
        />
        <div className="absolute inset-0 rounded-xl pointer-events-none border border-transparent group-hover:border-border/80 transition-colors" />
      </div>
    </div>
  );
}
