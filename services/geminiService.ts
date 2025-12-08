import { GoogleGenAI, Type } from "@google/genai";
import { AppTheme } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize AI client safely (handles storage access errors in some browser contexts)
let ai: GoogleGenAI | null = null;
try {
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  }
} catch (error) {
  console.warn('Failed to initialize Google GenAI:', error);
}

// Helper to get model
const getModel = () => 'gemini-2.5-flash';

// Check if AI is available
const checkAIAvailability = () => {
  if (!ai || !apiKey) {
    throw new Error('AI features require a valid Gemini API key. Please configure VITE_GEMINI_API_KEY in your environment.');
  }
};

export const detectTheme = async (markdownSnippet: string): Promise<AppTheme> => {
  try {
    checkAIAvailability();
    
    const prompt = `
      Analyze the following Markdown content and categorize it into one of these document types.
      Choose the BEST theme that will provide:
      - Page borders for professional appearance
      - Proper text colors, bolds, italics for differentiation and leveling
      - Well-organized tables with clear headers and borders
      - Clean, organized lists with visual hierarchy
      - Proper content segmentation with boxes and sections
      - Headlines that stand out for easy navigation
      - Proper text wrapping and modular layout
      
      Document Types:
      - CLEAN_NOTES: Best for study materials, notes, guides, general documentation. Uses blue accent colors, box-style headers, organized bullet lists.
      - TECHNICAL_REPORT: Best for academic papers, technical docs, formal reports. Uses numbered sections, formal styling, structured layout with borders.
      - MODERN_RESUME: Best for CVs, portfolios, biographical/personal info. Uses clean professional layout, skill badges, compact sections.

      Markdown Snippet:
      ${markdownSnippet.substring(0, 1500)}
    `;

    const response = await ai!.models.generateContent({
      model: getModel(),
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            theme: {
              type: Type.STRING,
              enum: [AppTheme.DEFAULT]
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result.theme as AppTheme || AppTheme.DEFAULT;
  } catch (error) {
    console.error("Error detecting theme:", error);
    throw error;
  }
};

export const polishContent = async (markdown: string, instruction: string): Promise<string> => {
  try {
    checkAIAvailability();
    
    const prompt = `
      Act as a professional editor. Please improve the following Markdown content based on this instruction: "${instruction}".
      Maintain the original Markdown structure (headers, lists, code blocks). Do not strip formatting.
      Return ONLY the updated Markdown.

      Markdown Content:
      ${markdown}
    `;

    const response = await ai!.models.generateContent({
      model: getModel(),
      contents: prompt,
    });

    return response.text || markdown;
  } catch (error) {
    console.error("Error polishing content:", error);
    throw error;
  }
};

export const generateCustomCSS = async (currentTheme: AppTheme, userRequest: string): Promise<string> => {
  try {
    checkAIAvailability();
    
    const prompt = `
      You are a CSS expert creating professional document styles. Generate CSS to override styles based on the user's request.
      
      Context:
      - The base theme is: ${currentTheme}.
      - The HTML structure is standard semantic HTML (h1, h2, h3, h4, p, ul, ol, li, blockquote, pre, code, table, th, td).
      - The container class is .markdown-preview.
      
      Default Formatting Guidelines (apply these unless user requests otherwise):
      1. Add visible borders to pages and sections for professional appearance
      2. Use various text colors - red for bold/strong, purple for italics, different shades for heading levels
      3. Tables should have colored headers, proper borders, alternating row colors
      4. Lists should be well-organized with custom bullets/numbers, proper spacing
      5. Content should be properly segmented with boxes, borders, backgrounds
      6. Headlines should pop out with backgrounds, borders, or accent colors
      7. Use proper text wrapping, padding, and margins for modular layout
      
      User Request: "${userRequest}"

      Requirements:
      - Return ONLY valid CSS code. No markdown code fences.
      - Target elements within .markdown-preview (e.g., .markdown-preview h1 { ... }).
      - Use !important sparingly, only when needed to override base styles.
      - Focus on professional, print-ready styling.
    `;

    const response = await ai!.models.generateContent({
      model: getModel(),
      contents: prompt,
    });
    
    // Clean up response if it contains markdown code blocks
    let css = response.text || '';
    css = css.replace(/```css/g, '').replace(/```/g, '');
    return css.trim();

  } catch (error) {
    console.error("Error generating CSS:", error);
    throw error;
  }
};
