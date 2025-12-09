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
    <header className="h-12 sm:h-14 flex items-center justify-between px-3 sm:px-6 z-10 sticky top-0 print:hidden" style={{ backgroundColor: '#22333B' }}>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white font-bold font-mono shadow-md text-sm sm:text-base" style={{ backgroundColor: '#5E503F' }}>M</div>
        <h1 className="font-semibold text-base sm:text-lg" style={{ color: '#F2F4F3' }}>MarkFlow</h1>
        <span className="hidden sm:inline text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#5E503F', color: '#F2F4F3' }}>MD → PDF</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onAutoFormat}
          disabled={isGenerating}
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
          style={{ backgroundColor: '#A9927D', color: '#0A0908' }}
          title="Auto Format"
        >
          {isGenerating ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <SparklesIcon className="w-4 h-4" />}
          <span className="hidden sm:inline">Auto Format</span>
        </button>
        
        <button
          onClick={onExport}
          disabled={isGenerating}
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
          style={{ backgroundColor: '#5E503F', color: '#F2F4F3' }}
          title="Download PDF"
        >
          {isGenerating ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <ArrowDownTrayIcon className="w-4 h-4" />}
          <span className="hidden sm:inline">Download PDF</span>
        </button>
      </div>
    </header>
  );
};