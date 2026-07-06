// busuanzi 备用方案：如果 16 秒后仍显示转圈，改用 Vercel 计数器
(function () {
  const el = document.getElementById('busuanzi_value_page_pv');
  if (!el) return;

  const API = 'https://counter.weisifengbuxi.top/api/counter';
  const page = window.location.pathname;

  // 16 秒后如果还是转圈状态，说明 busuanzi 挂了，启动备用
  setTimeout(() => {
    const text = el.textContent?.trim();
    if (!text || !/^\d/.test(text)) {
      fetch(API + '?page=' + encodeURIComponent(page), { method: 'POST' })
        .then(r => r.json())
        .then(d => { if (d.count !== undefined) el.textContent = d.count; })
        .catch(() => { el.textContent = '—'; });
    }
  }, 16000);
})();
