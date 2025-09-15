import React from 'react';
import { FileEdit } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 whitespace-nowrap">
      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
        <FileEdit className="w-5 h-5 text-mind-list-primary-blue" />
      </div>
      <span className="text-2xl font-bold text-white whitespace-nowrap drop-shadow-lg hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300" style={{textShadow: '0 4px 8px rgba(0, 40, 60, 0.8)'}}>MIND LIST</span>
    </div>
  );
}