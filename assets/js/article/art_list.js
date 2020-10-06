$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义美化时间过滤器
    template.defaults.imports.dataFormat = function(data) {
        const dt = new Date();

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 定义补0函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    // 定义一个查询的参数对象，将来请求服务器时需要传递。
    var q = {
        pagenum: 1, // 默认页码值
        pagesize: 2, // 每页显示多少
        cate_id: '', // 分类id
        state: '', // 文章状态
    };

    // 调用获取文章列表数据方法
    initTable();

    // 调用文章分类数据方法
    initCate();

    // 获取文章列表数据方法
    function initTable() {
        $.ajax({
            type: "get",
            url: "/my/article/list",
            data: q,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败!");
                }

                // 使用模板引擎渲染模板
                var htmlStr = template('tpl_table', res);
                $('#tableBox').html(htmlStr);
                renderPage(res.total);
            }
        });
    };

    // 获取文章分类数据方法
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败!');
                }

                // 使用模板引擎渲染模板
                var htmlStr = template('tpl_artClass', res);
                $('#artClass').html(htmlStr);
                // 通过 layui 重新渲染表单项
                form.render();
            }
        });
    };

    // 为筛选表单添加 submit 事件
    $("#form_search").on('submit', function(e) {
        e.preventDefault();
        //选取表单中的项
        var cate_id = $('#artClass').val();
        var state = $('[name = state]').val();

        // 重新对 q 中参数赋值
        q.cate_id = cate_id;
        q.state = state;

        // 根据最新参数渲染文章列表
        initTable();
    });

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用该方法渲染分页结构。
        laypage.render({
            elem: 'pageBox', // 分页容器Id
            count: total, // 分页总数
            limit: q.pagesize, // 分页中每页显示的条数
            curr: q.pagenum, // 默认选中的页数。
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],

            // 当分页被切换时触发jump - 切换分页的回调
            jump: function(obj, first) {
                // console.log(obj.curr);
                q.pagenum = obj.curr;
                // 把最新的条目数赋值给 q 
                q.pagesize = obj.limit;
                // 根据最新的 q 获取对应的数据列表，并渲染表格。
                if (!first) {
                    initTable();
                }
            }
        });
    };

    // 通过代理方式为删除按钮添加绑定时间
    $('tbody').on('click', '.btn_delete', function() {
        // 获取删除按钮个数
        var len = $('.btn_delete').length;
        // 获取文章 ID 
        var id = $(this).attr('data-id');
        // 询问用户是否删除文章
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                type: "get",
                url: "/my/article/delete/" + id,
                success: function(res) {
                    if (res.status != 0) {
                        return layer.msg('删除文章失败!');
                    }
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                    return layer.msg('删除文章成功!');
                }
            });

            layer.close(index);
        });
    });
})