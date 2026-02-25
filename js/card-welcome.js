window.IP_CONFIG = {
    API_KEY: 'BZgtpreSF70uNpaEniAiMnRepU', // API密钥 申请地址：https://api.76.al/
    BLOG_LOCATION: {
        lng: 113.666, // 经度
        lat: 22.666 // 纬度
    },
    CACHE_DURATION: 1000 * 60 * 60, // 可配置缓存时间(默认1小时)
    HOME_PAGE_ONLY: true, // 是否只在首页显示 开启后其它页面将不会显示这个容器
};

const insertAnnouncementComponent = () => {
    // 获取所有公告卡片
    const announcementCards = document.querySelectorAll('.card-widget.card-announcement');
    if (!announcementCards.length) return;

    if (IP_CONFIG.HOME_PAGE_ONLY && !isHomePage()) {
        announcementCards.forEach(card => card.remove());
        return;
    }

    if (!document.querySelector('#welcome-info')) return;
    fetchIpInfo();
};

const getWelcomeInfoElement = () => document.querySelector('#welcome-info');

// 修正接口数据获取逻辑，适配返回结构
const fetchIpData = async () => {
    const response = await fetch(`https://api.nsmao.net/api/ipip/query?key=${encodeURIComponent(IP_CONFIG.API_KEY)}`);
    if (!response.ok) throw new Error('网络响应不正常');
    const result = await response.json();
    // 校验接口返回状态码
    if (result.code !== 200) throw new Error(result.msg || '获取IP信息失败');
    return result.data; // 直接返回接口中的data对象（包含ip、country、province等）
};

// 修正数据解析逻辑，适配经纬度字符串转数值
const showWelcome = (data) => {
    if (!data) return showErrorMessage();

    const {
        lng: lngStr,  // 接口返回的是字符串，需转换为数值
        lat: latStr,
        country,
        province,
        city,
        ip
    } = data;
    // 经纬度字符串转数值（接口返回的是字符串格式，如"113.556808"）
    const lng = parseFloat(lngStr);
    const lat = parseFloat(latStr);

    const welcomeInfo = getWelcomeInfoElement();
    if (!welcomeInfo) return;

    const dist = calculateDistance(lng, lat);
    const ipDisplay = formatIpDisplay(ip);
    const pos = formatLocation(country, province, city);

    welcomeInfo.style.display = 'block';
    welcomeInfo.style.height = 'auto';
    welcomeInfo.innerHTML = generateWelcomeMessage(pos, dist, ipDisplay, country, province, city);
};

