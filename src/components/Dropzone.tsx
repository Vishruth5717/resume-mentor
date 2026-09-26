"use client";

import React, { useState } from 'react';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';

interface DropzoneProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export default function Dropzone({ file, onFileChange }: DropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <label className="text-sm font-semibold text-foreground">Resume (PDF)</label>
      <div 
        className={`relative w-full h-48 rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-6 text-center overflow-hidden
          ${isDragActive ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border bg-muted/30 hover:bg-muted/50 hover:border-primary/50'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          accept=".pdf"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
          onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        />
        
        {file ? (
          <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-300">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <FileIcon size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-foreground truncate max-w-[200px]">{file.name}</span>
              <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
            <button 
              className="absolute top-3 right-3 p-1.5 rounded-full bg-background border border-border text-muted-foreground hover:text-red-500 hover:border-red-500/50 transition-colors z-20"
              onClick={(e) => { e.preventDefault(); onFileChange(null); }}
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${isDragActive ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground shadow-sm'}`}>
              <UploadCloud size={24} className={isDragActive ? 'animate-bounce' : ''} />
            </div>
            <div>
              <p className="font-medium text-foreground">Click to upload or drag and drop</p>
              <p className="text-sm text-muted-foreground mt-1">PDF only (max. 5MB)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
