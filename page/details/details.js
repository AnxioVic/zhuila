/**
 * Created by linlei on 2018-04-12.
 */
layui.use(['element','form','laydate'], function(){
    var element = layui.element,$ = layui.jquery;

    //监听提交
    layui.form.on('submit(formDemo)', function(data){
        layer.msg(JSON.stringify(data.field));
        return false;
    });

    $(".layui-input-block").on("click",function () {
        console.log($(this)[0].children);
        $(this)[0].children[0].disabled =false;
    });

    $("input").on("blur",function () {
        $(this)[0].disabled =true;
    });

    layui.laydate.render({
        elem: '#test2',
        type: 'datetime',
        format:'yyyy-MM-dd HH:mm:ss',
        value: new Date(1534766888000),
        zIndex: 99999999,
        change: function(value, date){ //监听日期被切换
            lay('#test2').html(value);
        }//或 elem: document.getElementById('test')、elem: lay('#test') 等
    });
    //…
});