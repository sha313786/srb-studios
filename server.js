// Zero-dependency static preview server for SRB Studio with automatic port fallback
const http = require('http');
const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

// In-Memory IP Rate Limiter & Spam Catcher for Leads API
const ipRateLimits = new Map();
const MAX_REQUESTS_PER_WINDOW = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'tempmail.com', '10minutemail.com',
  'trashmail.com', 'dispostable.com', 'getairmail.com', 'sharklasers.com',
  'throwawaymail.com', 'yopmail.com', 'burnermail.io', 'dropmail.me'
]);

const SPAM_REGEX_PATTERNS = [
  /\b(casino|viagra|cialis|crypto\s*giveaway|bitcoin\s*investment)\b/i,
  /\b(seo\s*backlinks?|rank\s*#1|telegram\s*blast|whatsapp\s*blaster)\b/i,
  /t\.me\/[a-zA-Z0-9_]+/i
];

// Periodic cleanup of rate limits every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ipRateLimits.entries()) {
    if (now - data.firstRequest > WINDOW_MS) {
      ipRateLimits.delete(ip);
    }
  }
}, 5 * 60 * 1000);

const server = http.createServer((req, res) => {
  // Handle POST /api/consultation endpoint with Spam Catcher Shield
  if (req.method === 'POST' && req.url.startsWith('/api/consultation')) {
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';

    // 1. IP Rate Limiting
    const now = Date.now();
    const ipData = ipRateLimits.get(clientIp) || { count: 0, firstRequest: now };
    if (now - ipData.firstRequest > WINDOW_MS) {
      ipData.count = 1;
      ipData.firstRequest = now;
    } else {
      ipData.count++;
    }
    ipRateLimits.set(clientIp, ipData);

    if (ipData.count > MAX_REQUESTS_PER_WINDOW) {
      console.warn(`⚠️ [SPAM CATCHER] Rate limit exceeded from IP: ${clientIp}`);
      res.writeHead(429, { 'Content-Type': 'application/json; charset=UTF-8', 'Access-Control-Allow-Origin': '*' });
      return res.end(JSON.stringify({ success: false, error: 'Too many requests. Please try again later.' }));
    }

    let body = '';
    let bodyBytes = 0;
    const MAX_BODY_BYTES = 25000; // 25 KB limit

    req.on('data', chunk => {
      bodyBytes += chunk.length;
      if (bodyBytes > MAX_BODY_BYTES) {
        req.destroy();
      } else {
        body += chunk;
      }
    });

    req.on('end', () => {
      try {
        const lead = JSON.parse(body || '{}');
        lead.receivedAt = new Date().toISOString();
        lead.clientIp = clientIp;

        // 2. Honeypot Verification
        if (lead.company_website_url && lead.company_website_url.trim().length > 0) {
          console.warn(`🛡️ [SPAM CATCHER] Honeypot triggered by ${clientIp} (${lead.name || 'Bot'})`);
          lead.status = 'spam_honeypot_trap';
        }

        // 3. Disposable Domain & Keyword Scoring
        const emailDomain = (lead.email || '').split('@')[1]?.toLowerCase();
        if (emailDomain && DISPOSABLE_DOMAINS.has(emailDomain)) {
          console.warn(`🛡️ [SPAM CATCHER] Disposable domain rejected: ${emailDomain}`);
          lead.status = 'spam_disposable_email';
        }

        const fullText = `${lead.name || ''} ${lead.notes || ''} ${lead.message || ''}`;
        for (const pattern of SPAM_REGEX_PATTERNS) {
          if (pattern.test(fullText)) {
            console.warn(`🛡️ [SPAM CATCHER] Spam keyword heuristic flagged:`, pattern);
            lead.status = 'spam_keyword_heuristic';
            break;
          }
        }

        if (!lead.status) {
          lead.status = 'verified';
        }

        const leadsDir = path.join(__dirname, '.data'); if (!fs.existsSync(leadsDir)) fs.mkdirSync(leadsDir, { recursive: true }); const leadsFile = path.join(leadsDir, 'leads.json');
        let leads = [];
        if (fs.existsSync(leadsFile)) {
          try { leads = JSON.parse(fs.readFileSync(leadsFile, 'utf8')); } catch (_) {}
        }
        leads.unshift(lead);
        fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2), 'utf8');

        if (lead.status === 'verified') {
          console.log(`\n📬 [NEW PROJECT REQUEST RECEIVED] from ${lead.name} (${lead.email}) - Service: ${lead.service || lead.budget}`);
        } else {
          console.log(`\n🛡️ [SPAM TRAPPED & RECORDED] from ${lead.name || 'Bot'} (${lead.email || 'N/A'}) - Flag: ${lead.status}`);
        }

        res.writeHead(200, {
          'Content-Type': 'application/json; charset=UTF-8',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({
          success: true,
          status: lead.status,
          message: 'Consultation request processed successfully'
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=UTF-8' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  let safePath = path.normalize(decodeURI(req.url.split('?')[0])).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') safePath = '/index.html';

  const filePath = path.join(__dirname, safePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end('404 Not Found - SRB Studio');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end(`500 Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });
      res.end(content);
    }
  });
});

function startServer(port) {
  server.listen(port, () => {
    console.log(`\n======================================================`);
    console.log(` ✨ SRB STUDIO LIVE SERVER RUNNING ON:`);
    console.log(` 🚀 http://localhost:${port}`);
    console.log(`======================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

const START_PORT = parseInt(process.env.PORT || '5173', 10);
startServer(START_PORT);
