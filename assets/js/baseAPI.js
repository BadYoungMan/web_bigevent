// 注意：每次调用 $.get() 或 $.post() 或 $.ajax()的时候
// 都会先调用 ajaxPrefilter 这个函数
$.ajaxPrefilter(function(options) {
    options.url = 'http://www.liulongbin.top:3007' + options.url;
})