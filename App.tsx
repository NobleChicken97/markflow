import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { Toolbar } from './components/Toolbar';
import { parseMarkdown, extractFrontMatter } from './services/markdownService';
import { AppTheme, INITIAL_MARKDOWN, DocumentState } from './types';

function App() {
  const [docState, setDocState] = useState<DocumentState>({
    rawMarkdown: INITIAL_MARKDOWN,
    processedHtml: '',
    theme: AppTheme.DEFAULT,
    customCss: '',
    title: 'Untitled',
    isGenerating: false,
    aiPanelOpen: false
  });

  // Resizable pane state
  const [splitPosition, setSplitPosition] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mobile view toggle: 'editor' or 'preview'
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');

  // Force re-render for PDF generation
  const [, forceUpdate] = useState({});

  // Parse Markdown when input changes
  useEffect(() => {
    const { content, title, theme } = extractFrontMatter(docState.rawMarkdown);
    const html = parseMarkdown(content);
    
    setDocState(prev => ({
      ...prev,
      processedHtml: html,
      title: title || prev.title,
      // Only set theme from frontmatter if we haven't manually changed it, 
      // or if it's the initial load. For now, let's just stick to logic:
      // if frontmatter has theme, user probably wants it.
      theme: (theme as AppTheme) || prev.theme
    }));
  }, [docState.rawMarkdown]);

  // Handler: Markdown Change
  const handleMarkdownChange = (newMarkdown: string) => {
    setDocState(prev => ({ ...prev, rawMarkdown: newMarkdown }));
  };

  // Handler: Auto Format - cleans up markdown formatting
  const handleAutoFormat = () => {
    let text = docState.rawMarkdown;
    
    // Fix multiple consecutive blank lines (more than 2) → reduce to 2
    text = text.replace(/\n{3,}/g, '\n\n');
    
    // Ensure headings have blank line before (unless at start)
    text = text.replace(/([^\n])\n(#{1,6}\s)/g, '$1\n\n$2');
    
    // Ensure proper spacing after headings
    text = text.replace(/(#{1,6}\s+[^\n]+)\n(?!\n)/g, '$1\n\n');
    
    // Fix list formatting - ensure proper spacing
    text = text.replace(/([^\n])\n([-*+]\s)/g, '$1\n\n$2');
    text = text.replace(/([^\n])\n(\d+\.\s)/g, '$1\n\n$2');
    
    // Ensure code blocks have proper spacing
    text = text.replace(/([^\n])\n```/g, '$1\n\n```');
    text = text.replace(/```\n([^\n])/g, '```\n\n$1');
    
    // Ensure blockquotes have proper spacing
    text = text.replace(/([^\n>])\n>/g, '$1\n\n>');
    
    // Trim trailing whitespace from each line
    text = text.split('\n').map(line => line.trimEnd()).join('\n');
    
    // Trim leading/trailing whitespace from entire document
    text = text.trim();
    
    setDocState(prev => ({ ...prev, rawMarkdown: text }));
  };

  // Resizable pane handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const newPosition = ((e.clientX - rect.left) / rect.width) * 100;
    
    // Clamp between 20% and 80%
    setSplitPosition(Math.min(80, Math.max(20, newPosition)));
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add/remove mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);


  // Handler: Export PDF - Uses browser print for best quality
  const handleExport = async () => {
    const element = document.getElementById('printable-content');
    if (!element) {
      alert('Could not find content to export');
      return;
    }

    setDocState(prev => ({ ...prev, isGenerating: true }));
    
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (!printWindow) {
        alert('Please allow pop-ups to download PDF');
        setDocState(prev => ({ ...prev, isGenerating: false }));
        return;
      }

      // Get all styles from the page
      const styleSheets = Array.from(document.styleSheets);
      let cssText = '';
      styleSheets.forEach(sheet => {
        try {
          const rules = Array.from(sheet.cssRules || []);
          rules.forEach(rule => {
            cssText += rule.cssText + '\n';
          });
        } catch (e) {
          // Skip cross-origin stylesheets
        }
      });

      // Build the print document
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${docState.title || 'Document'}</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
          <style>
            ${cssText}
            
            @page {
              size: A4;
              margin: 15mm;
            }
            
            @media print {
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              
              body {
                margin: 0;
                padding: 0;
                background: white !important;
              }
              
              .markdown-preview {
                width: 100% !important;
                max-width: none !important;
                padding: 0 !important;
                margin: 0 !important;
                border: none !important;
                box-shadow: none !important;
                background: white !important;
              }
              
              /* Page break controls */
              h1, h2, h3, h4, h5, h6 {
                page-break-after: avoid;
                break-after: avoid;
              }
              
              p, li, blockquote, pre {
                page-break-inside: avoid;
                break-inside: avoid;
                orphans: 3;
                widows: 3;
              }
              
              table {
                page-break-inside: auto;
              }
              
              tr {
                page-break-inside: avoid;
                break-inside: avoid;
              }
              
              thead {
                display: table-header-group;
              }
              
              img {
                page-break-inside: avoid;
                break-inside: avoid;
                max-width: 100% !important;
              }
              
              /* Ensure code blocks don't break awkwardly */
              pre {
                white-space: pre-wrap;
                word-wrap: break-word;
              }
            }
            
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              margin: 0;
              padding: 20px;
              background: white;
            }
            
            .markdown-preview {
              max-width: 100%;
              margin: 0 auto;
            }
          </style>
        </head>
        <body>
          <div class="markdown-preview">
            ${element.innerHTML}
          </div>
          <script>
            // Auto-trigger print dialog when loaded
            window.onload = function() {
              setTimeout(function() {
                window.print();
                // Close window after print dialog closes
                window.onafterprint = function() {
                  window.close();
                };
                // Fallback: close after delay if onafterprint not supported
                setTimeout(function() {
                  window.close();
                }, 1000);
              }, 500);
            };
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(printContent);
      printWindow.document.close();

    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setDocState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Toolbar 
        onExport={handleExport}
        onAutoFormat={handleAutoFormat}
        isGenerating={docState.isGenerating}
      />

      {/* Mobile View Toggle - Only visible on small screens */}
      <div className="md:hidden flex border-b" style={{ backgroundColor: '#F2F4F3' }}>
        <button
          onClick={() => setMobileView('editor')}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            mobileView === 'editor' 
              ? 'text-white' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
          style={mobileView === 'editor' ? { backgroundColor: '#5E503F' } : {}}
        >
          ✏️ Editor
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            mobileView === 'preview' 
              ? 'text-white' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
          style={mobileView === 'preview' ? { backgroundColor: '#5E503F' } : {}}
        >
          👁️ Preview
        </button>
      </div>

      <main ref={containerRef} className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* Editor Pane - Full width on mobile when active, side-by-side on desktop */}
        <div 
          className={`h-full overflow-hidden print:hidden flex-shrink-0
            ${mobileView === 'editor' ? 'block' : 'hidden'} 
            md:block`}
          style={{ width: splitPosition + '%' }}
        >
          <Editor 
            value={docState.rawMarkdown} 
            onChange={handleMarkdownChange} 
          />
        </div>

        {/* Resizable Divider - Hidden on mobile */}
        <div
          className="hidden md:flex w-2 h-full cursor-col-resize items-center justify-center group print:hidden hover:bg-[#A9927D] transition-colors flex-shrink-0"
          style={{ backgroundColor: '#22333B' }}
          onMouseDown={handleMouseDown}
        >
          <div className="w-0.5 h-8 rounded-full bg-[#A9927D] group-hover:bg-[#F2F4F3] transition-colors" />
        </div>

        {/* Preview Pane - Full width on mobile when active, side-by-side on desktop */}
        <div 
          className={`h-full overflow-hidden print:w-full print:border-none print:overflow-visible flex-1 min-w-0
            ${mobileView === 'preview' ? 'block' : 'hidden'} 
            md:block`}
        >
          <Preview 
            html={docState.processedHtml} 
            theme={docState.theme} 
            customCss={docState.customCss} 
          />
        </div>

        {/* Overlay to prevent iframe/content interference while dragging */}
        {isDragging && (
          <div className="absolute inset-0 z-50 cursor-col-resize" />
        )}
      </main>
    </div>
  );
}

export default App;