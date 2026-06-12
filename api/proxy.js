import gplay from 'google-play-scraper';

/**
 * google-play-scraper 统一 API 代理
 *
 * 通过 ?method=xxx 动态调用 npm 包的所有方法，参数直接透传。
 * 上游包新增方法后，安装新版即可自动支持。
 *
 * 用法示例：
 *   GET /api/proxy?method=app&appId=com.flyersoft.moonreaderp
 *   GET /api/proxy?method=search&term=panda&num=5
 *   GET /api/proxy?method=reviews&appId=com.dxco.pandavszombies&sort=RATING&num=10
 *   GET /api/proxy?method=list&collection=TOP_FREE&category=GAME_ACTION&num=3
 *   GET /api/proxy?method=similar&appId=com.dxco.pandavszombies
 *   GET /api/proxy?method=developer&devId=Google+LLC
 *   GET /api/proxy?method=suggest&term=panda
 *   GET /api/proxy?method=permissions&appId=com.dxco.pandavszombies
 *   GET /api/proxy?method=datasafety&appId=com.dxco.pandavszombies
 *   GET /api/proxy?method=categories
 */

const NUMERIC_PARAMS = new Set(['num', 'count', 'throttle', 'score']);
const BOOLEAN_PARAMS = new Set(['fullDetail', 'short', 'paginate', 'free']);

function castParams(raw) {
  const params = {};
  for (const [key, val] of Object.entries(raw)) {
    if (key === 'method') continue;
    if (val === undefined || val === '') continue;
    if (BOOLEAN_PARAMS.has(key)) {
      params[key] = val === 'true' || val === true;
    } else if (NUMERIC_PARAMS.has(key)) {
      const n = Number(val);
      params[key] = Number.isNaN(n) ? val : n;
    } else {
      params[key] = val;
    }
  }
  return params;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const method = req.query.method;
  if (!method) {
    return res.status(400).json({
      error: 'Missing "method" parameter',
      hint: 'e.g. /api/proxy?method=app&appId=com.flyersoft.moonreaderp',
      methods: Object.keys(gplay).filter(k => typeof gplay[k] === 'function'),
    });
  }

  const fn = gplay[method];
  if (typeof fn !== 'function') {
    return res.status(400).json({
      error: `Method "${method}" not found`,
      methods: Object.keys(gplay).filter(k => typeof gplay[k] === 'function'),
    });
  }

  try {
    const params = castParams(req.query);
    const result = await fn(params);
    return res.status(200).json({ ok: true, method, data: result });
  } catch (error) {
    console.error(`[proxy] ${method} failed:`, error.message);
    return res.status(500).json({ ok: false, method, error: error.message });
  }
}
