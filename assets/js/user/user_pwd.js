$(function() {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        different: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '不能与原密码一致！';
            }
        },
        same: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致';
            }
        }
    });

    // 重置密码
    $('.layui-form').on('submit', function(e) {
        e.prevevtDefault();
        $.ajax({
            type: "post",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('修改密码失败!');
                }
                layer.msg('修改密码成功!');
                // 重置表单
                $('.layui-form')[0].reset();
            }
        });
    });
})