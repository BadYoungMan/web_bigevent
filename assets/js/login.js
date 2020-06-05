$(function() {
    // 点击 去注册 链接
    $('#link_reg').on('click', function() {
        $(".reg-box").show();
        $('.login-box').hide();
    });
    // 点击 去登陆 链接
    $("#link_login").on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    });

    // 获取表单
    var form = layui.form;
    // 获取 layer 
    var layer = layui.layer;
    // 通过 form.verify() 自定义表单规则
    form.verify({
        // 密码格式校验
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 两次密码比对校验
        repwd: function(value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行比对并返回信息
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致';
            }
        }
    });

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        var username = $('#form_reg [name=username]').val();
        var password = $('#form_reg [name=password]').val();
        $.ajax({
            type: "post",
            url: "/api/reguser",
            data: { username: username, password: password },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功');
                $("#link_login").click();
            }
        });
    });

    // 监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        e.preventDefault();
        var username = $('#form_login [name=username]').val();
        var password = $('#form_login [name=password]').val();
        $.ajax({
            type: "post",
            url: "/api/login",
            data: { username: username, password: password },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败!');
                }
                // 将需要身份验证的值储存
                localStorage.setItem('token', res.token);
                // console.log(res.token);
                layer.msg('登录成功!');
                location.href = '/code05/index.html'
            }
        });

    });
})