import { loadEnv } from 'vite';
const env = loadEnv('development', '.', '');
console.log("GEMINI_API_KEY in loadEnv:", !!env.GEMINI_API_KEY);
console.log("API_KEY in loadEnv:", !!env.API_KEY);
