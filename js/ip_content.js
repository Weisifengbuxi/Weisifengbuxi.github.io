const ipEl = document.getElementById('ip');
const locationEl = document.getElementById('location');

// 定义获取IP信息的函数
function fetchIPInfo() {
    fetch('https://whois.pconline.com.cn/ipJson.jsp?json=true')
        .then(response => {
            // 处理跨域可能导致的文本格式返回
            return response.text().then(text => {
                // 去除可能的干扰字符
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

// 在适当的时机调用该函数，例如页面加载完成后
document.addEventListener('DOMContentLoaded', function() {
    // 如果你还有浏览器信息获取函数，也可以在这里调用
    // browserEl.textContent = getBrowserInfo();
    fetchIPInfo(); // 获取并显示IP信息
});