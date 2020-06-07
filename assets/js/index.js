$(function() {
    getUserInfo();

    var layer = layui.layer;
    // 绑定退出点击事件
    $('#btnLogout').on('click', function() {
        layer.confirm('您确定要退出吗?', { icon: 3, title: '提示' }, function(index) {
            //do something
            // 清空本地的 token 
            localStorage.removeItem('token');
            // 跳转到登录页面
            location.href = '/code05/login.html'
            layer.close(index);
        });
    });
});

// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        type: "get",
        url: "/my/userinfo",
        // 配置请求头
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('用户信息获取失败');
            }
            // 渲染用户头像 昵称
            renderAvatar(res.data);
        },
        // complete: function(res) {
        //     // console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 强制清空 token
        //         localStorage.removeItem('token');
        //         // 强制跳转到登录页面
        //         location.href = '/code05/login.html';
        //     }
        // }
    });
};

// 渲染用户头像 昵称
function renderAvatar(user) {
    // 获取用户名，设置欢迎文本
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp&nbsp' + name);
    // 渲染用户头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        // 获取首字符
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}