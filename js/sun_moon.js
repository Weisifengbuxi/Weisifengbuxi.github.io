function switchNightMode() {
  // 插入动画元素（保留原有动画）
  document.querySelector('body').insertAdjacentHTML('beforeend', '<div class="Cuteen_DarkSky"><div class="Cuteen_DarkPlanet"></div></div>');

  setTimeout(function() {
    const body = document.querySelector('body');
    const isDark = body.classList.contains('DarkMode');

    // 仅切换模式状态，不修改图标
    if (isDark) {
      body.classList.remove('DarkMode');
      localStorage.setItem('isDark', '0');
    } else {
      body.classList.add('DarkMode');
      localStorage.setItem('isDark', '1');
    }

    // 动画结束后移除元素（保留原有逻辑）
    setTimeout(function() {
      const darkSky = document.getElementsByClassName('Cuteen_DarkSky')[0];
      darkSky.style.transition = 'opacity 3s';
      darkSky.style.opacity = '0';
      setTimeout(function() {
        darkSky.remove();
      }, 1000);
    }, 2000);
  }, 0);

  // 处理主题属性和其他逻辑（保留功能，不修改图标）
  const nowMode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  if (nowMode === 'light') {
    activateDarkMode();
    saveToLocal.set('theme', 'dark', 2);
    GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night);
  } else {
    activateLightMode();
    saveToLocal.set('theme', 'light', 2);
  }

  // 处理评论区等其他逻辑（保留）
  typeof utterancesTheme === 'function' && utterancesTheme();
  typeof FB === 'object' && window.loadFBComment();
  window.DISQUS && document.getElementById('disqus_thread').children.length && setTimeout(() => window.disqusReset(), 200);
}
