/**
 * Created by linlei on 2018-04-13.
 */
layui.config({
    base : "../js/"
}).extend({
    "bodyTab" : "bodyTab"
})

layui.use(['form','layer','laydate','table','laytpl','element','bodyTab'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laydate = layui.laydate,
        laytpl = layui.laytpl,
        table = layui.table;
    var tab = layui.bodyTab({
        openTabNum : "50",  //最大可打开窗口数量
        url : "json/navs.json" //获取菜单json地址
    });
    console.log(tab);

    //新闻列表
    var tableIns = table.render({
        elem: '#newsList',
        url : '../json/newsList.json',
        cellMinWidth : 95,
        page : true,
        height : 705,
        limit : 50,
        limits : [10,15,20,25,50,100],
        id : "newsListTable",
        cols : [[
            {type: "checkbox", fixed:"left", width:50},
            {field: 'newsId', title: 'ID', width:60, align:"center"},
            {field: 'newsName', title: '文章标题', width:350},
            {field: 'newsAuthor', title: '发布者', align:'center'},
            {field: 'newsStatus', title: '发布状态',  align:'center',templet:"#newsStatus"},
            {field: 'newsLook', title: '浏览权限', align:'center'},
            {field: 'newsTop', title: '是否置顶', align:'center', templet:function(d){
                return '<input type="checkbox" name="newsTop" lay-filter="newsTop" lay-skin="switch" lay-text="是|否" '+d.newsTop+'>'
            }},
            {field: 'newsTime', title: '发布时间', align:'center', minWidth:110, templet:function(d){
                return d.newsTime.substring(0,10);
            }},
            {title: '操作', width:70, templet:'#newsListBar',fixed:"right",align:"center"}
        ]],
        done: function(res, curr, count){
            $(".layui-table-fixed-r")[0].classList += " layui-hide";
            $(".layui-bg-fff").on("mouseover",function () {
                console.log(this);
                this.offsetParent.classList.remove("layui-table-cell");
                this.children[0].children[1].classList.add("layui-show");
            })

            $(".layui-nav-child").on("mouseout",function () {
                this.classList.remove("layui-show");
            })
        }
    });

    //是否置顶
    form.on('switch(newsTop)', function(data){
        var index = layer.msg('修改中，请稍候',{icon: 16,time:false,shade:0.8});
        setTimeout(function(){
            layer.close(index);
            if(data.elem.checked){
                layer.msg("置顶成功！");
            }else{
                layer.msg("取消置顶成功！");
            }
        },500);
    })

    //搜索【此功能需要后台配合，所以暂时没有动态效果演示】
    $(".search_btn").on("click",function(){
        if($(".searchVal").val() != ''){
            table.reload("newsListTable",{
                page: {
                    curr: 1 //重新从第 1 页开始
                },
                where: {
                    key: $(".searchVal").val()  //搜索的关键字
                }
            })
        }else{
            layer.msg("请输入搜索的内容");
        }
    });

    //添加文章
    function addNews(edit){
        var index = parent.layui.layer.open({
            title : "添加文章",
            type : 2,
            content : "page/news/newsAdd.html",
            area: ['500px', '300px'],
            maxmin: true,
            success : function(layero, index){
                var body = parent.layui.layer.getChildFrame('body', index);
                if(edit){
                    body.find(".newsName").val(edit.newsName);
                    body.find(".abstract").val(edit.abstract);
                    body.find(".thumbImg").attr("src",edit.newsImg);
                    body.find("#news_content").val(edit.content);
                    body.find(".newsStatus select").val(edit.newsStatus);
                    body.find(".openness input[name='openness'][title='"+edit.newsLook+"']").prop("checked","checked");
                    body.find(".newsTop input[name='newsTop']").prop("checked",edit.newsTop);
                    form.render();
                }
                setTimeout(function(){
                    layui.layer.tips('点击此处返回文章列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                },500)
            }
        })
        parent.layui.layer.full(index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize",function(){
            parent.layui.layer.full(index);
        })
    }
    $(".addNews_btn").click(function(){
        // top.tab.tabAdd($(this));

        // tools.openNews({},{title:" 添加文章",url:"page/news/newAdd.html"});
        addNews();
    })

    //批量删除
    $(".delAll_btn").click(function(){
        var checkStatus = table.checkStatus('newsListTable'),
            data = checkStatus.data,
            newsId = [];
        if(data.length > 0) {
            for (var i in data) {
                newsId.push(data[i].newsId);
            }
            layer.confirm('确定删除选中的文章？', {icon: 3, title: '提示信息'}, function (index) {
                // $.get("删除文章接口",{
                //     newsId : newsId  //将需要删除的newsId作为参数传入
                // },function(data){
                tableIns.reload();
                layer.close(index);
                // })
            })
        }else{
            // layer.msg('<span class="layui-icon" style="color: pink;">&#xe618;</span>请选择需要删除的文章');
            tools.msg("成功","red",'&#x1005;',{offset:'6%'})
        }
    })

    //列表操作
    table.on('tool(newsList)', function(obj){
        console.log(obj);
        var layEvent = obj.event,
            data = obj.data;
        console.log(obj.data);

        if(layEvent === 'edit'){ //编辑
            addNews(data);
        } else if(layEvent === 'del'){ //删除
            layer.confirm('确定删除此文章？',{icon:3, title:'提示信息'},function(index){
                // $.get("删除文章接口",{
                //     newsId : data.newsId  //将需要删除的newsId作为参数传入
                // },function(data){
                tableIns.reload();
                layer.close(index);
                // })
            });
        } else if(layEvent === 'look'){ //预览
            // layer.alert("此功能需要前台展示，实际开发中传入对应的必要参数进行文章内容页面访问")
            tools.openWindow({title:"详情",url:"page/details/details.html"})
        }
    });


    //操作hover


})