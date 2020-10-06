$(function() {
    var layer = layui.layer;
    var form = layui.form;
    // 获取文章分类列表
    initArtCateList();

    function initArtCateList() {
        $.ajax({
            type: "get",
            url: "/my/article/cates",
            success: function(res) {
                // console.log(res);
                var html = template('tableTpl', res);
                $('#artCateBoox').html(html);
            }
        });
    };

    // 为添加类别按钮绑定点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '260px'],
            title: '添加文章分类',
            content: $('#htmlACate').html()
        });
    });

    // 弹出层form表单提交事件
    $('body').on('submit', '#formAddCate', function(e) {
        e.preventDefault();
        $.ajax({
            type: "post",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败！');
                };
                initArtCateList();
                layer.msg('新增文章分类成功！');
                // 关闭弹出层
                layer.close(indexAdd);
            }
        });
    });

    // 为编辑按钮添加点击事件
    var indexEdit = null;
    $('#artCateBoox').on('click', '.editBtn', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '260px'],
            title: '修改文章分类',
            content: $('#htmlEdit').html()
        });

        // 获取id值
        var id = $(this).attr('data-id');
        // 获取对应id的文章分类
        $.ajax({
            type: "get",
            url: "/my/article/cates/" + id,
            success: function(res) {
                form.val('formEditCate', res.data);
            }
        });
    });

    // 弹出层form表单修改事件
    $('body').on('submit', '#formEditCate', function(e) {
        e.preventDefault();
        $.ajax({
            type: "post",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('修改文章分类失败！');
                };
                initArtCateList();
                layer.msg('修改文章分类成功！');
                // 关闭弹出层
                layer.close(indexEdit);
            }
        });
    });

    // 删除按钮
    $('#artCateBoox').on('click', '.deleteBtn', function() {
        var id = $(this).attr('data-id');
        layer.confirm('确定删除该分类?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                type: "get",
                url: "/my/article/deletecate/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！')
                    };
                    initArtCateList();
                    layer.msg('删除文章分类成功！');
                    layer.close(index);
                }
            });
        });
    });

})