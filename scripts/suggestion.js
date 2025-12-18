// 提交反馈功能
function submitFeedback() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (!name || !email || !message) {
        alert('请填写所有必填字段');
        return;
    }

    alert('提交成功！感谢您的反馈。');

    // 清空表单
    document.getElementById('feedbackForm').reset();
}
// 页面加载完成后绑定事件
document.addEventListener('DOMContentLoaded', function () {
    // 绑定提交按钮（如果存在）
    const submitBtn = document.querySelector('.submit-button');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitFeedback);
    }

    // 添加页面特定功能：显示当前年份
    const currentYear = new Date().getFullYear();
    console.log(`喵星人乐园 ${currentYear}`);
});