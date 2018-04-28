/**====================================jQuery扩展====================================================/
/*js cookie*/
$.cookie = function (key, value, options) {
    if (arguments.length > 1 && (value === null || typeof value !== "object")) {
        options = $.extend({}, options);
        if (value === null) {
            options.expires = -1;
        }
        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }
        return (document.cookie = [encodeURIComponent(key), "=", options.raw ? String(value) : encodeURIComponent(String(value)), options.expires ? "; expires=" + options.expires.toUTCString() : "", options.path ? "; path=" + options.path : '', options.domain ? "; domain=" + options.domain : "", options.secure ? "; secure" : ""].join(""));
    }
    options = value || {};
    var result, decode = options.raw ? function (s) {
        return s;
    } : decodeURIComponent;
    return (result = new RegExp("(?:^|; )" + encodeURIComponent(key) + "=([^;]*)").exec(document.cookie)) ? decode(result[1]) : null;
};

/*JSON对象转换成String*/
$.jsonToString = function (o) {
    var r = [];
    if (typeof o == "string")
        return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
    if (typeof o == "object") {
        if (!o.sort) {
            for (var i in o)
                r.push(i + ":" + easyui_ext.jsonToString(o[i]));
            if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                r.push("toString:" + o.toString.toString());
            }
            r = "{" + r.join() + "}";
        } else {
            for (var i = 0; i < o.length; i++)
                r.push(easyui_ext.jsonToString(o[i]));
            r = "[" + r.join() + "]";
        }
        return r;
    }
    return o.toString();
};

/*
* 增加formatString功能
* 使用方法：$.formatString('字符串{0}字符串{1}字符串','第一个变量','第二个变量');
* @returns 格式化后的字符串
*/
$.formatString = function (str) {
    for (var i = 0; i < arguments.length - 1; i++) {
        str = str.replace("{" + i + "}", arguments[i + 1]);
    }
    return str;
};

/*将form表单元素的值序列化成对象*/
$.serializeObject = function (form) {
    var o = {};
    var changeCols = "";
    $.each(form.serializeArray(), function (index) {
        //  console.info(this);
        if (o[this["name"]]) {
            o[this["name"]] = o[this["name"]] + "," + this["value"];
        } else {
            o[this["name"]] = this["value"];
        }
        if ($("#" + this["name"])) {
            if ($("#" + this["name"]).data("oldvalue") != undefined) {
                if ($.trim(this["value"]) != $.trim($("#" + this["name"]).data("oldvalue"))) {
                    //changeCols += "\"" + this["name"] + "\"" + ",";
                    changeCols += this["name"] + ",";
                }
            }
        }
    });
    if (changeCols != "") {
        //changeCols = "[" + changeCols.substring(0, changeCols.length - 1) + "]";
        changeCols = changeCols.substring(0, changeCols.length - 1) ;
    }
    o["ChangeCols"] = escape(changeCols);
    console.log(o);
    return o;
};

/*
* 接收一个以逗号分割的字符串，返回List，list里每一项都是一个字符串
* @returns list
*/
$.stringToList = function (value) {
    if (value != undefined && value !== "") {
        var values = [];
        var t = value.split(',');
        for (var i = 0; i < t.length; i++) {
            values.push("" + t[i]); /* 避免他将ID当成数字 */
        }
        return values;
    } else {
        return [];
    }
};

/*
* @requires jQuery
* 改变jQuery的AJAX默认属性和方法
*/
$.ajaxSetup({
    type: "POST",
    error: function (xmlHttpRequest, textStatus, errorThrown) {
        try {
            parent.$.messager.progress("close");
            comm.errorPage(xmlHttpRequest.responseText);
        } catch (e) {
            comm.errorPage(xmlHttpRequest.responseText);
        }
    }
});