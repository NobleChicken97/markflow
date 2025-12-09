export enum AppTheme {
  DEFAULT = 'DEFAULT',
}

export interface DocumentState {
  rawMarkdown: string;
  processedHtml: string;
  theme: AppTheme;
  customCss: string;
  title: string;
  isGenerating: boolean;
  aiPanelOpen: boolean;
}

export interface AIActionResponse {
  success: boolean;
  data?: string;
  error?: string;
}

export const INITIAL_MARKDOWN = '';
