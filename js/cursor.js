var CURSOR;

// 线性插值函数
Math.lerp = (a, b, n) => (1 - n) * a + n * b;

// 获取元素样式
const getStyle = (el, attr) => {
    try {
        return window.getComputedStyle
            ? window.getComputedStyle(el)[attr]
            : el.currentStyle[attr];
    } catch (e) {}
    return "";
};

class Cursor {
    constructor() {
        this.pos = { curr: null, prev: null };
        this.pt = [];
        // 增加灵敏度参数，值越大跟随越快（0-1之间）
        this.sensitivity = 0.35; // 从0.15提高到0.35，可根据需要调整
        this.create();
        this.init();
        this.render();
    }

    move(left, top) {
        this.cursor.style.left = `${left}px`;
        this.cursor.style.top = `${top}px`;
    }

    create() {
        if (!this.cursor) {
            this.cursor = document.createElement("div");
            this.cursor.id = "cursor";
            this.cursor.classList.add("hidden");
            document.body.append(this.cursor);
        }

        // 优化：只获取可见元素，提高性能
        const elements = document.body.querySelectorAll('*:not([hidden])');
        this.pt = Array.from(elements).filter(el =>
            getStyle(el, "cursor") === "pointer"
        ).map(el => el.outerHTML);

        // 移除旧的style元素（如果存在）
        if (this.scr) this.scr.remove();

        document.body.appendChild((this.scr = document.createElement("style")));
        this.scr.innerHTML = `* {cursor: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' width='8px' height='8px'><circle cx='4' cy='4' r='4' opacity='.5'/></svg>") 4 4, auto}`;
    }

    refresh() {
        this.scr.remove();
        this.cursor.classList.remove("hover", "active");
        this.pos = { curr: null, prev: null };
        this.pt = [];

        this.create();
        this.init();
        this.render();
    }

    init() {
        // 使用更高效的事件处理方式
        const handleMouseOver = e => {
            if (this.pt.includes(e.target.outerHTML)) {
                this.cursor.classList.add("hover");
            }
        };

        const handleMouseOut = e => {
            if (this.pt.includes(e.target.outerHTML)) {
                this.cursor.classList.remove("hover");
            }
        };

        const handleMouseMove = e => {
            if (this.pos.curr === null) {
                this.move(e.clientX - 8, e.clientY - 8);
            }
            this.pos.curr = { x: e.clientX - 8, y: e.clientY - 8 };
            this.cursor.classList.remove("hidden");
        };

        // 移除旧事件监听，避免重复绑定
        document.removeEventListener('mouseover', handleMouseOver);
        document.removeEventListener('mouseout', handleMouseOut);
        document.removeEventListener('mousemove', handleMouseMove);

        // 绑定新事件
        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);
        document.addEventListener('mousemove', handleMouseMove);

        document.onmouseenter = e => this.cursor.classList.remove("hidden");
        document.onmouseleave = e => this.cursor.classList.add("hidden");
        document.onmousedown = e => this.cursor.classList.add("active");
        document.onmouseup = e => this.cursor.classList.remove("active");
    }

    render() {
        if (this.pos.prev && this.pos.curr) {
            // 使用灵敏度参数控制跟随速度
            this.pos.prev.x = Math.lerp(this.pos.prev.x, this.pos.curr.x, this.sensitivity);
            this.pos.prev.y = Math.lerp(this.pos.prev.y, this.pos.curr.y, this.sensitivity);
            this.move(this.pos.prev.x, this.pos.prev.y);
        } else if (this.pos.curr) {
            this.pos.prev = { ...this.pos.curr };
        }
        requestAnimationFrame(() => this.render());
    }
}

(() => {
    CURSOR = new Cursor();
    // 需要重新获取列表时，使用 CURSOR.refresh()
})();
