// 文章阅读量 — 即时显示 + 后台同步
(function () {
  const el = document.getElementById('busuanzi_value_page_pv');
  if (!el) return;

  const page = window.location.pathname;
  const API = 'https://counter.weisifengbuxi.top/api/counter';
  const CACHE_KEY = 'pv_' + page;
  const CACHE_TIME_KEY = 'pv_time_' + page;

  // 1. 优先从缓存读取，立即显示，零等待
  const cached = localStorage.getItem(CACHE_KEY);
  const cacheTime = localStorage.getItem(CACHE_TIME_KEY);
  if (cached) {
    el.textContent = cached;
    // 缓存不超过 30 分钟，超时后台刷新
    if (Date.now() - parseInt(cacheTime) < 30 * 60 * 1000) return;
  }

  // 2. 后台异步获取，不阻塞页面
  const CACHE_NS = 'blog_pv';
  const now = Date.now();
  const today = new Date().toDateString();

  // 每天每篇文章只发一次 POST（减少请求）
  const lastSent = localStorage.getItem(CACHE_KEY + '_sent');
  const shouldPost = lastSent !== today;

  const method = shouldPost ? 'POST' : 'GET';
  fetch(API + '?page=' + encodeURIComponent(page), { method })
    .then(r => r.json())
    .then(d => {
      if (d.count !== undefined) {
        el.textContent = d.count;
        localStorage.setItem(CACHE_KEY, d.count);
        localStorage.setItem(CACHE_TIME_KEY, Date.now());
        if (shouldPost) localStorage.setItem(CACHE_KEY + '_sent', today);
      }
    })
    .catch(() => {
      if (!cached) el.textContent = '—';
    });

  // 3. 防 busuanzi 覆盖
  let checks = 0;
  const guard = setInterval(() => {
    if (!/^\d/.test(el.textContent || '')) {
      el.textContent = cached || '—';
    }
    if (++checks >= 10) clearInterval(guard);
  }, 1500);
})();
