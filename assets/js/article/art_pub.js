$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initCate();

    // 初始化富文本编辑器
    initEditor();

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            type: "get",
            url: "/my/article/cates",
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('加载文章分类失败!');
                }

                // 使用模板引擎渲染模板
                var htmlStr = template('tpl_cate', res);
                $('#cateBox').html(htmlStr);
                form.render();
            }
        });
    };

    // 1. 初始化图片裁剪器
    var $image = $('#image');

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };

    // 3. 初始化裁剪区域
    $image.cropper(options);

    // 为选择封面的按钮，绑定点击事件处理函数
    $('#btnChooseImge').on('click', function() {
        $('#coverFile').click();
    });

    // 监听coverFile 的 change 事件，获取用户选取的文件
    $('#coverFile').on('change', function(e) {
        // 获取文件的列表
        var file = e.target.files[0];

        // 判断用户是否选择了文件
        if (file.length === 0) {
            return
        };

        // 根据文件，创建对应的URL地址
        var newImgURL = URL.createObjectURL(file);

        // 为剪裁区重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    // 定义文章发布状态
    var art_state = '已发布';

    // 当点击保存草稿按钮时时
    $('#btnsava2').on('click', function() {
        art_state = '草稿';
    });

    // 为表单添加一个submit事件
    $('#form-pub').on('submit', function(e) {
        // 阻止表单默认提交事件
        e.preventDefault();

        // 基于form 表单，快速创建一个formdate对象
        var fd = new FormData($(this)[0]);

        // 将文章发布状态添加到 fd 中
        fd.append('state', art_state);

        // 将裁剪后的图片输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                // 发起 ajax 数据请求
                publishArticle(fd);
            });
    });

    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            type: "post",
            url: "/my/article/add",
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发表文章失败！');
                }
                layer.msg('发表文章成功！');
                // 发表成功后跳转到文章列表页面
                location.href = './art_list.html';
            }
        });
    }
})