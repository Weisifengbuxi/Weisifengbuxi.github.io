//获取当前IP地址和浏览器标识
function getBrowserInfo() {
    var agent = navigator.userAgent.toLowerCase();

    var regStr_ie = /msie [\d.]+;/gi;
    var regStr_ff = /firefox\/[\d.]+/gi
    var regStr_chrome = /chrome\/[\d.]+/gi;
    var regStr_saf = /safari\/[\d.]+/gi;

    //IE
    if (agent.indexOf("msie") > 0) {
        return agent.match(regStr_ie);
    }

    //firefox
    if (agent.indexOf("firefox") > 0) {
        return agent.match(regStr_ff);
    }

    //Chrome
    if (agent.indexOf("chrome") > 0) {
        return agent.match(regStr_chrome);
    }

    //Safari
    if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
        return agent.match(regStr_saf);
    }

    // 新增：返回其他浏览器信息
    return agent;
}

var ip_content = document.querySelector(".ip_content");

// 定义IPCallBack函数处理新格式的IP信息
function IPCallBack(data) {
    // 检查DOM元素是否存在且数据有效
    if (ip_content != null && data && !data.err) {
        // 构建显示内容，映射新的数据字段
        ip_content.innerHTML = '欢迎来自 <span class="p red">' + data.city + "</span> 的小伙伴<br>" +
                              "访问IP为： <span class='p cyan'>" + data.ip + "</span><br>" +
                              "浏览器版本：<span class='p blue'>" + getBrowserInfo() + '</span>';
    }
}

// 如果IPCallBack已存在，立即调用处理已有的数据
if (window.IPCallBack) {
    // 这里不需要重新定义，而是确保我们的处理函数能被调用
    // 实际场景中，通常是第三方脚本会调用这个函数传递数据
}
