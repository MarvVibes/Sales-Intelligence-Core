import dotenv from 'dotenv';
dotenv.config();
dotenv.config({ path: '.env.local' });
console.log(process.env.GEMINI_API_KEY ? "EXISTS" : "MISSING");
