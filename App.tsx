import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { Toolbar } from './components/Toolbar';
import { parseMarkdown, extractFrontMatter } from './services/markdownService';
import { AppTheme, INITIAL_MARKDOWN, DocumentState } from './types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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


  // Handler: Export PDF - Uses multiple A4 pages if content is long
  const handleExport = async () => {
    const element = document.getElementById('printable-content');
    if (!element) {
      alert('Could not find content to export');
      return;
    }

    setDocState(prev => ({ ...prev, isGenerating: true }));
    
    try {
      // Get computed styles to copy them
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

      // Create a wrapper div for proper rendering
      const wrapper = document.createElement('div');
      wrapper.style.position = 'absolute';
      wrapper.style.left = '-9999px';
      wrapper.style.top = '0';
      wrapper.style.width = '794px'; // A4 width at 96 DPI
      wrapper.style.backgroundColor = '#F2F4F3';
      
      // Add styles
      const styleEl = document.createElement('style');
      styleEl.textContent = cssText;
      wrapper.appendChild(styleEl);
      
      // Clone the content
      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.width = '794px';
      clone.style.minHeight = 'auto';
      clone.style.height = 'auto';
      clone.style.boxShadow = 'none';
      clone.style.margin = '0';
      clone.style.padding = '40px';
      wrapper.appendChild(clone);
      
      document.body.appendChild(wrapper);

      // Wait for rendering
      await new Promise(resolve => setTimeout(resolve, 500));

      // Use lower scale to avoid canvas size limits
      const canvas = await html2canvas(clone, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#F2F4F3',
        allowTaint: true,
      });

      document.body.removeChild(wrapper);

      // A4 dimensions in mm
      const pdfWidth = 210;
      const pdfHeight = 297;
      
      // Calculate image dimensions
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Check if content fits on one page or needs multiple
      if (imgHeight <= pdfHeight) {
        // Single page - content fits
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        pdf.addImage(
          canvas.toDataURL('image/jpeg', 0.95),
          'JPEG',
          0,
          0,
          imgWidth,
          imgHeight
        );

        const filename = `${docState.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'document'}.pdf`;
        pdf.save(filename);
      } else {
        // Multiple pages needed
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        const totalPages = Math.ceil(imgHeight / pdfHeight);
        const sourceHeight = canvas.height / totalPages;

        for (let page = 0; page < totalPages; page++) {
          if (page > 0) {
            pdf.addPage();
          }

          // Create canvas for this page
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvas.width;
          pageCanvas.height = Math.min(sourceHeight, canvas.height - page * sourceHeight);

          const ctx = pageCanvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#F2F4F3';
            ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
            ctx.drawImage(
              canvas,
              0, page * sourceHeight,
              canvas.width, pageCanvas.height,
              0, 0,
              pageCanvas.width, pageCanvas.height
            );
          }

          const pageImgHeight = (pageCanvas.height * pdfWidth) / pageCanvas.width;

          pdf.addImage(
            pageCanvas.toDataURL('image/jpeg', 0.95),
            'JPEG',
            0,
            0,
            pdfWidth,
            Math.min(pageImgHeight, pdfHeight)
          );
        }

        const filename = `${docState.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'document'}.pdf`;
        pdf.save(filename);
      }
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
          className={`h-full overflow-hidden print:hidden
            ${mobileView === 'editor' ? 'flex' : 'hidden'} 
            md:flex`}
          style={{ width: window.innerWidth >= 768 ? `${splitPosition}%` : '100%' }}
        >
          <Editor 
            value={docState.rawMarkdown} 
            onChange={handleMarkdownChange} 
          />
        </div>

        {/* Resizable Divider - Hidden on mobile */}
        <div
          className="hidden md:flex w-2 h-full cursor-col-resize items-center justify-center group print:hidden hover:bg-[#A9927D] transition-colors"
          style={{ backgroundColor: '#22333B' }}
          onMouseDown={handleMouseDown}
        >
          <div className="w-0.5 h-8 rounded-full bg-[#A9927D] group-hover:bg-[#F2F4F3] transition-colors" />
        </div>

        {/* Preview Pane - Full width on mobile when active, side-by-side on desktop */}
        <div 
          className={`h-full overflow-hidden print:w-full print:border-none print:overflow-visible
            ${mobileView === 'preview' ? 'flex' : 'hidden'} 
            md:flex`}
          style={{ width: window.innerWidth >= 768 ? `${100 - splitPosition}%` : '100%' }}
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