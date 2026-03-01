
import { GoogleGenAI } from '@google/genai';
import { SYSTEM_INSTRUCTION } from '../types';

export const generateStrategy = async (text: string, imageFile: File | undefined): Promise<string> => {
  try {
    // Priority: 1. Vite Env (Netlify/Prod), 2. Process Env (Dev/Local)
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY as string) || 
                   (import.meta.env.VITE_API_KEY as string) ||
                   (typeof process !== 'undefined' && process.env ? (process.env.GEMINI_API_KEY || process.env.API_KEY) : null);
                   
    if (!apiKey) {
      throw new Error("CRITICAL: API Key not found. Please ensure 'VITE_GEMINI_API_KEY' is added to your Netlify Environment Variables and redeploy.");
    }
    const ai = new GoogleGenAI({ apiKey });
    
    const parts: any[] = [];
    if (imageFile) {
      const base64Data = await fileToBase64(imageFile);
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: imageFile.type,
        }
      });
      parts.push({ text: text || "Analyze this product image and provide a comprehensive market strategy." });
    } else {
      parts.push({ text: text });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
      }
    });

    return response.text || "No content generated.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    const msg = error.message || '';
    
    if (msg.includes('fetch') || msg.includes('NetworkError')) {
      throw new Error("Network Error: The browser failed to connect to Google's AI servers. Please check your internet connection or disable any ad-blockers that might be blocking 'generativelanguage.googleapis.com'.");
    }
    
    if (msg.includes('429') || msg.includes('quota') || msg.includes('exhausted')) {
      throw new Error("The service is currently experiencing high traffic. Please try again later.");
    } else if (msg.includes('suspended')) {
      throw new Error("CRITICAL: Your Gemini API Key has been SUSPENDED by Google. Please generate a NEW key at ai.google.dev and update your Netlify settings.");
    } else if (msg.includes('403') || msg.includes('API key') || msg.includes('permission')) {
      throw new Error("Service authentication failed. The platform administrator needs to verify the configuration.");
    } else {
      throw new Error(msg || "Failed to generate strategy");
    }
  }
};

export const generateSocialPosts = async (context: string) => {
  try {
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY as string) || 
                   (import.meta.env.VITE_API_KEY as string) ||
                   (typeof process !== 'undefined' && process.env ? (process.env.GEMINI_API_KEY || process.env.API_KEY) : null);

    if (!apiKey) {
      throw new Error("CRITICAL: API Key not found. Please ensure 'VITE_GEMINI_API_KEY' is added to your Netlify Environment Variables and redeploy.");
    }
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Based on the following business strategy context, generate specific social media posts for Instagram, Twitter (X), LinkedIn, and Facebook.
      
      CONTEXT:
      ${context.substring(0, 5000)}... [truncated]

      REQUIREMENTS:
      Return ONLY a valid JSON object.
      For EACH platform, provide an array of 3 variations:
      1. "Viral" (Aggressive, short, high engagement)
      2. "Professional" (Trust-building, authority)
      3. "Storytelling" (Emotional, longer form)

      JSON STRUCTURE:
      {
        "instagram": [
          { "style": "Viral", "caption": "...", "hashtags": "...", "image_prompt": "..." },
          { "style": "Professional", "caption": "...", "hashtags": "...", "image_prompt": "..." },
          { "style": "Storytelling", "caption": "...", "hashtags": "...", "image_prompt": "..." }
        ],
        "twitter": [
          { "style": "Viral", "thread": ["tweet1", "tweet2"] },
          { "style": "Professional", "thread": ["tweet1", "tweet2"] },
          { "style": "Storytelling", "thread": ["tweet1", "tweet2"] }
        ],
        "linkedin": [
          { "style": "Viral", "post": "..." },
          { "style": "Professional", "post": "..." },
          { "style": "Storytelling", "post": "..." }
        ],
        "facebook": [
          { "style": "Viral", "post": "..." },
          { "style": "Professional", "post": "..." },
          { "style": "Storytelling", "post": "..." }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text || "{}");
  } catch (error: any) {
    console.error("Social Gen Error", error);
    throw new Error(error.message || "Failed to generate social posts");
  }
};

// Helper function to convert File to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = error => reject(error);
  });
};
