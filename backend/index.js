import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to static export from Next.js
const outPath = path.join(__dirname, '../out');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve all static files properly
app.use('/age-calculator/_next', express.static(path.join(outPath, '_next')));
// app.use('/age-calculator/assets', express.static(path.join(outPath, 'assets')));
app.use('/age-calculator', express.static(outPath));

// Fallback: serve index.html for all SPA routes
app.get(/^\/age-calculator(?:\/.*)?$/, (req, res) => {
  res.sendFile(path.join(outPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ App running at: http://localhost:${PORT}/age-calculator`);
});
