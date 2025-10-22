var posts=["posts/627a00f2.html","posts/ef6a5850.html","posts/7b8c168a.html","posts/3be0a65.html","posts/6650a8f9.html","posts/74bcc131.html"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };var friend_link_list=[{"name":"Hexo","link":"https://hexo.io/zh-tw/","avatar":"https://d33wubrfki0l68.cloudfront.net/6657ba50e702d84afb32fe846bed54fba1a77add/827ae/logo.svg","descr":"快速、简单且强大的网站框架"},{"name":"未似风不息","link":"https://www.weisifengbuxi.top/","avatar":"https://images.weserv.nl/?url=https://raw.githubusercontent.com/Weisifengbuxi/tuchuang/main/img/Wechat.jpg","descr":"学习技术 分享生活","siteshot":"https://s21.ax1x.com/2025/09/01/pVcvLlR.png"},{"name":"anzhiyu主题","link":"https://blog.anheyu.com/","avatar":"https://npm.elemecdn.com/anzhiyu-blog-static@1.0.4/img/avatar.jpg","descr":"生活明朗，万物可爱","siteshot":"https://npm.elemecdn.com/anzhiyu-theme-static@1.1.6/img/blog.anheyu.com.jpg"},{"name":"安知鱼","link":"https://blog.anheyu.com/","avatar":"https://npm.elemecdn.com/anzhiyu-blog-static@1.0.4/img/avatar.jpg","descr":"生活明朗，万物可爱","siteshot":"https://npm.elemecdn.com/anzhiyu-theme-static@1.1.6/img/blog.anheyu.com.jpg","color":"vip","tag":"技术"},{"name":"小嗷犬的技术小站","link":"https://blog.marquis.eu.org/","avatar":"https://blog.marquis.eu.org/img/avatar/2.png","descr":"为天地立心，为生民立命，为往圣继绝学，为万世开太平","siteshot":"https://image.thum.io/get/width/400/crop/800/allowJPG/wait/20/noanimate/https://blog.marquis.eu.org/","color":"vip","tag":"技术,生活"},{"name":"Akilarの糖果屋","link":"https://akilar.top/","siteshot":"https://npm.elemecdn.com/akilar-friends@latest/siteshot/akilar.top.jpg","avatar":"https://npm.elemecdn.com/akilar-friends@latest/avatar/akilar.top.jpg","descr":"欢迎光临糖果屋","color":"vip","tag":"教程,小说,诗词,日记"},{"name":"青桔气球","link":"https://blog.qjqq.cn/","avatar":"https://q2.qlogo.cn/headimg_dl?dst_uin=1645253&spec=640","descr":"分享网络安全与科技生活","siteshot":"https://q2.qlogo.cn/headimg_dl?dst_uin=1645253&spec=640","color":"vip","tag":"技术,接口"},{"name":"张洪Heo","link":"https://blog.zhheo.com/","avatar":"https://img.zhheo.com/i/67d8fa75943e4.webp","descr":"分享设计与科技生活","siteshot":"https://img.zhheo.com/i/67d8fb3c51399.webp","color":"vip","tag":"技术"},{"name":"山岳库博","link":"https://kmar.top/","avatar":"https://s21.ax1x.com/2025/09/01/pVcHzGt.png","siteshot":"https://s21.ax1x.com/2025/09/01/pVcbCM8.jpg","descr":"开发学习启发性二刺螈","color":"vip","tag":"技术，博客美化"},{"name":"梦爱吃鱼","link":"https://blog.bsgun.cn/","avatar":"https://oss-cdn.bsgun.cn/logo/avatar.256.png","siteshot":"https://oss-cdn.bsgun.cn/logo/avatar.256.png","descr":"不负心灵，不负今生","color":"vip","tag":"技术"},{"name":"周润发","link":"https://blog.zrf.me/","avatar":"https://blog.zrf.me/img/logo.webp","siteshot":"https://blog.zrf.me/img/web_img.webp","descr":"收录开源，好用的互联网项目","color":"vip","tag":"技术，项目"},{"name":"谢大大","link":"https://xiedada.net/","avatar":"https://images.weserv.nl/?url=https://cdn.jsdelivr.net/gh/Weisifengbuxi/tuchuang@main/img/youlian1.jpg","descr":"现实中的技术大佬","siteshot":"https://images.weserv.nl/?url=https://cdn.jsdelivr.net/gh/Weisifengbuxi/tuchuang@main/img/youlian1.jpg","tag":"生活"},{"name":"东方月初"}];
    var refreshNum = 1;
    function friendChainRandomTransmission() {
      const randomIndex = Math.floor(Math.random() * friend_link_list.length);
      const { name, link } = friend_link_list.splice(randomIndex, 1)[0];
      Snackbar.show({
        text:
          "点击前往按钮进入随机一个友链，不保证跳转网站的安全性和可用性。本次随机到的是本站友链：「" + name + "」",
        duration: 8000,
        pos: "top-center",
        actionText: "前往",
        onActionClick: function (element) {
          element.style.opacity = 0;
          window.open(link, "_blank");
        },
      });
    }
    function addFriendLinksInFooter() {
      var footerRandomFriendsBtn = document.getElementById("footer-random-friends-btn");
      if(!footerRandomFriendsBtn) return;
      footerRandomFriendsBtn.style.opacity = "0.2";
      footerRandomFriendsBtn.style.transitionDuration = "0.3s";
      footerRandomFriendsBtn.style.transform = "rotate(" + 360 * refreshNum++ + "deg)";
      const finalLinkList = [];
  
      let count = 0;

      while (friend_link_list.length && count < 3) {
        const randomIndex = Math.floor(Math.random() * friend_link_list.length);
        const { name, link, avatar } = friend_link_list.splice(randomIndex, 1)[0];
  
        finalLinkList.push({
          name,
          link,
          avatar,
        });
        count++;
      }
  
      let html = finalLinkList
        .map(({ name, link }) => {
          const returnInfo = "<a class='footer-item' href='" + link + "' target='_blank' rel='noopener nofollow'>" + name + "</a>"
          return returnInfo;
        })
        .join("");
  
      html += "<a class='footer-item' href='/link/'>更多</a>";

      document.getElementById("friend-links-in-footer").innerHTML = html;

      setTimeout(()=>{
        footerRandomFriendsBtn.style.opacity = "1";
      }, 300)
    };