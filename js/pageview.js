// 文章阅读量计数器 — 异步加载 + localStorage 缓存
(function () {
  const el = document.getElementById('busuanzi_value_page_pv');
  if (!el) return;

  const API = 'https://counter.weisifengbuxi.top/api/counter';
  const page = window.location.pathname;
  const CACHE_KEY = 'pv_' + page;

  // 先从缓存读取，立即显示
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) el.textContent = cached;

  // 后台异步获取最新值，不阻塞页面
  fetch(API + '?page=' + encodeURIComponent(page), { method: 'POST' })
    .then(r => r.json())
    .then(d => {
      if (d.count !== undefined) {
        el.textContent = d.count;
        localStorage.setItem(CACHE_KEY, d.count);
      }
    })
    .catch(() => {
      if (!cached) el.textContent = '—';
    });

  // 防 busuanzi 覆盖
  let checks = 0;
  const guard = setInterval(() => {
    if (el.textContent != (cached || el.textContent)) {
      el.textContent = cached || '—';
    }
    if (++checks >= 10) clearInterval(guard);
  }, 2000);
})();
