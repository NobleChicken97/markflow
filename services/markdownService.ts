import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

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