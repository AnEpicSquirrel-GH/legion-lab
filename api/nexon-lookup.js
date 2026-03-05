/**
 * Serverless character lookup for Legion Lab (Vercel).
 * Fetches from Nexon ranking API; used by the GitHub Pages app so search is fast and reliable.
 * Deploy with Vercel and set LOOKUP_API_BASE_URL in the app to this deployment's URL.
 */
const NEXON_RANKING_API_BASE = 'https://www.nexon.com/api/maplestory/no-auth/ranking/v2';
const NEXON_RANKINGS_BASE = 'https://www.nexon.com/maplestory/rankings';
const NEXON_WORLD_ID_TO_NAME = { 1: 'Bera', 19: 'Scania', 45: 'Kronos', 70: 'Hyperion' };
const FETCH_TIMEOUT_MS = 8000;

function isLikelyPromoImage(url) {
  if (!url || typeof url !== 'string') return true;
  const u = url.toLowerCase();
  if (/\d{3,4}x\d{3,4}/.test(u)) return true;
  if (/one-punch|onepunch|promo|banner|update\.jpg|event|collab|v267|1200x630/.test(u)) return true;
  return false;
}

function parseNexonRankingApiResponse(body, searchName) {
  try {
    const data = typeof body === 'string' ? JSON.parse(body) : body;
    if (!data || !Array.isArray(data.ranks) || data.ranks.length === 0) return null;
    const lowerName = (searchName || '').trim().toLowerCase();
    const char = data.ranks.find(c => (c.characterName || '').toLowerCase() === lowerName)
      || data.ranks.find(c => (c.characterName || '').toLowerCase().includes(lowerName))
      || data.ranks[0];
    const img = char.characterImgURL || char.characterImage || char.image;
    const worldName = (char.worldID != null && NEXON_WORLD_ID_TO_NAME[char.worldID]) ? NEXON_WORLD_ID_TO_NAME[char.worldID] : null;
    return {
      name: char.characterName || searchName || '',
      level: char.level != null ? Number(char.level) : null,
      cls: char.jobName || char.job || char.characterClass || null,
      world: worldName,
      imageUrl: img && !isLikelyPromoImage(img) ? String(img).trim() : null,
    };
  } catch (_) {
    return null;
  }
}

const ALLOW_ORIGINS = [
  'https://anepicsquirrel-gh.github.io',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5000',
];

function corsHeaders(origin) {
  const allowed = ALLOW_ORIGINS.find(o => origin === o || (origin && origin.replace(/\/$/, '') === o));
  const allow = allowed || ALLOW_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

module.exports = async function handler(req, res) {
  const origin = req.headers.origin || '';
  const headers = { 'Content-Type': 'application/json', ...corsHeaders(origin) };

  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    res.writeHead(405, headers);
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  const name = (req.query.name || '').trim();
  if (!name) {
    res.writeHead(400, headers);
    res.end(JSON.stringify({ error: 'Missing name' }));
    return;
  }

  const r = (req.query.region || 'north-america').toLowerCase().replace(/\s/g, '');
  const apiRegion = r === 'europe' ? 'eu' : 'na';
  const apiUrl = `${NEXON_RANKING_API_BASE}/${apiRegion}?type=overall&id=legendary&reboot_index=0&page_index=1&character_name=${encodeURIComponent(name)}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': NEXON_RANKINGS_BASE + '/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      res.writeHead(response.status >= 500 ? 502 : response.status, headers);
      res.end(JSON.stringify({ error: 'Nexon API returned ' + response.status }));
      return;
    }

    const body = await response.text();
    const result = parseNexonRankingApiResponse(body, name);
    if (!result || (result.level == null && !result.cls && !result.imageUrl)) {
      res.writeHead(200, headers);
      res.end(JSON.stringify({ name, level: null, cls: null, world: null, imageUrl: null, error: 'Not found' }));
      return;
    }

    result.name = result.name || name;
    res.writeHead(200, headers);
    res.end(JSON.stringify(result));
  } catch (e) {
    clearTimeout(timeout);
    const isTimeout = e.name === 'AbortError';
    res.writeHead(502, headers);
    res.end(JSON.stringify({ error: isTimeout ? 'Request timed out' : (e.message || 'Lookup failed') }));
  }
}
