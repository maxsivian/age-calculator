const next = require('next');
const express = require('express');

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Custom route (optional)
  server.get('/api/hello', (req, res) => res.json({ message: 'Hello' }));

  // Let Next.js handle everything else
  server.all('*', (req, res) => handle(req, res));

  server.listen(3000);
});
