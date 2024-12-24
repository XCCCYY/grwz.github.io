document.getElementById('openNewWindow').addEventListener('click', function (event) {
    // 阻止默认行为
    event.preventDefault();
    // 使用 URL 对象来安全地构建新的URL
    var url = new URL(this.href, window.location.origin); // 确保相对URL被正确解析
    // 检查并确保 pathname 以斜杠结尾，以便正确添加新的路径部分
    if (!url.pathname.endsWith('/')) {
        url.pathname += '/';
    }
    // 添加新的路径部分
    url.pathname += 'additional/path';
    // 创建新的浏览器窗口
    var newWindow = window.open('', '_blank'); // 先打开一个空白的新窗口
    // 确保新窗口成功打开
    if (newWindow && !newWindow.closed && typeof newWindow.focus === 'function') {
        try {
            // 设置新窗口的URL为复制并修改后的链接
            newWindow.location.href = url.toString();
            // 使新窗口获得焦点
            newWindow.focus();
        } catch (error) {
            console.error("无法为新窗口设置位置： ", error);
            alert('打开新页面时出现问题。');
        }
    } else {
        // 如果新窗口未成功打开（可能是由于弹出窗口拦截器），则恢复默认行为或提示用户
        alert('请允许此网站弹出窗口');
    }
});