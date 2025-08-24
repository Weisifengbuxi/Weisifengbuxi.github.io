window.onload = function() {
    // 搜狐接口全局变量 returnCitySN
    const ip = returnCitySN ? returnCitySN.cip : '未知';
    const ipElement = document.createElement('div');
    ipElement.style.position = 'fixed';
    ipElement.style.bottom = '20px';
    ipElement.style.right = '20px';
    ipElement.innerHTML = `你的公网 IP：${ip}`;
    document.body.appendChild(ipElement);
};