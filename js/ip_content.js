document.addEventListener('DOMContentLoaded', function () {
    // 1. 获取页面中的显示容器
    const container = document.querySelector('.visitor-info-container');
    const locationEl = container.querySelector('.location');
    const ipEl = container.querySelector('.ip-address');
    const browserEl = container.querySelector('.browser');

    if (!container || !locationEl || !ipEl || !browserEl) {
        console.error('访客信息容器元素缺失');
        return;
    }

    // 2. 浏览器信息检测
    function getBrowserInfo() {
        const ua = navigator.userAgent;
        if (ua.includes('Edg')) {
            return `Edge ${ua.match(/Edg\/(\d+)/)[1]}`;
        } else if (ua.includes('Chrome') && !ua.includes('Edg')) {
            return `Chrome ${ua.match(/Chrome\/(\d+)/)[1]}`;
        } else if (ua.includes('Firefox')) {
            return `Firefox ${ua.match(/Firefox\/(\d+)/)[1]}`;
        } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
            return `Safari ${ua.match(/Safari\/(\d+)/)[1]}`;
        } else if (ua.includes('Opera')) {
            return `Opera ${ua.match(/Opera\/(\d+)/)[1]}`;
        } else {
            return '未知浏览器';
        }
    }

    // 3. 主动请求IP信息（核心修复）
    function fetchIPInfo() {
        // 使用fetch API主动请求数据
        fetch('https://whois.pconline.com.cn/ipJson.jsp?json=true')
            .then(response => {
                // 处理跨域可能导致的文本格式返回
                return response.text().then(text => {
                    // 去除可能的干扰字符（部分接口会加括号）
                    const cleanText = text.replace(/^[\s\S]*?\{/, '{').replace(/\}[\s\S]*?$/, '}');
                    return JSON.parse(cleanText);
                });
            })
            .then(data => {
                // 验证数据有效性
                if (data && !data.err) {
                    locationEl.textContent = data.addr || '未知地区';
                    ipEl.textContent = data.ip || '未知IP';
                } else {
                    locationEl.textContent = '获取失败';
                    ipEl.textContent = '获取失败';
                }
            })
            .catch(error => {
                console.error('IP信息获取失败:', error);
                locationEl.textContent = '获取失败';
                ipEl.textContent = '获取失败';
            });
    }

    // 4. 执行渲染
    browserEl.textContent = getBrowserInfo(); // 先显示浏览器信息
    fetchIPInfo(); // 再获取并显示IP信息
});
