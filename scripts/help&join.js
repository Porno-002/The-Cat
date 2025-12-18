// 帮助按钮功能
function showHelp() {
    alert('如需帮助，请联系客服邮箱：2390276981@qq.com');
}

// 登录按钮功能  
function showLoginInfo() {
    alert('登录功能正在开发中，敬请期待！');
}
// 页面加载完成后绑定事件
document.addEventListener('DOMContentLoaded', function () {
    // 绑定帮助按钮
    const helpButton = document.querySelectorAll('.pill-button')[0];
    if (helpButton) {
        helpButton.addEventListener('click', showHelp);
    }

    // 绑定登录按钮
    const loginButton = document.querySelectorAll('.pill-button')[1];
    if (loginButton) {
        loginButton.addEventListener('click', showLoginInfo);
    }
});