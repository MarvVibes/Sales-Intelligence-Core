
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../types";

/**
 * Helper to convert a File object to a Base64 string
 */
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the Data-URL prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateStrategy = async (text: string, imageFile: File | undefined): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing from the environment.");
  }

  try {
    // Initialize the client with the environment key
    const ai = new GoogleGenAI({ apiKey: apiKey });
    const model = "gemini-2.5-flash";
    
    const parts: any[] = [];

    if (imageFile) {
      const imagePart = await fileToGenerativePart(imageFile);
      parts.push(imagePart);
      // If image is present but no text, add a default prompt
      parts.push({ text: text || "Analyze this product image and provide a comprehensive market strategy." });
    } else {
      parts.push({ text: text });
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        // We use a slightly higher temperature for creative marketing copy
        temperature: 0.8, 
      }
    });

    return response.text || "No content generated.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    const msg = error.message || '';

    // Specific handling for Quota limits (429)
    if (msg.includes('429') || msg.includes('quota') || msg.includes('exhausted')) {
        throw new Error("Your API Key daily quota is exceeded. Please use a different Google API Key.");
    }

    // Specific handling for Auth issues (403)
    if (msg.includes('403') || msg.includes('API key') || msg.includes('permission')) {
        throw new Error("Invalid API Key. Please check your configuration.");
    }
    
    throw error;
  }
};

export const generateSocialPosts = async (context: string) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("API Key is missing from the environment.");

  const ai = new GoogleGenAI({ apiKey: apiKey });
  const model = "gemini-2.5-flash";

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

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Social Gen Error", error);
    return null;
  }
};
