import gplay from 'google-play-scraper';
// Vercel Serverless Function 入 口
export default async function handler(req, res) {
  // 仅 允 许  GET 请 求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  // 从 请 求 参 数 中 获 取 配 置 ， 默 认 为  Moon+ Reader Pro 美 区
  const appId = req.query.id || 'com.flyersoft.moonreaderp';
  const country = req.query.country || 'us';
  const lang = req.query.lang || 'en';
  try {
    // 调 用  scraper 获 取 应 用 详 情
    const appData = await gplay.app({ appId, country, lang });
    // 返 回 前 端 /Worker需 要 的 关 键 信 息
    return res.status(200).json({
      ok: true,
      appId: appData.appId,
      title: appData.title,
      price: appData.price,         // 数 字 类 型 ， 例 如  5.99
      currency: appData.currency,   // 货 币 代 码 ， 例 如  'USD'
      free: appData.free,           // 是 否 免 费
      priceText: appData.priceText  // 原 始 文 本 ， 例 如  'USD 5.99'
    });
  } catch (error) {
    console.error('Scraping failed:', error.message);
    return res.status(500).json({
      ok: false,
      error: 'Failed to fetch app data from Google Play',
      details: error.message
    });
  }
}
