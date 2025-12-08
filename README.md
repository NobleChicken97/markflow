# MarkFlow AI - Markdown to PDF Converter

A powerful web application that converts Markdown files into beautifully styled, print-ready PDFs with AI-assisted theming and styling.

## Features

✨ **Core Features**
- Upload or paste Markdown content
- Real-time preview with A4 paper simulation
- Export to downloadable PDF
- YAML front-matter support (title, author, theme)

🎨 **Themes**
- **Clean Notes** - Modern, readable format with good spacing
- **Technical Report** - Academic style with numbered headings
- **Modern Resume** - Professional layout for CVs

🤖 **AI Features** (requires Gemini API key)
- Auto-detect best theme based on content
- Natural language style adjustments ("make headings blue")
- Content polishing and grammar improvements

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/markflow-ai.git
   cd markflow-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Configure AI features:
   - Copy `.env.example` to `.env.local`
   - Add your Gemini API key:
     ```
     VITE_GEMINI_API_KEY=your_api_key_here
     ```
   - Get your API key from: https://makersuite.google.com/app/apikey

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000 in your browser

## Deployment to Vercel

### Quick Deploy

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variable (optional for AI features):
   - `VITE_GEMINI_API_KEY`: Your Gemini API key
4. Deploy!

### Manual Build

```bash
npm run build
```

The output will be in the `dist` folder.

## Usage

### Basic Workflow
1. Type or paste your Markdown in the left editor
2. Select a theme from the toolbar
3. Click "Export PDF" to download

### File Upload
- Click "Upload .md" to import an existing Markdown file
- Supported formats: `.md`, `.markdown`, `.txt`

### YAML Front Matter
Add metadata to your document:
```markdown
---
title: My Document
author: John Doe
theme: TECHNICAL_REPORT
---

# Your content here...
```

### AI Assistant
1. Click "AI Assistant" to open the panel
2. **Adjust Style**: "Make headings larger", "Use serif fonts"
3. **Improve Content**: "Fix grammar", "Make more professional"

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Markdown**: markdown-it + highlight.js
- **PDF Generation**: html2canvas + jsPDF
- **AI**: Google Gemini API

## Project Structure

```
markflow-ai/
├── components/
│   ├── AIPanel.tsx      # AI assistant sidebar
│   ├── Editor.tsx       # Markdown input editor
│   ├── Preview.tsx      # PDF preview pane
│   └── Toolbar.tsx      # Theme selector & actions
├── services/
│   ├── geminiService.ts # AI integration
│   └── markdownService.ts # Markdown parsing
├── App.tsx              # Main application
├── types.ts             # TypeScript definitions
└── index.tsx            # Entry point
```

## License

MIT License
