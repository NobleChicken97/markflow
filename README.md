# MarkFlow - Markdown to PDF Converter

A sleek, responsive web application that converts Markdown content into beautifully styled, print-ready PDFs with comprehensive markdown support.

🌐 **Live Demo**: [markflow.vercel.app](https://markflow.vercel.app)

## Features

✨ **Core Features**
- Write or paste Markdown content with real-time preview
- Upload existing `.md`, `.markdown`, or `.txt` files
- Export to high-quality downloadable PDF
- Auto-format button to clean up markdown formatting
- YAML front-matter support for document metadata

📝 **Extended Markdown Support**
- **Math/LaTeX**: Inline `$E=mc^2$` and block `$$\sum_{i=1}^n x_i$$` equations (KaTeX)
- **Task Lists**: `- [x] Done` / `- [ ] Todo` checkboxes
- **Footnotes**: `[^1]` references with automatic numbering
- **Highlight**: `==marked text==` for highlighting
- **Sub/Superscript**: `H~2~O` and `x^2^`
- **Emoji**: `:smile:` `:heart:` and more
- **Definition Lists**: Term/definition pairs
- **Abbreviations**: `*[HTML]: HyperText Markup Language`
- **Table of Contents**: `[[toc]]` auto-generates TOC
- **Custom Containers**: `:::tip`, `:::warning`, `:::danger`, `:::info`
- **Collapsible Sections**: `:::details Title` for expandable content

🎨 **Professional Styling**
- Clean, modern design with custom color palette
- Well-defined tables with solid borders
- Properly styled headings, lists, code blocks, and blockquotes
- Syntax highlighting for code blocks

📱 **Responsive Design**
- Fully responsive - works on desktop, tablet, and mobile
- Resizable split pane (drag to adjust editor/preview ratio)
- Mobile view toggle between Editor and Preview modes
- Touch-friendly interface

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Rich Black | `#0A0908` | Text, borders |
| Dark Slate | `#22333B` | Headers, toolbar |
| Off White | `#F2F4F3` | Backgrounds |
| Tan | `#A9927D` | Accents, highlights |
| Brown | `#5E503F` | Secondary accents |

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/NobleChicken97/markflow.git
   cd markflow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000 in your browser

## Markdown Syntax Reference

### Math Equations (LaTeX)
```markdown
Inline: $E = mc^2$
Block:
$$
\\sum_{i=1}^{n} x_i = x_1 + x_2 + ... + x_n
$$
```

### Task Lists
```markdown
- [x] Completed task
- [ ] Pending task
```

### Footnotes
```markdown
Here is a footnote reference[^1].

[^1]: This is the footnote content.
```

### Highlighting & Formatting
```markdown
==highlighted text==
H~2~O (subscript)
x^2^ (superscript)
:smile: :heart: (emoji)
```

### Definition Lists
```markdown
Term
: Definition of the term
```

### Abbreviations
```markdown
The HTML specification is maintained by the W3C.

*[HTML]: Hyper Text Markup Language
*[W3C]: World Wide Web Consortium
```

### Table of Contents
```markdown
[[toc]]
```

### Custom Containers
```markdown
::: tip Pro Tip
Helpful information here
:::

::: warning
Be careful about this
:::

::: danger
Critical warning!
:::

::: info
Additional information
:::

::: details Click to expand
Hidden content revealed on click
:::
```

## Deployment to Vercel

### Quick Deploy

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. (Optional) Add environment variable for AI features:
   - `VITE_GEMINI_API_KEY`: Your Gemini API key
5. Deploy!

### Manual Build

```bash
npm run build
```

The output will be in the `dist` folder.

## Usage

### Basic Workflow
1. Type or paste your Markdown in the left editor
2. See real-time preview on the right
3. Use "Auto Format" to clean up spacing
4. Click "Download PDF" to export

### File Upload
- Click the upload icon to import an existing Markdown file
- Supported formats: `.md`, `.markdown`, `.txt`

### Resizable Panes
- Drag the divider between editor and preview to resize
- On mobile, use the Editor/Preview toggle buttons

### YAML Front Matter
Add metadata to your document:
```markdown
---
title: My Document
author: John Doe
---

# Your content here...
```

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 3.4
- **Markdown**: markdown-it with plugins:
  - `@mdit/plugin-katex` - Math/LaTeX equations
  - `markdown-it-task-lists` - Checkboxes
  - `markdown-it-footnote` - Footnotes
  - `markdown-it-mark` - Highlights
  - `markdown-it-sub/sup` - Subscript/Superscript
  - `markdown-it-emoji` - Emoji support
  - `markdown-it-container` - Custom containers
  - `markdown-it-deflist` - Definition lists
  - `markdown-it-abbr` - Abbreviations
  - `markdown-it-toc-done-right` - Table of Contents
- **Code Highlighting**: highlight.js
- **PDF Generation**: Browser native print-to-PDF
- **AI** (optional): Google Gemini API

## Project Structure

```
markflow/
├── components/
│   ├── Editor.tsx       # Markdown input editor
│   ├── Preview.tsx      # PDF preview pane
│   └── Toolbar.tsx      # Header with actions
├── services/
│   ├── geminiService.ts # AI integration (optional)
│   └── markdownService.ts # Markdown parsing
├── App.tsx              # Main application
├── types.ts             # TypeScript definitions
└── index.tsx            # Entry point
```

## License

MIT License