const calculateDistance = (lng, lat) => {
    const R = 6371; // 地球半径(km)
    const rad = Math.PI / 180;
    const dLat = (lat - IP_CONFIG.BLOG_LOCATION.lat) * rad;
    const dLon = (lng - IP_CONFIG.BLOG_LOCATION.lng) * rad;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(IP_CONFIG.BLOG_LOCATION.lat * rad) * Math.cos(lat * rad) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const formatIpDisplay = (ip) => ip.includes(":") ? "<br>好复杂，咱看不懂~(ipv6)" : ip;
const formatLocation = (country, province, city) => {
    return country ? (country === "中国" ? `${province} ${city}` : country) : '神秘地区';
};

const generateWelcomeMessage = (pos, dist, ipDisplay, country, province, city) => `
    欢迎来自 <b>${pos}</b> 的朋友<br>
    您当前距博主约 <b>${dist}</b> 公里！<br>
    您的IP地址：<b class="ip-address">${ipDisplay}</b><br>
    ${getTimeGreeting()}<br>
    Tip：<b>${getGreeting(country, province, city)}</b>
`;

const addStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        #welcome-info {
            user-select: none;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 212px;
            padding: 10px;
            margin-top: 5px;
            border-radius: 12px;
            background-color: var(--anzhiyu-background);
            outline: 1px solid var(--anzhiyu-card-border);
        }
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top: 3px solid var(--anzhiyu-main);
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .ip-address {
            filter: blur(5px);
            transition: filter 0.3s ease;
        }
        .ip-address:hover {
            filter: blur(0);
        }
        .error-message {
            color: #ff6565;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .error-message p,
        .permission-dialog p {
            margin: 0;
        }
        .error-icon {
            font-size: 3rem;
        }
        #retry-button {
            margin: 0 5px;
            color: var(--anzhiyu-main);
            transition: transform 0.3s ease;
        }
        #retry-button:hover {
            transform: rotate(180deg);
        }
        .permission-dialog {
            text-align: center;
        }
        .permission-dialog button {
            margin: 10px 5px;
            padding: 5px 10px;
            border: none;
            border-radius: 5px;
            background-color: var(--anzhiyu-main);
            color: white;
            transition: opacity 0.3s ease;
        }
        .permission-dialog button:hover {
            opacity: 0.8;
        }
    `;
    document.head.appendChild(style);
};

// 位置权限相关函数
const checkLocationPermission = () => localStorage.getItem('locationPermission') === 'granted';
const saveLocationPermission = (permission) => {
    localStorage.setItem('locationPermission', permission);
};
const showLocationPermissionDialog = () => {
    const welcomeInfoElement = document.getElementById("welcome-info");
    welcomeInfoElement.innerHTML = `
        <div class="permission-dialog">
            <div class="error-icon">❓</div>
            <p>是否允许访问您的位置信息？</p>
            <button data-action="allow">允许</button>
            <button data-action="deny">拒绝</button>
        </div>
    `;

    welcomeInfoElement.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const action = e.target.dataset.action;
            const permission = action === 'allow' ? 'granted' : 'denied';
            handleLocationPermission(permission);
        }
    });
};
const handleLocationPermission = (permission) => {
    saveLocationPermission(permission);
    if (permission === 'granted') {
        showLoadingSpinner();
        fetchIpInfo();
    } else {
        showErrorMessage('您已拒绝访问位置信息');
    }
};

const showLoadingSpinner = () => {
    const welcomeInfoElement = document.querySelector("#welcome-info");
    if (!welcomeInfoElement) return;
    welcomeInfoElement.innerHTML = '<div class="loading-spinner"></div>';
};

const IP_CACHE_KEY = 'ip_info_cache';
// 修正缓存逻辑，确保缓存的是接口返回的data对象
const getIpInfoFromCache = () => {
    const cached = localStorage.getItem(IP_CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > IP_CONFIG.CACHE_DURATION) {
        localStorage.removeItem(IP_CACHE_KEY);
        return null;
    }
    return data; // 直接返回缓存的data对象
};
const setIpInfoCache = (data) => {
    localStorage.setItem(IP_CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
    }));
};

// 修正IP信息获取逻辑，适配新数据结构
const fetchIpInfo = async () => {
    if (!checkLocationPermission()) {
        showLocationPermissionDialog();
        return;
    }

    showLoadingSpinner();

    const cachedData = getIpInfoFromCache();
    if (cachedData) {
        showWelcome(cachedData); // 直接传入缓存的data对象
        return;
    }

    try {
        const data = await fetchIpData(); // 此时data是接口返回的data对象
        setIpInfoCache(data);
        showWelcome(data); // 传入接口返回的data对象
    } catch (error) {
        console.error('获取IP信息失败:', error);
        showErrorMessage();
    }
};

const greetings = {
    "中国": {
        "北京": "北——京——欢迎你~~~",
        "天津": "讲段相声吧",
        "河北": "山势巍巍成壁垒，天下雄关铁马金戈由此向，无限江山",
        "山西": "展开坐具长三尺，已占山河五百余",
        "内蒙古自治区": "天苍苍，野茫茫，风吹草低见牛羊",
        "辽宁": "我想吃烤鸡架！",
        "吉林": "状元阁就是东北烧烤之王",
        "黑龙江": "很喜欢哈尔滨大剧院",
        "上海": "众所周知，中国只有两个城市",
        "重庆": "山城重庆，火锅之都",
        "江苏": {
            "南京": "这是我挺想去的城市啦",
            "苏州": "上有天堂，下有苏杭",
            "其他": "散装是必须要散装的"
        },
        "浙江": {
            "杭州": "东风渐绿西湖柳，雁已还人未南归",
            "其他": "望海楼明照曙霞,护江堤白蹋晴沙"
        },
        "河南": {
            "郑州": "豫州之域，天地之中",
            "信阳": "品信阳毛尖，悟人间芳华",
            "南阳": "臣本布衣，躬耕于南阳此南阳非彼南阳！",
            "驻马店": "峰峰有奇石，石石挟仙气嵖岈山的花很美哦！",
            "开封": "刚正不阿包青天",
            "洛阳": "洛阳牡丹甲天下",
            "其他": "可否带我品尝河南烩面啦？"
        },
        "安徽": "蚌埠住了，芜湖起飞",
        "福建": "井邑白云间，岩城远带山",
        "江西": "落霞与孤鹜齐飞，秋水共长天一色",
        "山东": "遥望齐州九点烟，一泓海水杯中泻",
        "湖北": {
            "黄冈": "红安将军县！辈出将才！",
            "其他": "来碗热干面~"
        },
        "湖南": "74751，长沙斯塔克",
        "广东": {
            "广州": "花城广州，欢迎你~",
            "深圳": "今天你逛商场了嘛~",
            "阳江": "阳春合水！博主家乡~ 欢迎来玩~",
            "珠海": "珠玑璀璨传千古，渔歌悠扬荡天涯",
            "其他": "来两斤福建人~"
        },
        "广西壮族自治区": "桂林山水甲天下",
        "海南": {
            "海口": "朝观日出逐白浪，夕看云起收霞光",
            "陵水": "朝观日出逐白浪，夕看云起收霞光"
        },
        "四川": "康康川妹子",
        "贵州": "茅台，学生，再塞200",
        "云南": "玉龙飞舞云缠绕，万仞冰川直耸天",
        "西藏自治区": "躺在茫茫草原上，仰望蓝天",
        "陕西": "来份臊子面加馍",
        "甘肃": "羌笛何须怨杨柳，春风不度玉门关",
        "青海": "牛肉干和老酸奶都好好吃",
        "宁夏回族自治区": "大漠孤烟直，长河落日圆",
        "新疆维吾尔自治区": "驼铃古道丝绸路，胡马犹闻唐汉风",
        "台湾": "我在这头，大陆在那头",
        "香港特别行政区": "永定贼有残留地鬼嚎，迎击光非岁玉",
        "澳门特别行政区": "性感荷官，在线发牌",
        "其他": "带我去你的城市逛逛吧！"
    },
    "美国": "Let us live in peace!",
    "日本": "よろしく、一緒に桜を見ませんか",
    "俄罗斯": "干了这瓶伏特加！",
    "法国": "C'est La Vie",
    "德国": "Die Zeit verging im Fluge.",
    "澳大利亚": "一起去大堡礁吧！",
    "加拿大": "拾起一片枫叶赠予你",
    "英国": "Keep Calm and Carry On",
    "意大利": "La vita è bella!",
    "西班牙": "¡La vida es bella!",
    "巴西": "A vida é bela!",
    "印度": "जीवन सुंदर है!",
    "墨西哥": "¡La vida es bella!",
    "南非": "人生美好！",
    "埃及": "الحياة جميلة!",
    "土耳其": "Hayat güzeldir!",
    "韩国": "인생은 아름다워!",
    "越南": "Cuộc sống thật đẹp!",
    "泰国": "ชีวิตนั้นช่างงดงาม!",
    "菲律宾": "Ang buhay ay maganda!",
    "马来西亚": "Hidup itu indah!",
    "新加坡": "Life is beautiful!",
    "印尼": "Hidup itu indah!",
    "沙特阿拉伯": "الحياة جميلة!",
    "阿联酋": "الحياة جميلة!",
    "以色列": "החיים יפים!",
    "荷兰": "Het leven is mooi!",
    "比利时": "Het leven is mooi!",
    "瑞士": "Das Leben ist schön!",
    "瑞典": "Livet är vackert!",
    "挪威": "Livet er vakkert!",
    "丹麦": "Livet er smukt!",
    "芬兰": "Elämä on kaunista!",
    "波兰": "Życie jest piękne!",
    "捷克共和国": "Život je krásný!",
    "希腊": "Η ζωή είναι όμορφη!",
    "葡萄牙": "A vida é bela!",
    "其他": "带我去你的国家逛逛吧"
};

// 修正个性化问候逻辑，确保正确匹配country→province→city
const getGreeting = (country, province, city) => {
    // 优先匹配国家层级
    const countryGreeting = greetings[country] || greetings["其他"];
    if (typeof countryGreeting === 'string') {
        return countryGreeting;
    }
    // 国家层级是对象，继续匹配省份
    const provinceGreeting = countryGreeting[province] || countryGreeting["其他"];
    if (typeof provinceGreeting === 'string') {
        return provinceGreeting;
    }
    // 省份层级是对象，继续匹配城市
    return provinceGreeting[city] || provinceGreeting["其他"] || countryGreeting["其他"];
};

const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6)  return "深夜了🌙 ，注意休息呀~"; // 0-5点：凌晨
    if (hour < 11) return "早上好🌤️ ，一日之计在于晨";
    if (hour < 13) return "中午好☀️ ，记得午休喔~";
    if (hour < 17) return "下午好🕞 ，饮茶先啦！";
    if (hour < 19) return "即将下班🚶‍♂️，记得按时吃饭~";
    return "晚上好🌙 ，夜生活嗨起来！";
};

const showErrorMessage = (message = '抱歉，无法获取信息') => {
    const welcomeInfoElement = document.getElementById("welcome-info");
    welcomeInfoElement.innerHTML = `
        <div class="error-message">
            <div class="error-icon">😕</div>
            <p>${message}</p>
            <p>请<i id="retry-button" class="fa-solid fa-arrows-rotate"></i>重试或检查网络连接</p>
        </div>
    `;

    document.getElementById('retry-button').addEventListener('click', fetchIpInfo);
};

const isHomePage = () => {
    return window.location.pathname === '/' || window.location.pathname === '/index.html';
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    addStyles();
    insertAnnouncementComponent();
    document.addEventListener('pjax:complete', insertAnnouncementComponent);
});