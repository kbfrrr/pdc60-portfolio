const { createServer } = require('node:http');
const { readFile, realpath } = require('node:fs/promises');
const path = require('node:path');

const host = '127.0.0.1';
const port = 4173;
const root = path.join(__dirname, 'dist');
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

function isInside(directory, file) {
  const relative = path.relative(directory, file);
  return relative && relative !== '..' &&
    !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative);
}

async function start() {
  const publicDir = await realpath(root);
  const server = createServer(async (request, response) => {
    response.setHeader('X-PDC60-Portfolio', 'local');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Cache-Control', 'no-store');

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.setHeader('Allow', 'GET, HEAD');
      response.writeHead(405).end();
      return;
    }

    try {
      const pathname = decodeURIComponent(new URL(request.url, `http://${host}`).pathname);
      if (/[\\:\u0000]/.test(pathname)) throw new Error('Invalid path');
      const target = path.resolve(publicDir, pathname === '/' ? 'index.html' : '.' + pathname);
      if (!isInside(publicDir, target)) throw new Error('Outside portfolio');
      const contentType = types[path.extname(target).toLowerCase()];
      if (!contentType) throw new Error('Unsupported file type');
      const file = await realpath(target);
      if (!isInside(publicDir, file)) throw new Error('Outside portfolio');
      const data = await readFile(file);
      response.writeHead(200, { 'Content-Type': contentType, 'Content-Length': data.length });
      response.end(request.method === 'HEAD' ? undefined : data);
    } catch {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Page not found.');
    }
  });

  server.on('error', (error) => {
    console.error(error.code === 'EADDRINUSE' ? `Port ${port} is already in use.` : error.message);
    process.exitCode = 1;
  });
  server.listen(port, host, () => console.log(`Portfolio running at http://${host}:${port}/`));
}

start().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
