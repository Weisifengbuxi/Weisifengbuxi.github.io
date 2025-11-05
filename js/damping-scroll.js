// // 阻尼滚动效果 - JS部分
//
// // 检测是否为移动设备
// function isMobileDevice() {
//     return window.innerWidth <= 768;
// }
//
// // 初始化阻尼滚动效果
// function initDampingScroll() {
//     // 如果是移动设备，不启用阻尼效果
//     if (isMobileDevice()) {
//         console.log('移动设备，使用原生滚动');
//         // 恢复默认滚动行为
//         document.body.style.overflow = 'auto';
//         document.body.style.height = 'auto';
//         document.querySelector('.damping-container').style.position = 'relative';
//         document.querySelector('.damping-container').style.height = 'auto';
//         document.querySelector('.damping-container').style.overflow = 'visible';
//         document.querySelector('.damping-content').style.transform = 'none';
//         document.querySelector('.damping-content').style.transition = 'none';
//         return;
//     }
//
//     console.log('桌面设备，启用阻尼滚动效果');
//
//     const scrollbox = document.querySelector('.damping-content');
//     const container = document.querySelector('.damping-container');
//
//     // 设置 body 高度以启用滚动
//     function resizeBody() {
//         const height = scrollbox.offsetHeight;
//         document.body.style.height = `${height}px`;
//     }
//
//     // 滚动处理函数 - 核心阻尼效果
//     function handleScroll() {
//         scrollbox.style.transform = `translateY(${-window.scrollY}px)`;
//     }
//
//     // 事件监听
//     window.addEventListener('scroll', handleScroll);
//     window.addEventListener('load', resizeBody);
//     window.addEventListener('resize', function() {
//         // 如果窗口大小改变导致设备类型变化，重新初始化
//         if (isMobileDevice()) {
//             initDampingScroll();
//         } else {
//             resizeBody();
//         }
//     });
//
//     // 初始设置
//     resizeBody();
// }
//
// // 页面加载完成后初始化
// document.addEventListener('DOMContentLoaded', initDampingScroll);
//
// // 导出函数供外部使用（如果作为模块）
// if (typeof module !== 'undefined' && module.exports) {
//     module.exports = { initDampingScroll, isMobileDevice };
// }