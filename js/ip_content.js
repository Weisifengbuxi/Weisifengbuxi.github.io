// 获取当前IP地址和浏览器标识
function getBrowserInfo() {
    const agent = navigator.userAgent.toLowerCase();

    // 更全面的浏览器检测正则
    const browsers = [
        { regex: /edge\/([\d.]+)/, name: 'Edge' },
        { regex: /edg\/([\d.]+)/, name: 'Edge Chromium' },
        { regex: /opr\/([\d.]+)/, name: 'Opera' },
        { regex: /chrome\/([\d.]+)/, name: 'Chrome' },
        { regex: /firefox\/([\d.]+)/, name: 'Firefox' },
        { regex: /safari\/([\d.]+)/, name: 'Safari' },
        { regex: /rv:([\d.]+)\) like gecko/, name: 'IE 11' },
        { regex: /msie ([\d.]+)/, name: 'IE' }
    ];

    // 循环检测浏览器
    for (const browser of browsers) {
        const match = agent.match(browser.regex);
        if (match) {
            return `${browser.name} ${match[1]}`;
        }
    }

    // 无法识别时返回精简信息
    return `Unknown (${agent.substring(0, 50)}...)`;
}

// 确保DOM加载完成后再执行
document.addEventListener('DOMContentLoaded', () => {
    const ipContent = document.querySelector(".ip_content");

    // 检查DOM元素是否存在
    if (!ipContent) {
        console.warn("未找到.ip_content元素，无法显示IP信息");
        return;
    }

    // 保存原始IPCallBack（如果存在）
    const originalIPCallBack = window.IPCallBack;

    // 定义IPCallBack函数处理IP信息
    window.IPCallBack = function(data) {
        // 先调用原始回调（如果有）
        if (typeof originalIPCallBack === 'function') {
            originalIPCallBack(data);
        }

        // 检查数据有效性
        if (!data || data.err) {
            ipContent.innerHTML = '<span class="p red">无法获取IP信息</span>';
            return;
        }

        // 安全获取数据，提供默认值
        const city = data.city || '未知城市';
        const ip = data.ip || '未知IP';
        const browserInfo = getBrowserInfo();

        // 构建显示内容
        ipContent.innerHTML = `欢迎来自 <span class="p red">${city}</span> 的小伙伴<br>
                              访问IP为： <span class='p cyan'>${ip}</span><br>
                              浏览器版本：<span class='p blue'>${browserInfo}</span>`;
    };

    // 如果已有数据，立即调用
    if (window.IPData) {
        window.IPCallBack(window.IPData);
    }
});
