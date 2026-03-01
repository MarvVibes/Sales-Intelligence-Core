import { loadEnv } from 'vite';
const env = loadEnv('development', '.', '');
console.log(Object.keys(env).filter(k => k.includes('GEMINI')));
