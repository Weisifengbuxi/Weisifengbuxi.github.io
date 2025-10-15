/**
 * @description 实现medium的渐进加载背景的效果（融合滚动动画）
 */
(function() {
  // 定义ProgressiveLoad类
  class ProgressiveLoad {
    constructor(smallSrc, largeSrc) {
      this.smallSrc = smallSrc;
      this.largeSrc = largeSrc;
      this.initScrollListener(); // 新增滚动监听初始化
      this.initTpl();
      // 移除小图隐藏逻辑，保留小图用于滚动动画过渡
    }

    /**
     * @description 初始化滚动监听（新增）
     * 滚动时更新--process变量控制动画
     */
    initScrollListener() {
      // 使用箭头函数绑定this上下文
      this.handleScroll = () => {
        // 计算滚动进度（0-1范围），可改为0.3限制前30%渐变
        const process = Math.min(window.scrollY / window.innerHeight, 1);
        this.container.style.setProperty("--process", process);
      };
      window.addEventListener("scroll", this.handleScroll);
    }

    /**
     * @description 生成ui模板
     */
    initTpl() {
      this.container = document.createElement('div');
      this.smallStage = document.createElement('div');
      this.largeStage = document.createElement('div');
      this.smallImg = new Image();
      this.largeImg = new Image();

      this.container.className = 'pl-container';
      // 初始化--process变量为0
      this.container.style.setProperty("--process", 0);
      this.smallStage.className = 'pl-img pl-blur';
      this.largeStage.className = 'pl-img';

      this.container.appendChild(this.smallStage);
      this.container.appendChild(this.largeStage);

      this.smallImg.onload = this._onSmallLoaded.bind(this);
      this.largeImg.onload = this._onLargeLoaded.bind(this);
    }

    /**
     * @description 加载背景
     */
    progressiveLoad() {
      this.smallImg.src = this.smallSrc;
      this.largeImg.src = this.largeSrc;
    }

    /**
     * @description 大图加载完成
     */
    _onLargeLoaded() {
      this.largeStage.classList.add('pl-visible');
      this.largeStage.style.backgroundImage = `url('${this.largeSrc}')`;
    }

    /**
     * @description 小图加载完成
     */
    _onSmallLoaded() {
      this.smallStage.classList.add('pl-visible');
      this.smallStage.style.backgroundImage = `url('${this.smallSrc}')`;
    }

    /**
     * @description 清理资源（新增）
     * 防止内存泄漏
     */
    destroy() {
      window.removeEventListener("scroll", this.handleScroll);
    }
  }

  const executeLoad = (config, target) => {
    console.log('执行渐进背景替换');
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const loader = new ProgressiveLoad(
      isMobile ? config.mobileSmallSrc : config.smallSrc,
      isMobile ? config.mobileLargeSrc : config.largeSrc
    );
    // 和背景图颜色保持一致，防止高斯模糊后差异较大
    if (target.children[0]) {
      target.insertBefore(loader.container, target.children[0]);
    }
    loader.progressiveLoad();

    // 存储实例用于后续清理
    target.progressiveLoader = loader;
  };

  const config = {
    smallSrc: '/img/background.jpg', // 小图链接 尽可能配置小于100k的图片
    largeSrc: '/img/background.jpg', // 大图链接 最终显示的图片
    mobileSmallSrc: '/img/background.jpg', // 手机端小图链接
    mobileLargeSrc: '/img/background.jpg', // 手机端大图链接
    enableRoutes: ['/'],
  };

  function initProgressiveLoad(config) {
    // 每次加载前先清除已有的元素和事件监听
    const container = document.querySelector('.pl-container');
    const target = document.getElementById('page-header');
    if (target && target.progressiveLoader) {
      target.progressiveLoader.destroy();
    }
    if (container) {
      container.remove();
    }

    if (target && target.classList.contains('full_page')) {
      executeLoad(config, target);
    }
  }

  function onPJAXComplete(config) {
    const target = document.getElementById('page-header');
    if (target && target.classList.contains('full_page')) {
      initProgressiveLoad(config);
    }
  }

  document.addEventListener("DOMContentLoaded", function() {
    initProgressiveLoad(config);
  });

  document.addEventListener("pjax:complete", function() {
    onPJAXComplete(config);
  });

})();
