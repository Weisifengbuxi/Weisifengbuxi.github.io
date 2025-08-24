//获取当前IP地址和浏览器标识
function getBrowserInfo() {
    var agent = navigator.userAgent.toLowerCase();

    var regStr_ie = /msie [\d.]+;/gi;
    var regStr_ff = /firefox\/[\d.]+/gi;
    var regStr_chrome = /chrome\/[\d.]+/gi;
    var regStr_saf = /safari\/[\d.]+/gi;
    // 新增Edge浏览器检测正则
    var regStr_edge = /edge\/[\d.]+/gi;
    var regStr_edg = /edg\/[\d.]+/gi; // 新版Edge基于Chromium的标识

    // Edge (基于Chromium的新版Edge)
    if (agent.indexOf("edg") > 0) {
        return agent.match(regStr_edg);
    }

    // 旧版Edge
    if (agent.indexOf("edge") > 0) {
        return agent.match(regStr_edge);
    }

    // IE
    if (agent.indexOf("msie") > 0) {
        return agent.match(regStr_ie);
    }

    // Firefox
    if (agent.indexOf("firefox") > 0) {
        return agent.match(regStr_ff);
    }

    // Chrome
    if (agent.indexOf("chrome") > 0) {
        return agent.match(regStr_chrome);
    }

    // Safari
    if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
        return agent.match(regStr_saf);
    }

    // 未知浏览器
    return "未知浏览器";
}

var ip_content = document.querySelector(".ip_content");

if (ip_content != null && typeof (returnCitySN) !== "undefined") {
    ip_content.innerHTML = '欢迎来自 <span class="p red">' + returnCitySN["cname"] + "</span> 的小伙伴<br>" +
                          "访问IP为： <span class='p cyan'>" + returnCitySN["cip"] + "</span><br>" +
                          "浏览器版本：<span class='p blue'>" + getBrowserInfo() + '</span>';
}
