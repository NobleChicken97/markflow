import React, { useRef } from 'react';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.md') && !file.name.endsWith('.markdown') && !file.name.endsWith('.txt')) {
        alert('Please upload a Markdown (.md) or text (.txt) file');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onChange(content);
      };
      reader.readAsText(file);
    }
    // Reset input so same file can be uploaded again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Markdown Input</h2>
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.markdown,.txt"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer transition-colors border border-slate-200"
          >
            <ArrowUpTrayIcon className="w-4 h-4" />
            Upload .md
          </label>
          <span className="text-xs text-slate-400">Auto-saving...</span>
        </div>
      </div>
      <textarea
        className="flex-1 w-full p-6 resize-none outline-none font-mono text-sm text-slate-800 leading-relaxed"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="# Start typing your document here..."
        spellCheck={false}
      />
    </div>
  );
};