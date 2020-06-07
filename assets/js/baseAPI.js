// 注意：每次调用 $.get() 或 $.post() 或 $.ajax()的时候
// 都会先调用 ajaxPrefilter 这个函数
$.ajaxPrefilter(function(options) {
    options.url = 'http://www.liulongbin.top:3007' + options.url;

    // 设置请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    };

    // 全局挂载 complete 函数
    options.complete = function(res) {
        // console.log(res);
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 强制清空 token
            localStorage.removeItem('token');
            // 强制跳转到登录页面
            location.href = '/code05/login.html';
        }
    }
})