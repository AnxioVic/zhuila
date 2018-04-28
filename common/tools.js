/**
 * Created by linlei on 2018-04-09.
 */
/**
 *  四个参数：内容，图标颜色，图标，对象：对象包含layer.msg的内置属性;
 * @type {{msg: tools.msg}}
 */

var tools = {
    msg: function (title, icon_color, icon, obj) {

        return layer.msg('<span class="layui-icon" style="color: ' + icon_color + '; ">' + icon + '</span>' + title, obj);
    },
    openWindow: function (data) {
        var index = parent.layui.layer.open({
            title: data.title,
            type: 2,
            content: data.url,
            area: ['500px', '300px'],
            maxmin: true,
            success: function (layero, index) {

            }
        })
        parent.layui.layer.full(index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        // $(window).on("resize", function () {
        //     parent.layui.layer.full(index);
        // })
    },
    openIframe: function (data) {
        var index = layui.layer.open({
            title: data.title,
            type: 2,
            content: data.url,
            area: ['500px', '300px'],
            maxmin: true,
            success: function (layero, index) {

            }
        })
        layui.layer.full(index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        // $(window).on("resize", function () {
        //     layui.layer.full(index);
        // })
    }
};
