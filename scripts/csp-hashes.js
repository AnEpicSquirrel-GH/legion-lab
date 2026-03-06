// SHA-256 for CSP script hashes (run: node scripts/csp-hashes.js)
const createHash = require('./lib/sha256');
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const regex = /<script(?![^>]*\bsrc\s*=)[^>]*>([\s\S]*?)<\/script>/gi;
let m;
const scripts = [];
while ((m = regex.exec(html)) !== null) {
  if (m[1]) scripts.push(m[1]);
}
scripts.forEach((s) => {
  const hash = createHash('sha256').update(s, 'utf8').digest('base64');
  console.log('sha256-' + hash);
});
