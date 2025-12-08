import React from 'react';
import { AppTheme } from '../types';

interface PreviewProps {
  html: string;
  theme: AppTheme;
  customCss: string;
}

// Color Palette:
// #0A0908 - Rich Black (text, borders)
// #22333B - Dark Slate (headers, dark accents)
// #F2F4F3 - Off White (backgrounds)
// #A9927D - Tan/Khaki (accents, highlights)
// #5E503F - Brown (secondary headers, accents)

export const Preview: React.FC<PreviewProps> = ({ html, customCss }) => {
  const getStyles = () => {
    return `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
      
      .markdown-preview {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        color: #0A0908;
        line-height: 1.7;
        padding: 40px;
        background: #F2F4F3;
        max-width: 100%;
      }
      
      .markdown-preview * {
        box-sizing: border-box;
      }
      
      /* ==================== PAGE BREAK CONTROL ==================== */
      .markdown-preview h1, .markdown-preview h2, .markdown-preview h3, .markdown-preview h4 {
        page-break-after: avoid;
        break-after: avoid;
      }
      
      .markdown-preview p, .markdown-preview li, .markdown-preview blockquote {
        page-break-inside: avoid;
        break-inside: avoid;
      }
      
      .markdown-preview table {
        page-break-inside: auto;
      }
      
      .markdown-preview tr {
        page-break-inside: avoid;
        break-inside: avoid;
      }
      
      .markdown-preview pre {
        page-break-inside: avoid;
        break-inside: avoid;
      }
      
      /* ==================== HEADINGS ==================== */
      
      .markdown-preview h1 {
        font-size: 1.65rem;
        font-weight: 800;
        color: #F2F4F3;
        margin: 0 0 1.5rem 0;
        padding: 0.875rem 1.25rem;
        background: #22333B;
        border: 3px solid #0A0908;
        letter-spacing: -0.01em;
      }
      
      .markdown-preview h2 {
        font-size: 1.3rem;
        font-weight: 700;
        color: #0A0908;
        margin: 2rem 0 1rem 0;
        padding: 0.625rem 1rem;
        background: #A9927D;
        border: 2px solid #0A0908;
        border-left-width: 6px;
      }
      
      .markdown-preview h3 {
        font-size: 1.1rem;
        font-weight: 600;
        color: #22333B;
        margin: 1.5rem 0 0.625rem 0;
        padding: 0.375rem 0;
        border-bottom: 2px solid #5E503F;
      }
      
      .markdown-preview h4 {
        font-size: 1rem;
        font-weight: 600;
        color: #5E503F;
        margin: 1.25rem 0 0.5rem 0;
        padding-left: 0.625rem;
        border-left: 3px solid #A9927D;
      }
      
      .markdown-preview h5, .markdown-preview h6 {
        font-size: 0.95rem;
        font-weight: 600;
        color: #5E503F;
        margin: 1rem 0 0.375rem 0;
      }
      
      /* ==================== PARAGRAPHS & TEXT ==================== */
      
      .markdown-preview p {
        margin: 0 0 0.875rem 0;
        font-size: 0.9rem;
        color: #0A0908;
        text-align: justify;
      }
      
      .markdown-preview strong {
        font-weight: 700;
        color: #22333B;
        background: #A9927D;
        padding: 0 3px;
      }
      
      .markdown-preview em {
        font-style: italic;
        color: #5E503F;
      }
      
      /* ==================== LISTS - Boxed & Bordered ==================== */
      
      .markdown-preview ul, .markdown-preview ol {
        margin: 0.875rem 0 1rem 0;
        padding: 0.75rem 0.875rem 0.75rem 1.75rem;
        background: #ffffff;
        border: 2px solid #0A0908;
      }
      
      .markdown-preview ul {
        list-style: none;
        padding-left: 1.25rem;
      }
      
      .markdown-preview ul > li {
        position: relative;
        padding-left: 1rem;
        margin-bottom: 0.375rem;
        color: #0A0908;
        padding-bottom: 0.375rem;
        border-bottom: 1px dashed #A9927D;
        font-size: 0.9rem;
      }
      
      .markdown-preview ul > li:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
      }
      
      .markdown-preview ul > li::before {
        content: "▪";
        position: absolute;
        left: 0;
        color: #5E503F;
        font-size: 0.85rem;
      }
      
      .markdown-preview ol {
        list-style: none;
        counter-reset: list-counter;
        padding-left: 1.25rem;
      }
      
      .markdown-preview ol > li {
        counter-increment: list-counter;
        position: relative;
        padding-left: 1.75rem;
        margin-bottom: 0.375rem;
        color: #0A0908;
        padding-bottom: 0.375rem;
        border-bottom: 1px dashed #A9927D;
        font-size: 0.9rem;
      }
      
      .markdown-preview ol > li:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
      }
      
      .markdown-preview ol > li::before {
        content: counter(list-counter) ".";
        position: absolute;
        left: 0;
        font-weight: 700;
        color: #22333B;
        background: #A9927D;
        padding: 0 5px;
        font-size: 0.75rem;
      }
      
      /* Nested lists */
      .markdown-preview li > ul, .markdown-preview li > ol {
        margin: 0.375rem 0 0.125rem 0;
        border: 1px solid #A9927D;
        background: #F2F4F3;
      }
      
      /* ==================== BLOCKQUOTES ==================== */
      
      .markdown-preview blockquote {
        margin: 1rem 0;
        padding: 0.75rem 1rem;
        background: #ffffff;
        border: 2px solid #5E503F;
        border-left-width: 5px;
        color: #22333B;
      }
      
      .markdown-preview blockquote p {
        margin-bottom: 0;
        color: #22333B;
        font-style: italic;
        text-align: left;
        font-size: 0.9rem;
      }
      
      /* ==================== CODE ==================== */
      
      .markdown-preview code {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.8em;
        background: #ffffff;
        color: #22333B;
        padding: 0.1rem 0.35rem;
        border: 1px solid #0A0908;
      }
      
      .markdown-preview pre {
        margin: 1rem 0;
        padding: 0.875rem;
        background: #22333B;
        border: 3px solid #0A0908;
        overflow-x: auto;
      }
      
      .markdown-preview pre code {
        background: transparent;
        border: none;
        padding: 0;
        color: #F2F4F3;
        font-size: 0.8rem;
        line-height: 1.5;
      }
      
      /* ==================== TABLES - Clear Grid with Solid Borders ==================== */
      
      .markdown-preview table {
        width: 100%;
        margin: 1rem 0;
        border-collapse: collapse;
        border: 3px solid #0A0908;
        background: #ffffff;
      }
      
      .markdown-preview thead {
        background: #22333B;
      }
      
      .markdown-preview th {
        color: #F2F4F3;
        font-weight: 700;
        padding: 0.625rem 0.875rem;
        text-align: left;
        font-size: 0.85rem;
        border: 2px solid #0A0908;
      }
      
      .markdown-preview td {
        padding: 0.5rem 0.875rem;
        border: 2px solid #0A0908;
        color: #0A0908;
        background: #ffffff;
        font-size: 0.85rem;
      }
      
      .markdown-preview tbody tr:nth-child(even) td {
        background: #F2F4F3;
      }
      
      /* ==================== HORIZONTAL RULES ==================== */
      
      .markdown-preview hr {
        border: none;
        height: 3px;
        background: #0A0908;
        margin: 1.5rem 0;
      }
      
      /* ==================== LINKS ==================== */
      
      .markdown-preview a {
        color: #22333B;
        text-decoration: underline;
        font-weight: 500;
      }
      
      /* ==================== IMAGES ==================== */
      
      .markdown-preview img {
        max-width: 100%;
        height: auto;
        margin: 0.875rem 0;
        border: 2px solid #0A0908;
      }
    `;
  };

  return (
    <div className="h-full overflow-auto p-4" style={{ backgroundColor: '#A9927D' }}>
      <style>{getStyles()}</style>
      <style>{customCss}</style>
      
      {/* Paper Simulation - Responsive */}
      <div className="flex justify-center pb-4">
        <div 
          id="printable-content"
          className="markdown-preview shadow-xl w-full max-w-[210mm]"
          style={{ minHeight: '297mm', backgroundColor: '#F2F4F3', border: '3px solid #0A0908' }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
};