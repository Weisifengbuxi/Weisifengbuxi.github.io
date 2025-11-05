// 阻尼滚动效果 - JS部分

// 检测是否为移动设备
function isMobileDevice() {
    return window.innerWidth <= 768;
}

// 初始化阻尼滚动效果
function initDampingScroll() {
    console.log('初始化阻尼滚动效果...');
    
    // 如果是移动设备，不启用阻尼效果
    if (isMobileDevice()) {
        console.log('移动设备，使用原生滚动');
        // 恢复默认滚动行为
        document.body.style.overflow = 'auto';
        document.body.style.height = 'auto';
        
        const container = document.querySelector('.damping-container');
        const content = document.querySelector('.damping-content');
        
        if (container) {
            container.style.position = 'relative';
            container.style.height = 'auto';
            container.style.overflow = 'visible';
        }
        
        if (content) {
            content.style.transform = 'none';
            content.style.transition = 'none';
        }
        return;
    }
    
    console.log('桌面设备，启用阻尼滚动效果');
    
    const scrollbox = document.querySelector('.damping-content');
    const container = document.querySelector('.damping-container');
    
    if (!scrollbox || !container) {
        console.error('未找到必要的DOM元素');
        return;
    }
    
    // 设置 body 高度以启用滚动
    function resizeBody() {
        const height = scrollbox.offsetHeight;
        document.body.style.height = `${height}px`;
        console.log('设置body高度:', height);
    }
    
    // 滚动处理函数 - 核心阻尼效果
    function handleScroll() {
        scrollbox.style.transform = `translateY(${-window.scrollY}px)`;
    }
    
    // 事件监听
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('load', resizeBody);
    window.addEventListener('resize', function() {
        console.log('窗口大小改变，重新初始化');
        // 如果窗口大小改变导致设备类型变化，重新初始化
        initDampingScroll();
    });
    
    // 初始设置
    resizeBody();
    console.log('阻尼滚动效果初始化完成');
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDampingScroll);
} else {
    initDampingScroll();
}

// 导出函数供外部使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initDampingScroll, isMobileDevice };
}