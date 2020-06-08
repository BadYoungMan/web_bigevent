$(function() {
    // 获取表单
    var form = layui.form;
    // 获取 layer
    var layer = layui.layer;
    // 自定义表单验证规则
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称必须在1~6个字符之间';
            }
        }
    });

    initUserInfo();

    // 获取用户信息
    function initUserInfo() {
        $.ajax({
            type: "get",
            url: "/my/userinfo",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                // console.log(res);
                form.val('formUserInfo', res.data);
            }
        });
    };

    // 重置用户信息
    $('#btnReset').on('click', function(e) {
        // 阻止重置默认事件
        e.preventDefault();

        initUserInfo();
    });

    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        // 发起表单提交请求
        $.ajax({
            type: "post",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败!');
                };
                layer.msg('获取用户信息成功!');
                // 调用父元素方法,重新渲染页面
                window.parent.getUserInfo();
            }
        });

    });
})