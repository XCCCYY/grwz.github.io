$(document).ready(function () {
    // 定义打开新窗口并添加路径及HTML内容的函数
    function openNewWindowWithPath() {
        // 构造新的路径或查询字符串
        var newPath = '/new/path'; // 你可以根据需要更改这个路径
        var params = '?id=123&name=example'; // 查询参数
        // 打开新窗口，并将路径附加到新窗口的URL中
        var newWindow = window.open('', '_blank'); // 打开一个空白的新窗口
        if (newWindow) {
            // 设置新窗口的位置，这里使用了当前页面的origin和pathname
            newWindow.location.href = window.location.origin + window.location.pathname + newPath + params;
            // 等待新窗口加载完成
            newWindow.onload = function () {
                // 添加HTML内容到新窗口
                var htmlContent = "<div id='addedElement'>这是在新窗口中添加的元素。</div>";
                newWindow.document.body.innerHTML += htmlContent;
            };
        } else {
            alert('无法打开新窗口。请检查浏览器设置。');
        }
    }
    // 绑定点击事件到按钮上
    $('#openNewWindowButton').click(openNewWindowWithPath);
});