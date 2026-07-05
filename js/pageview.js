// 文章阅读量计数器 — 自建 Vercel API + 防 busuanzi 覆盖
(async function () {
  const el = document.getElementById('busuanzi_value_page_pv');
  if (!el) return;

  const API = 'https://blog-counter-gamma.vercel.app/api/counter';
  const page = window.location.pathname;
  let count = null;

  try {
    const res = await fetch(`${API}?page=${encodeURIComponent(page)}`, { method: 'POST' });
    const data = await res.json();
    if (data.count !== undefined) {
      count = data.count;
      el.textContent = count;
    }
  } catch (_) {
    el.textContent = '—';
  }

  // 防 busuanzi 超时覆盖：每 2 秒检查一次，持续 20 秒
  let checks = 0;
  const guard = setInterval(() => {
    if (count !== null && el.textContent != count) {
      el.textContent = count;
    }
    if (++checks >= 10) clearInterval(guard);
  }, 2000);
})();
