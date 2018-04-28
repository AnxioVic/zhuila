//v1.0 这是一个公共类
//定义命名空间
if (typeof comm == "undefined" || !comm) { var comm = {}; }
//返回域名地址
comm.getHost = function () { var host = "http://" + location.host; return host; }
//引用开始
//document.write('<script src="' + comm.getHost() + '/Content/projects/Employee/custom/jsinclude.js?v=1.0" type="text/javascript"></script>');

//============消息提示开始============
//在右下角弹出消息提示(参数：消息内容)
comm.alert = function (msg) {
    parent.$.messager.show({
        iconCls: "icon-tip",
        title: "提示",
        msg: msg,
        width: 250,
        height: 150,
        timeout: 3000
    });
}

//在屏幕中央弹出错误提示 并且锁屏(参数：消息内容)
comm.error = function (msg) {
    layer.alert(msg, {icon: 2})
}
//在屏幕中央弹出错误提示 并且锁屏 确定后执行方法(参数：消息内容，回调方法)
comm.errorFun = function (msg, fun) {
    layer.alert(msg, {icon: 2}, fun);
}


//在屏幕中央弹出警告提示 并且锁屏(参数：消息内容)
comm.warning = function (msg) {
    layer.alert(msg, {icon: 5})
}
//在屏幕中央弹出警告提示 并且锁屏 确定后执行方法(参数：消息内容，回调方法)
comm.warningFun = function (msg, fun) {
    layer.alert(msg, {icon: 5}, fun);
}

//屏幕中央弹出是否选择提示 并且锁屏 点击是否否执行方法(参数：消息内容，回调方法)
comm.confirm = function (msg, fun) {
    layer.confirm(msg,{ title:'提示信息'},fun);
};
//============消息提示结束===========



//============post提交开始============
//屏幕中央弹出锁屏择提示 并且锁屏(参数：消息内容)
comm.progress = function () {
    var close = layer.load(1, {
        shade: [0.1,'#fff'] //0.1透明度的白色背景
    });
}
//解除锁屏择提示 
comm.progressClose = function () {
    layer.close(close);
}

//post请求失败弹出的统一错误页面
comm.errorPage = function (errorMsg) {
    comm.dialogMax({
        title: "出错了！！！",
        url: "/Error/Error/",
        width: 800,
        height: 500
    });
}

//该项目中统一使用该post方法进行Ajax操作
comm.post = function (url, params, fun, optProgress) {
    if (optProgress === true)
        comm.progress();
    jQuery.ajax({
        url: url,
        type: "post",
        data: params,
        dataType: "json",
        success: function (data) {
            comm.progressClose();
            fun(data);
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            comm.progressClose();
            //comm.errorPage(xmlHttpRequest.responseText);
            parent.$.messager.show({
                title: "错误",
                msg: "<div style=\"width:900px;height:700px;overflow:auto;\">" + xmlHttpRequest.responseText + "</div>",
                timeout: 50000000,
                width: 900,
                height: 700
            });
        }
    });
}
//============post提交结束============


//============弹窗开始============
comm.dialog = function (options) {
    if (options.url) {
        options.url = comm.GetActionParameterUrl(options.url);
    }
    parent.easyui_ext.modalDialog(options);
}
//百分比弹出
comm.dialogPerc = function (options) {
    if (options.url) {
        options.url = comm.GetActionParameterUrl(options.url);
    }
    if (options.width) {
        options.width = parent.document.documentElement.clientWidth * options.width;
    } else {
        options.width = parent.document.documentElement.clientWidth * 0.98;
    }
    if (options.height) {
        options.height = parent.document.documentElement.clientHeight * options.height;
    } else {
        options.height = parent.document.documentElement.clientHeight * 0.98;
    }
    parent.easyui_ext.modalDialog(options);
}

//统一最大化弹窗
comm.dialogMax = function (options) {
    if (options.url) {
        options.url = comm.GetActionParameterUrl(options.url);
    }
    var opts = $.extend(options, { width: 950, height: 600, maximized: true });
    parent.easyui_ext.modalDialog(opts);
    //if (d) {
    //    var o = d.dialog("options");
    //    console.log(o.id);
    //    console.log($("#" + o.id));
    //    var newHeight = ($("#" + o.id).height() - 4).toString() + "px";
    //    console.log(newHeight);
    //    $("#dialog_" + o.id).height(newHeight);
    //    //console.log($("#dialog_" + o.id));
    //}
}
//关闭弹窗
comm.close = function (iframeId) {
    if (iframeId)
        parent.$("#" + iframeId).dialog("destroy");
    else
        parent.$("#iframe").dialog("destroy");
}
//============弹窗结束============


//============刷新开始============
//刷新当前页
comm.refresh = function () {
    window.location = window.location;
}

//刷新父弹窗（父页面必须实现Reload()方法）
comm.refreshPart = function (currPageId) {//关闭指定弹窗 并刷新指定窗口的局部内容
    if (currPageId) {
        var myIframe = parent.document.getElementById("dialog_" + currPageId);
        var pid = $(myIframe).data("pid");

        //console.log(pid);
        //console.info($("#" + pid, parent.document).find("#dialog_" + pid)[0]);

        if (pid && $("#" + pid, parent.document).find('#dialog_' + pid)[0]) {
            $("#" + pid, parent.document).find("#dialog_" + pid)[0].contentWindow.Reload();
        } else {
            parent.$("div.tabs-panels").find("div.panel").each(function () {
                if ($(this).css("display") === "block") {
                    $(this).find("iframe")[0].contentWindow.Reload();
                    return false;
                }
            });
        }
    }
}

