import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import { katex as katexPlugin } from '@mdit/plugin-katex';

// Import markdown-it plugins for comprehensive markdown support
// @ts-ignore - no types available
import taskLists from 'markdown-it-task-lists';
import footnote from 'markdown-it-footnote';
// @ts-ignore - no types available
import mark from 'markdown-it-mark';
// @ts-ignore - no types available
import sub from 'markdown-it-sub';
// @ts-ignore - no types available
import sup from 'markdown-it-sup';
// @ts-ignore - named export
import { full as emoji } from 'markdown-it-emoji';
// @ts-ignore - no types available
import tocDoneRight from 'markdown-it-toc-done-right';
import container from 'markdown-it-container';
// @ts-ignore - no types available
import deflist from 'markdown-it-deflist';
// @ts-ignore - no types available
import abbr from 'markdown-it-abbr';

// Initialize markdown-it with syntax highlighting
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: false,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code class="language-' + lang + '">' +
               hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
               '</code></pre>';
      } catch (__) {}
    }

    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});

// ==================== PLUGIN CONFIGURATION ====================

// 1. KaTeX - Math equations ($...$ for inline, $$...$$ for block)
md.use(katexPlugin, {
  output: 'html',
  strict: false,
  throwOnError: false,
  errorColor: '#cc0000'
});

// 2. Task Lists - [ ] unchecked, [x] checked
md.use(taskLists, {
  enabled: true,
  label: true,
  labelAfter: true
});

// 3. Footnotes - [^1] references
md.use(footnote);

// 4. Mark/Highlight - ==highlighted text==
md.use(mark);

// 5. Subscript - H~2~O
md.use(sub);

// 6. Superscript - x^2^
md.use(sup);

// 7. Emoji - :smile: :heart:
md.use(emoji);

// 8. Table of Contents - [[toc]]
md.use(tocDoneRight, {
  containerClass: 'table-of-contents',
  listType: 'ul',
  listClass: 'toc-list',
  itemClass: 'toc-item',
  linkClass: 'toc-link'
});

// 9. Definition Lists
// Term
// : Definition
md.use(deflist);

// 10. Abbreviations
// *[HTML]: Hypertext Markup Language
md.use(abbr);

// 11. Custom Containers - ::: warning, ::: tip, ::: danger, ::: info
const containerTypes = ['warning', 'tip', 'danger', 'info', 'note', 'success'];
containerTypes.forEach(type => {
  md.use(container, type, {
    validate: function(params: string) {
      return params.trim().match(new RegExp(`^${type}\\s*(.*)$`));
    },
    render: function(tokens: any[], idx: number) {
      const m = tokens[idx].info.trim().match(new RegExp(`^${type}\\s*(.*)$`));
      if (tokens[idx].nesting === 1) {
        const title = m && m[1] ? m[1] : type.charAt(0).toUpperCase() + type.slice(1);
        return `<div class="custom-container ${type}"><p class="custom-container-title">${md.utils.escapeHtml(title)}</p>\n`;
      } else {
        return '</div>\n';
      }
    }
  });
});

// 12. Details/Summary container (collapsible)
md.use(container, 'details', {
  validate: function(params: string) {
    return params.trim().match(/^details\s+(.*)$/);
  },
  render: function(tokens: any[], idx: number) {
    const m = tokens[idx].info.trim().match(/^details\s+(.*)$/);
    if (tokens[idx].nesting === 1) {
      const summary = m ? md.utils.escapeHtml(m[1]) : 'Details';
      return `<details><summary>${summary}</summary>\n`;
    } else {
      return '</details>\n';
    }
  }
});

export const parseMarkdown = (markdown: string): string => {
  // Sanitize potentially dangerous HTML while preserving safe markdown
  const html = md.render(markdown);
  return html;
};

export const extractFrontMatter = (markdown: string): { content: string, title?: string, theme?: string, author?: string, toc?: boolean } => {
  // Regex to extract YAML frontmatter
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n?/;
  const match = markdown.match(frontMatterRegex);
  
  if (match) {
    const frontMatterBlock = match[1];
    const content = markdown.replace(frontMatterRegex, '');
    
    // Parse YAML-like structure
    const titleMatch = frontMatterBlock.match(/title:\s*["']?([^"'\n]+)["']?/);
    const themeMatch = frontMatterBlock.match(/theme:\s*["']?([^"'\n]+)["']?/);
    const authorMatch = frontMatterBlock.match(/author:\s*["']?([^"'\n]+)["']?/);
    const tocMatch = frontMatterBlock.match(/toc:\s*(true|false)/i);
    
    return {
      content,
      title: titleMatch ? titleMatch[1].trim() : undefined,
      theme: themeMatch ? themeMatch[1].trim().toUpperCase().replace(/\s+/g, '_') : undefined,
      author: authorMatch ? authorMatch[1].trim() : undefined,
      toc: tocMatch ? tocMatch[1].toLowerCase() === 'true' : undefined
    };
  }
  
  // Try to extract title from first H1 if no frontmatter
  const h1Match = markdown.match(/^#\s+(.+)$/m);
  
  return { 
    content: markdown,
    title: h1Match ? h1Match[1].trim() : undefined
  };
};