const http = require('http');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');

if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .forEach((line) => {
      const [name, ...rest] = line.split('=');
      const key = name.trim();
      const value = rest.join('=').trim();
      if (key && !process.env[key]) {
        process.env[key] = value;
      }
    });
}

const PORT = Number(process.env.NAVER_PLACE_PROXY_PORT || 5174);
const HOST = process.env.NAVER_PLACE_PROXY_HOST || '127.0.0.1';
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID || '';
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET || '';
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = Number(process.env.NAVER_PLACE_PROXY_RATE_LIMIT || 60);
const MAX_QUERY_LENGTH = Number(process.env.NAVER_PLACE_MAX_QUERY_LENGTH || 120);
const requestBuckets = new Map();

function getAllowedOrigin(request) {
  const origin = request.headers.origin || 'http://127.0.0.1:5173';
  if (/^http:\/\/(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+|192\.168\.\d+\.\d+)(:\d+)?$/.test(origin)) {
    return origin;
  }

  return 'http://127.0.0.1:5173';
}

function sendJson(request, response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': getAllowedOrigin(request),
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store',
    'Referrer-Policy': 'no-referrer',
    'Vary': 'Origin',
    'X-Content-Type-Options': 'nosniff'
  });
  response.end(JSON.stringify(payload));
}

function getQueryParam(requestUrl, name) {
  const parsed = new URL(requestUrl, `http://127.0.0.1:${PORT}`);
  return parsed.searchParams.get(name)?.trim() || '';
}

function isRateLimited(request) {
  const key = request.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const bucket = requestBuckets.get(key) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };

  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }

  bucket.count += 1;
  requestBuckets.set(key, bucket);

  for (const [bucketKey, value] of requestBuckets) {
    if (now > value.resetAt) {
      requestBuckets.delete(bucketKey);
    }
  }

  return bucket.count > RATE_LIMIT_MAX_REQUESTS;
}

const server = http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    sendJson(request, response, 200, { ok: true });
    return;
  }

  if (request.method !== 'GET') {
    sendJson(request, response, 405, { ok: false, message: 'GET 요청만 사용할 수 있어요.' });
    return;
  }

  if (!request.url?.startsWith('/api/naver/local')) {
    sendJson(request, response, 404, { ok: false, message: '없는 API 경로예요.' });
    return;
  }

  if (isRateLimited(request)) {
    sendJson(request, response, 429, { ok: false, message: '네이버 장소 검색 요청이 너무 많아요. 잠시 후 다시 시도해 주세요.' });
    return;
  }

  if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
    sendJson(request, response, 503, {
      ok: false,
      code: 'NAVER_KEYS_MISSING',
      message: '네이버 API 키가 설정되지 않았어요. .env.local에 NAVER_CLIENT_ID와 NAVER_CLIENT_SECRET을 설정해 주세요.'
    });
    return;
  }

  const query = getQueryParam(request.url, 'query');
  if (!query) {
    sendJson(request, response, 400, { ok: false, message: '검색할 상호명이나 주소가 필요해요.' });
    return;
  }

  if (query.length > MAX_QUERY_LENGTH) {
    sendJson(request, response, 400, { ok: false, message: `검색어는 ${MAX_QUERY_LENGTH}자 이하로 입력해 주세요.` });
    return;
  }

  try {
    const naverResponse = await fetch(`https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query)}&display=5&start=1&sort=random`, {
      headers: {
        'X-Naver-Client-Id': NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
      }
    });
    const payload = await naverResponse.json();

    if (!naverResponse.ok) {
      sendJson(request, response, naverResponse.status, {
        ok: false,
        message: payload.errorMessage || '네이버 장소 검색에 실패했어요.'
      });
      return;
    }

    sendJson(request, response, 200, {
      ok: true,
      items: Array.isArray(payload.items) ? payload.items : []
    });
  } catch {
    sendJson(request, response, 502, { ok: false, message: '네이버 장소 검색 서버에 연결하지 못했어요.' });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Naver place proxy is running at http://${HOST}:${PORT}`);
});
