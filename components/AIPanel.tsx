import React, { useState } from 'react';
import { XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface AIPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onStyleRequest: (prompt: string) => Promise<void>;
  onPolishRequest: (instruction: string) => Promise<void>;
  isProcessing: boolean;
}

export const AIPanel: React.FC<AIPanelProps> = ({ 
  isOpen, 
  onClose, 
  onStyleRequest, 
  onPolishRequest,
  isProcessing 
}) => {
  const [mode, setMode] = useState<'STYLE' | 'POLISH'>('STYLE');
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (mode === 'STYLE') {
      onStyleRequest(input);
    } else {
      onPolishRequest(input);
    }
    setInput('');
  };

  return (
    <div className="fixed right-6 bottom-6 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 print:hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <span className="text-xl">✨</span> AI Assistant
        </h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="p-2 bg-slate-50 flex gap-2 px-4">
        <button
          onClick={() => setMode('STYLE')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
            mode === 'STYLE' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          🎨 Adjust Style
        </button>
        <button
          onClick={() => setMode('POLISH')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
            mode === 'POLISH' ? 'bg-white shadow text-purple-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          ✍️ Improve Content
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto max-h-[300px] bg-white">
        <div className="text-sm text-slate-600 mb-4">
          {mode === 'STYLE' ? (
            <p>Describe how you want to change the look. <br/> <span className="text-slate-400 italic">e.g., "Make headings blue and larger", "Increase line spacing"</span></p>
          ) : (
            <p>How should I improve your text? <br/> <span className="text-slate-400 italic">e.g., "Fix grammar", "Make the tone more professional", "Summarize section 2"</span></p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-100">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing}
            placeholder={mode === 'STYLE' ? "Enter styling instruction..." : "Enter editing instruction..."}
            className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            type="submit"
            disabled={isProcessing || !input.trim()}
            className="absolute right-2 top-2 p-1 text-blue-600 hover:bg-blue-100 rounded-md disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <PaperAirplaneIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};