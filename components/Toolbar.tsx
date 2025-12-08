import React from 'react';
import { 
  ArrowDownTrayIcon,
  ArrowPathIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface ToolbarProps {
  onExport: () => void;
  onAutoFormat: () => void;
  isGenerating: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({ 
  onExport,
  onAutoFormat,
  isGenerating
}) => {
  return (
    <header className="h-14 flex items-center justify-between px-6 z-10 sticky top-0 print:hidden" style={{ backgroundColor: '#22333B' }}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold font-mono shadow-md" style={{ backgroundColor: '#5E503F' }}>M</div>
        <h1 className="font-semibold text-lg" style={{ color: '#F2F4F3' }}>MarkFlow</h1>
        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#5E503F', color: '#F2F4F3' }}>MD → PDF</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onAutoFormat}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
          style={{ backgroundColor: '#A9927D', color: '#0A0908' }}
        >
          {isGenerating ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <SparklesIcon className="w-4 h-4" />}
          Auto Format
        </button>
        
        <button
          onClick={onExport}
          disabled={isGenerating}
          className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
          style={{ backgroundColor: '#5E503F', color: '#F2F4F3' }}
        >
          {isGenerating ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <ArrowDownTrayIcon className="w-4 h-4" />}
          Download PDF
        </button>
      </div>
    </header>
  );
};