import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || ''),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || '')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        outDir: 'dist',
        sourcemap: false,
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
          output: {
            manualChunks: {
              'katex': ['katex', '@mdit/plugin-katex'],
              'highlight': ['highlight.js'],
              'markdown-core': ['markdown-it'],
              'markdown-plugins': [
                'markdown-it-task-lists',
                'markdown-it-footnote',
                'markdown-it-mark',
                'markdown-it-sub',
                'markdown-it-sup',
                'markdown-it-emoji',
                'markdown-it-container',
                'markdown-it-deflist',
                'markdown-it-abbr',
                'markdown-it-toc-done-right'
              ],
              'react-vendor': ['react', 'react-dom'],
            }
          }
        }
      }
    };
});