//关闭指定弹窗 并刷新父窗体,刷新页面方式，刷新整个页面
comm.closeRefresh = function (closeId) {
    if (closeId) {
        var myIframe = parent.document.getElementById("dialog_" + closeId);
        var pid = $(myIframe).data("pid");
        if (pid && $("#" + pid, parent.document).find('#dialog_' + pid)[0]) {
            //var pidIframe = parent.document.getElementById("dialog_" + $(myIframe).data("pid"));
            var pidIframe = $("#" + pid, parent.document).find('#dialog_' + pid)[0];
            pidIframe.src = pidIframe.src;

        } else {
            //parent.RefreshMainTabs();
            parent.$("div.tabs-panels").find("div.panel").each(function () {
                if ($(this).css("display") === "block") {
                    //$(this).find("iframe")[0].contentWindow.Reload();
                    var tabIframe = $(this).find("iframe")[0];
                    tabIframe.src = tabIframe.src;
                    return false;
                }
            });
        }
        parent.$("#" + closeId).dialog("destroy");
    } else {
        parent.$("#iframe").dialog("destroy");
    }
}
//关闭指定弹窗closeId 并刷新父弹窗（父页面必须实现Reload()方法）
comm.closeRefreshPart = function (closeId) {//关闭指定弹窗 并刷新指定窗口的局部内容
    if (closeId) {
        var myIframe = parent.document.getElementById("dialog_" + closeId);
        var pid = $(myIframe).data("pid");
        if (pid && $("#" + pid, parent.document).find("#dialog_" + pid)[0]) {
            //console.info($("#" + pid, parent.document).find('#dialog_' + pid)[0]);
            $("#" + pid, parent.document).find("#dialog_" + pid)[0].contentWindow.Reload();
        } else {
            parent.$("div.tabs-panels").find("div.panel").each(function () {
                if ($(this).css("display") === "block") {
                    $(this).find("iframe")[0].contentWindow.Reload();
                    return false;
                }
            });
        }
        parent.$("#" + closeId).dialog("destroy");
    } else {
        parent.$("#iframe").dialog("destroy");
    }
}
//============刷新结束============



//============其他函数开始============
comm.isNumber = function (value) {//判断输入是否是数字
    var cmsNum = Number(value);
    if (isNaN(cmsNum)) { return false; }
    return true;
}
//获取字符串字节数
comm.getStringByteLength = function (val) {
    var length = 0;
    for (var i = 0; i < val.length; i++) {
        if (val.substring(i, i + 1).match(/[^\x00-\xff]/ig) != null)
            length += 2;
        else
            length += 1;
    }
    // 返回当前字符串字节长度
    return length;
}
//js截取字符串（按字节）
comm.cutString = function (str, l) {
    var result = "",
        strlen = str.length, // 字符串长度
        chrlen = str.replace(/[^\x00-\xff]/g, '**').length; // 字节长度
    if (chrlen <= l) { return str; }
    for (var i = 0, j = 0; i < strlen; i++) {
        var chr = str.charAt(i);
        if (/[\x00-\xff]/.test(chr)) {
            j++; // ascii码为0-255，一个字符就是一个字节的长度
        } else {
            j += 2; // ascii码为0-255以外，一个字符就是两个字节的长度
        }
        if (j <= l) { // 当加上当前字符以后，如果总字节长度小于等于L，则将当前字符真实的+在result后
            result += chr;
        } else { // 反之则说明result已经是不拆分字符的情况下最接近L的值了，直接返回
            return result + "...";
        }
    }
    return result;
}

///*屏蔽右键*/
//$(document).bind('contextmenu', function () {
//    // return false;
//});

///*禁止复制*/
//$(document).bind('selectstart', function () {
//    // return false;
//});


/*
* 去字符串空格
* @returns
*/
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};
String.prototype.ltrim = function () {
    return this.replace(/(^\s*)/g, "");
};
String.prototype.rtrim = function () {
    return this.replace(/(\s*$)/g, "");
};
//============其他函数结束============
comm.showButtons = function (buttons, showButtonStatus) {
    if (showButtonStatus == 1) {
        if (buttons && $.trim(buttons) !== "") {
            var arry = buttons.toString().split(",");
            for (var i = 0; i < arry.length; i++) {
                $("[data-permission*='," + arry[i] + ",']").show();
            }
        }
    } else {
        $("[data-permission]").show();
    }
}
comm.GetQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return "";
}
comm.GetActionParameterUrl = function (url) {
    var reg = new RegExp("(^|&)ap=([^&]*)(&|$)");
    var r = url.substr(1).match(reg);
    if (r != null) {
        return url;
    } else {
        if (url.indexOf("?") > -1) {
            return url + "&ap=" + comm.GetQueryString("ap");
        } else {
            return url + "?ap=" + comm.GetQueryString("ap");
        }
    }
}