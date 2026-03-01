import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

// Load environment variables from .env files
dotenv.config();
dotenv.config({ path: '.env.local' });

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.use(express.json());

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve the built static files
    app.use(express.static('dist'));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
