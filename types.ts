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

export const INITIAL_MARKDOWN = `# Project Nebula: Orbit Analysis

## 1. Overview
The **Nebula** initiative aims to revolutionize *orbital mechanics* simulations. By leveraging advanced physics engines, we can predict satellite trajectories with 99.9% accuracy.

### Key Objectives
* Reduce computational load by 40%
* Improve real-time visualization
* Integrate AI-driven collision avoidance

## 2. Methodology
We utilize a hybrid approach combining numerical integration with machine learning models.

\`\`\`javascript
function calculateOrbit(velocity, distance) {
  const G = 6.67430e-11;
  const M = 5.972e24; // Earth mass
  return Math.sqrt((G * M) / distance);
}
\`\`\`

> "Exploration is in our nature. We began as wanderers, and we are wanderers still." - Carl Sagan

## 3. Results
The initial tests show promising results across all metrics.`;
