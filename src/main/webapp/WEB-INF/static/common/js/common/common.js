

//$(document).ready(function () {
//    //$.ajaxSetup({
//    //    type: "post",
//    //    contentType: "application/json",
//    //    async: false,
//    //    processdata: true
//    //    });
//    /** 
//    * 提交后台进行唯一性校验 
//    * @param id:校验元素的id,url: 提交的地址,paramName: 传入值的参数名称 
//    */
//    //Base_NOExist = function (id, url, paramName) {
//    //    $(id).validatebox({
//    //        validType: 'Base_NOExist["' + url + '","' + id + '","' + paramName + '"]'
//    //    });
//    //};
//});
//(function ($) {
//    $.getUrlParam = function (name) {
//        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
//        var r = window.location.search.substr(1).match(reg);
//        if (r != null) return unescape(r[2]); return null;
//    }
//})(jQuery);



//#region 常用系统参数
/*
Set  WebSite Path
*/

$(document).ready(function () {	
	/** 
	 * 解决IE不支持startWith方法等
	* 扩展startWith方法 
	* @param str 
	* @return 	* 
	*/ 
	String.prototype.startsWith=function(str){ 
	if(str==null||str==""||this.length==0||str.length>this.length) 
	return false; 
	if(this.substr(0,str.length)==str) 
	return true; 
	else 
	return false; 
	return true; 
	}; 


	/** 
	* 扩展contains方法 
	* @param item 
	* @return 
	*/ 
	Array.prototype.contains = function(item){ 
	return RegExp("\\b"+item+"\\b").test(this); 
	}; 


	/** 
	* IE不支持indexOf方法，为IE添加indexOf的方法 
	*/ 
	Array.prototype.indexOf = function(val){ 
	var value = this; 
	for(var i =0; i < value.length; i++){ 
	if(value[i] == val) return i; 
	} 
	return -1; 
	}; 
	Date.parseStr = function(dateStr,fmt){
		if(fmt=="yyyyMMddHHmmss"){
			var y = dateStr.substr(0,4);
			var m = dateStr.substr(4,2);
			var d = dateStr.substr(6,2);
			var h = dateStr.substr(8,2);
			var mi = dateStr.substr(10,2);
			var s = dateStr.substr(12,2);
			return Date.parse(y+"/"+m+"/"+d+" "+h+":"+mi+":"+s);
		}
		else{
			return Date.parse(dateStr);
		}
	}
	//为Date 的原型添加格式化方法
	Date.prototype.format = function() { 
		 var fmt = "yyyy-MM-dd hh:mm:ss";
	     var o = { 
	        "M+" : this.getMonth()+1,                 //月份 
	        "d+" : this.getDate(),                    //日 
	        "h+" : this.getHours(),                   //小时 
	        "m+" : this.getMinutes(),                 //分 
	        "s+" : this.getSeconds(),                 //秒 
	        "q+" : Math.floor((this.getMonth()+3)/3), //季度 
	        "S"  : this.getMilliseconds()             //毫秒 
	    }; 
	    if(/(y+)/.test(fmt)) {
	            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
	    }
	     for(var k in o) {
	        if(new RegExp("("+ k +")").test(fmt)){
	             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
	         }
	     }
	    return fmt; 
	} 	
});

function Config() { };
//业务逻辑配置
var BLLConfig = {};
Config.URL = document.URL.substring(0, document.URL.lastIndexOf('/'));
Config.Local = location.protocol + "//" + location.host;
//虚拟路径获取修改
var temp1 = Config.URL.substring(Config.URL.indexOf(location.host) + 1 + location.host.length);
var temp2 = temp1.substring(0, temp1.indexOf('/'));
if (temp2 == '' && temp1 != '' && location.host.indexOf('localhost:') == -1)
    Config.NRSS = temp1;
else
    Config.NRSS = temp2;
//Config.NRSS = Config.URL.substring(Config.URL.indexOf(location.host) + location.host.length, Config.URL.length);
Config.EEP = Config.NRSS.substring(0, Config.NRSS.lastIndexOf('/') + 1);
if (Config.NRSS && Config.NRSS != '')
    Config.NRSS = "/" + Config.NRSS + "/";
else
    Config.NRSS += '/';
Config.Application = Config.Local + Config.NRSS;
Config.LoginPage = Config.Application + "infologin.aspx";
Config.WebUpwdControl = Config.Application + "WebUpwdControl.ashx";
//登录用户信息
var KF_ZhuanYuan_GroupID = "09";    //开发专员
var KF_KeZhang_GroupID = "08";      //开发部经理
var KF_JingLi_GroupID = "06";       //大区经理
var isZhuanYuan = false;
var isKeZhang = false;
var isJingLi = false;
var groupIDS = '';      //[09,08,06]                       //当前登录用户角色
var groupNameS = '';    //[开发专员,开发部经理,大区经理]     //当前登录用户角色
//#endregion

//#region 系统当前登录用户信息
Config.LoginUserInfo = {};

//判断用户是否登录，并获取登录用户信息
var NotLoginInfo = '未登录，请重新登录!';
function GetLoginUserInfo() {
    var postData = {
        "action": "QueryUserInfo"
    };
    __ajaxMethodCommon(postData, Config.WebUpwdControl, function (msg) {
        if (msg.length < 1)
            return;
        if (msg.Statue == "ok") {
            if (msg.length < 1)
                return;
            if (msg.Statue == "ok") {
                Config.LoginUserInfo = msg.data;
                return;
            }
            else {
                showAlert("", msg.data, "error");
                return;
            }
        }
        else {
            if (msg.data == NotLoginInfo)
                confirmLoginPage();
            return;
        }
    });
}
//GetLoginUserInfo();//暂时取消调用，正式发布时调用
//#endregion

//#region 常用函数
//alert弹出框
function showAlert(title, msg, msgcss) {
    bassMsgsager(title, msg, true, "", msgcss);
}
//showMessage提示框
function showMsg(title, msg, msgcss) {
    bassMsgsager(title, msg, false, "", msgcss);
}
//弹出框以及系统消息框
//title:标题
//msg:提示信息
//isAlert:是否是alert窗口
//url:跳转页面地址
//msgcss:提示窗口图片:error,info,question,warning
//callback:回调函数，如果没有回调不用传值
function bassMsgsager(title, msg, isAlert, url, msgcss, callback) {
    if (title == "")
        title = "温馨提示";
    if (isAlert !== undefined && isAlert) {
        $.messager.alert(title, msg, msgcss);
    }
    else {
        $.messager.show({
            title: title,
            msg: msg,
            showType: 'show'
        });
    }
    //url跳转
    if (url == "back") {
        if (frames.mainframe)
            frames["mainframe"].history.back(-1);
        else
            window.hitory.back(-1);
    } else if (url != "") {
        if (frames.mainframe)
            frames["mainframe"].location.href = url;
        else
            self.location.href = url;
    }
    //执行回调函数
    if (arguments.length == 6) {
        if (jQuery.isFunction(callback))
            callback.call();
    }
}
//确认框
function showConfirm(title, msg, callback) {
    $.messager.confirm(title, msg, function (r) {
        if (r) {
            if (jQuery.isFunction(callback))
                callback.call();
        }
    });
}
//进度框
function loading2(isShow) {
    var html = "";
    html += '<div id="processWindow" class="easyui-window"  title="温馨提示" style="width: 300px; height: 90px;"';
    html += '    data-options="modal:true,closed:true,collapsible:false,maximizable:false,minimizable:false">';
    html += '    <div id="windowContent" class="general-font" style="text-align:center;position:absolute;top:45%;left:30%;">';
    html += '        <img src="jQuery-EasyUI/themes/default/images/loading.gif" />';
    html += '        <span style="width: 150px;margin-top: 12px;position: absolute;">操作进行中，请稍后...</span>';
    html += '    </div>';
    html += '</div>';

}
function loading(isShow) {
    showProcess(isShow, "温馨提示", "操作进行中，请稍后...");
}
function showProcess(isShow, title, msg) {
    if (!isShow) {
        $.messager.progress('close');
        return;
    }
    var win = $.messager.progress({
        title: title,
        msg: msg
    });
}
//function getUrlParam(name) {
//    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
//    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
//    if (r != null) return unescape(r[2]); return null; //返回参数值
//}
//#endregion

//#region easyUi 
function myformatter(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
}
function myparser(s) {
    if (!s) return new Date();
    var ss = (s.split('-'));
    var y = parseInt(ss[0], 10);
    var m = parseInt(ss[1], 10);
    var d = parseInt(ss[2], 10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        return new Date(y, m - 1, d);
    } else {
        return new Date();
    }
}
$.extend($.fn.textbox.methods, {
    addClearBtn: function (jq, iconCls) {
        return jq.each(function () {
            var t = $(this);
            var opts = t.textbox('options');
            opts.icons = opts.icons || [];
            opts.icons.unshift({
                iconCls: iconCls,
                handler: function (e) {
                    $(e.data.target).textbox('clear').textbox('textbox').focus();
                    $(this).css('visibility', 'hidden');
                }
            });
            t.textbox();
            if (!t.textbox('getText')) {
                t.textbox('getIcon', 0).css('visibility', 'hidden');
            }
            t.textbox('textbox').bind('keyup', function () {
                var icon = t.textbox('getIcon', 0);
                if ($(this).val()) {
                    icon.css('visibility', 'visible');
                } else {
                    icon.css('visibility', 'hidden');
                }
            });
        });
    }
});
//$.extend($.fn.textbox.defaults, {
//    icons: [{
//        iconCls: 'icon-clear',
//        handler: function (e) {
//            $(e.data.target).textbox('clear');
//        }
//    }]
//});
//DataGrid标题栏右键菜单
var cmenu;
function createColumnMenu(id) {
    var dataGridID = id;
    if (dataGridID == undefined)
        dataGridID = '#dgv1';
    cmenu = $('<div/>').appendTo('body');
    cmenu.menu({
        onClick: function (item) {
            if (item.iconCls == 'icon-ok') {
                $(dataGridID).datagrid('hideColumn', item.name);
                cmenu.menu('setIcon', {
                    target: item.target,
                    iconCls: 'icon-empty'
                });
            } else {
                $(dataGridID).datagrid('showColumn', item.name);
                cmenu.menu('setIcon', {
                    target: item.target,
                    iconCls: 'icon-ok'
                });
            }
        }
    });
    var fields = $(dataGridID).datagrid('getColumnFields');
    for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        var col = $(dataGridID).datagrid('getColumnOption', field);
        if (col.hidden) {
            cmenu.menu('appendItem', {
                text: col.title,
                name: field,
                iconCls: 'icon-empty'
            });
        }
        else {
            cmenu.menu('appendItem', {
                text: col.title,
                name: field,
                iconCls: 'icon-ok'
            });
        }
    }
}

var createGridHeaderContextMenu = function (dgID, e, field) {
    e.preventDefault();
    var grid = $(dgID); /* grid本身 */
    var headerContextMenu = this.headerContextMenu; /* grid上的列头菜单对象 */
    if (!headerContextMenu || headerContextMenu) {
        var tmenu = $('<div style="width:100px;"></div>').appendTo('body');
        var fields = grid.datagrid('getColumnFields');
        for (var i = 0; i < fields.length; i++) {
            var fildOption = grid.datagrid('getColumnOption', fields[i]);
            if (!fildOption.hidden) {
                $('<div iconCls="icon-ok" field="' + fields[i] + '"/>').html(fildOption.title).appendTo(tmenu);
            } else {
                $('<div iconCls="icon-empty" field="' + fields[i] + '"/>').html(fildOption.title).appendTo(tmenu);
            }
        }
        headerContextMenu = this.headerContextMenu = tmenu.menu({
            onClick: function (item) {
                var field = $(item.target).attr('field');
                if (item.iconCls == 'icon-ok') {
                    grid.datagrid('hideColumn', field);
                    $(this).menu('setIcon', {
                        target: item.target,
                        iconCls: 'icon-empty'
                    });
                } else {
                    grid.datagrid('showColumn', field);
                    $(this).menu('setIcon', {
                        target: item.target,
                        iconCls: 'icon-ok'
                    });
                }
            }
        });
    }
    headerContextMenu.menu('show', {
        left: e.pageX,
        top: e.pageY
    });
};
$(function () {
    $.fn.datagrid.defaults.onHeaderContextMenu = createGridHeaderContextMenu;
    $.fn.treegrid.defaults.onHeaderContextMenu = createGridHeaderContextMenu;
});
function getSelected() {
    var row = $('#test1').datagrid('getSelected');
    if (row) {
        $.messager.alert('系统提示', row.itemid + ":" + row.productid + ":" + row.attr1);
    }
}
//返回选中行ID,用,分割
function getSelections(dgID, ID) {
    var ss = [];
    var rows = $('#' + dgID).datagrid('getSelections');
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        ss.push(row.ID);
    }
    return ss.join(',');
}
//DataGrid 绑定方法 过时的方法
function __initDataGrid(dgID, title, url, sortName, idField, width, height, sortOrder, remoteSort, frozenColumns, columns, toolbar, postData, pagination, pageNumber, pageSize, rownumbers) {
    $(dgID).datagrid({
        title: title, //表格标题
        url: url, //请求数据的页面
        sortName: sortName, //排序字段
        idField: idField, //标识字段,主键
        //iconCls: 'icon icon-datagrid', //标题左边的图标
        fitColumns: true,
        width: width, //宽度
        height: height, //高度
        method: 'post',
        nowrap: true, //是否换行，True 就会把数据显示在一行里
        striped: true, //True 奇偶行使用不同背景色
        collapsible: false, //可折叠
        sortOrder: sortOrder, //排序类型
        remoteSort: remoteSort, //定义是否从服务器给数据排序
        loadMsg: '数据加载中,请稍后..',
        frozenColumns: frozenColumns,
        columns: columns,
        onHeaderContextMenu: function (e, field) {
            e.preventDefault();
            if (!cmenu) {
                createColumnMenu();
            }
            cmenu.menu('show', {
                left: e.pageX,
                top: e.pageY
            });
        },
        onLoadError: function (param) {
            showAlert("", "加载失败", "error");
        },
        toolbar: toolbar,
        queryParams: postData, //参数
        pagination: pagination, //是否开启分页
        pageNumber: pageNumber, //默认索引页
        pageSize: pageSize, //默认一页数据条数
        rownumbers: rownumbers //行号
    });
}
//easyui 验证控件移除验证和添加验证
$.extend($.fn.validatebox.methods, {
    remove: function (jq, newposition) {
        return jq.each(function () {
            $(this).removeClass("validatebox-text validatebox-invalid").unbind('focus.validatebox').unbind('blur.validatebox');
        });
    },
    reduce: function (jq, newposition) {
        return jq.each(function () {
            var opt = $(this).data().validatebox.options;
            $(this).addClass("validatebox-text").validatebox(opt);
        });
    }
});
function formValidate(id) {
    var box = $(id + ' .validatebox-text');

    if (box.length) {
        box.validatebox("validate");
        box.trigger("blur");

        var ret = $('#' + id + ' .validatebox-invalid:first').focus();
        if (ret.length != 0)
            return false;
    }

    return true;
}

//键盘监听
function webpageKey(id) {
    $(window).keydown(function (event) {
        var currentRowIndex = $(id).datagrid("getRowIndex", $(id).datagrid("getSelected"));
        //        var options = $(id).datagrid('options');
        //        var currentPageIndex = options.pageNumber;
        //        var total = options.total;  
        //        var max = Math.ceil(total/options.pageSize);
        switch (event.keyCode) {
            case 38:
                var selections = $(id).datagrid('getSelections');
                if (selections.length > 0)
                    $(id).datagrid("unselectAll");
                var allLins = $(id).datagrid("getRows").length;
                currentRowIndex = currentRowIndex == -1 ? allLins - 1 : currentRowIndex - 1;
                if (0 <= currentRowIndex && currentRowIndex < allLins)
                    $(id).datagrid("selectRow", currentRowIndex);
                break;
            case 40:
                var selections = $(id).datagrid('getSelections');
                if (selections.length > 0)
                    $(id).datagrid("unselectAll");
                var allLins = $(id).datagrid("getRows").length;
                currentRowIndex = currentRowIndex == allLins ? 0 : currentRowIndex + 1;
                if (0 <= currentRowIndex && currentRowIndex < allLins)
                    $(id).datagrid("selectRow", currentRowIndex);
                break;
        }
    });
}
//修正行号长度长时显示不全bug
$.extend($.fn.datagrid.methods, {
    fixRownumber: function (jq) {
        return jq.each(function () {
            var panel = $(this).datagrid("getPanel");
            //获取最后一行的number容器,并拷贝一份
            var clone = $(".datagrid-cell-rownumber", panel).last().clone();
            //由于在某些浏览器里面,是不支持获取隐藏元素的宽度,所以取巧一下
            clone.css({
                "position": "absolute",
                left: -1000
            }).appendTo("body");
            var width = clone.width("auto").width();
            //默认宽度是25,所以只有大于25的时候才进行fix
            if (width > 25) {
                //多加5个像素,保持一点边距
                $(".datagrid-header-rownumber,.datagrid-cell-rownumber", panel).width(width + 5);
                //修改了宽度之后,需要对容器进行重新计算,所以调用resize
                $(this).datagrid("resize");
                //一些清理工作
                clone.remove();
                clone = null;
            } else {
                //还原成默认状态
                $(".datagrid-header-rownumber,.datagrid-cell-rownumber", panel).removeAttr("style");
            }
        });
    }
});
//layout折叠后显示标题
//在layout的panle全局配置中,增加一个onCollapse处理title
(function ($) {
    var buttonDir = { north: 'down', south: 'up', east: 'left', west: 'right' };
    $.extend($.fn.layout.paneldefaults, {
        onCollapse: function () {
            /**/
            var popts = $(this).panel('options');
            var dir = popts.region;
            var btnDir = buttonDir[dir];
            if (!btnDir)
                return false;

            var pDiv = $('.layout-button-' + btnDir).closest('.layout-expand').css({
                textAlign: 'center', lineHeight: '18px', fontWeight: 'bold'
            }).first();

            if (popts.title) {
                var vTitle = popts.title;
                if (dir == "east" || dir == "west") {
                    var vTitle = popts.title.split('').join('<br/>');
                    pDiv.find('.panel-body').html(vTitle);
                } else {
                    $('.layout-button-' + btnDir).closest('.layout-expand').find('.panel-title')
                    .css({ textAlign: 'left' })
                    .html(vTitle)
                }
            }
        }
    });
})(jQuery);
$.extend($.fn.datagrid.methods, {
    columnMoving: function (jq) {
        return jq.each(function () {
            var target = this;
            var cells = $(this).datagrid('getPanel').find('div.datagrid-header td[field]');
            cells.draggable({
                revert: 'invalid',
                cursor: 'pointer',
                edge: 5,
                proxy: function (source) {
                    var p = $('<div class="tree-node-proxy tree-dnd-no" style="position:absolute;border:0px solid #ff0000;"/>').appendTo('body');
                    //p.html($(source).text());
                    p.hide();
                    return p;
                },
                onBeforeDrag: function (e) {
                    e.data.startLeft = $(this).offset().left;
                    e.data.startTop = $(this).offset().top;
                },
                onStartDrag: function () {
                    $(this).draggable('proxy').css({
                        left: -10000,
                        top: -10000
                    });
                },
                onDrag: function (e) {
                    $(this).draggable('proxy').show().css({
                        left: e.pageX + 15,
                        top: e.pageY + 15
                    });
                    return false;
                }
            }).droppable({
                accept: 'td[field]',
                onDragOver: function (e, source) {
                    $(source).draggable('proxy').removeClass('tree-dnd-no').addClass('tree-dnd-yes').html($(source).text()).attr('border', '1px solid #ff0000'); ;
                    $(this).css('border-left', '1px solid #ff0000');
                },
                onDragLeave: function (e, source) {
                    $(source).draggable('proxy').removeClass('tree-dnd-yes').addClass('tree-dnd-no').html('');
                    $(this).css('border-left', 0);
                },
                onDrop: function (e, source) {
                    $(this).css('border-left', 0);
                    var fromField = $(source).attr('field');
                    var toField = $(this).attr('field');
                    setTimeout(function () {
                        swapField(fromField, toField);
                        $(target).datagrid();
                        $(target).datagrid('columnMoving');
                    }, 0);
                }
            });

            // swap Field to another location
            function swapField(from, to) {
                var columns = $(target).datagrid('options').columns;
                var cc = columns[0];
                _swap(from, to);
                function _swap(fromfiled, tofiled) {
                    var fromtemp;
                    var totemp;
                    var fromindex = 0;
                    var toindex = 0;
                    for (var i = 0; i < cc.length; i++) {
                        if (cc[i].field == fromfiled) {
                            fromindex = i;
                            fromtemp = cc[i];
                        }
                        if (cc[i].field == tofiled) {
                            toindex = i;
                            totemp = cc[i];
                        }
                    }
                    cc.splice(fromindex, 1, totemp);
                    cc.splice(toindex, 1, fromtemp);
                }
            }
        });
    }
});
//easyui验证规则扩展
$.extend($.fn.validatebox.defaults.rules, {
    equalTo: {
        validator: function (value, param) {
            return value == $(param[0]).val();
        },
        message: '两次输入的字符不一致'
    },
    notEqualTo: {
        validator: function (value, param) {
            return value != $(param[0]).val();
        },
        message: '两次输入的字符不能一致'
    },
    customValidate: {
        validator: function (value, param) {
            var rt = param[0](value); //调用函数
            param[1] = rt; //设置显示的信息
            return rt == null; //如果无返回信息,说明校验通过
        },
        message: '{1}' //显示校验错误信息
    },
    safePwd: {
        validator: function (value, param) {
            return safePassword(value);
        },
        message: '密码必须由字母和数字组成，至少3位'
    },
    dateValidate: {
        validator: function (value, param) {
            var tempArr = value.split("-");
            if (parseInt(tempArr[1]) == 0 || parseInt(tempArr[1]) > 12) {//月份  
                return false;
            }
            var lastday = new Date(parseInt(tempArr[0]), parseInt(tempArr[1]), 0); //获取当月的最后一天日期           
            if (parseInt(tempArr[2]) == 0 || parseInt(tempArr[2]) > lastday.getDate()) {//当月的日  
                return false;
            }
            var myDate = new Date(parseInt(tempArr[0]), parseInt(tempArr[1]) - 1, parseInt(tempArr[2]));
            if (myDate == "Invalid Date") {
                return false;
            }
            return true;
        },
        message: '日期格式不正确'
    },
    dateTimeValidate: {
        validator: function (value, param) {
            var date = value.split(" ")[0];
            var time = value.split(" ")[1];
            //检测年月日
            if (!date)
                return false;
            var tempArr = date.split("-");
            if (parseInt(tempArr[1]) == 0 || parseInt(tempArr[1]) > 12) {//月份  
                return false;
            }
            var lastday = new Date(parseInt(tempArr[0]), parseInt(tempArr[1]), 0); //获取当月的最后一天日期           
            if (parseInt(tempArr[2]) == 0 || parseInt(tempArr[2]) > lastday.getDate()) {//当月的日  
                return false;
            }
            var myDate = new Date(parseInt(tempArr[0]), parseInt(tempArr[1]) - 1, parseInt(tempArr[2]));
            if (myDate == "Invalid Date") {
                return false;
            }
            //检测时分秒
            if (!time)
                return false;
            var tempArr1 = time.split(":");
            if (parseInt(tempArr1[0]) > 23) {
                return false;
            }
            if (parseInt(tempArr1[1]) > 60 || parseInt(tempArr1[2]) > 60) {
                return false;
            }
            return true;
        },
        message: '日期格式不正确'
    }
});
/* 密码由字母和数字组成，至少6位 */
var safePassword = function (value) {
    return !(/^(([A-Z]*|[a-z]*|\d*|[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]*)|.{0,2})$|\s/.test(value));
}

/**
* 合并指定列的单元格扩展方法
**/
$.extend($.fn.datagrid.methods, {
    autoMergeCells: function (jq, fields) {
        return jq.each(function () {
            var target = $(this);
            if (!fields) {
                fields = target.datagrid("getColumnFields");
            }
            var rows = target.datagrid("getRows");
            var i = 0,
			j = 0,
			temp = {};
            for (i; i < rows.length; i++) {
                var row = rows[i];
                j = 0;
                for (j; j < fields.length; j++) {
                    var field = fields[j];
                    var tf = temp[field];
                    if (!tf) {
                        tf = temp[field] = {};
                        tf[row[field]] = [i];
                    } else {
                        var tfv = tf[row[field]];
                        if (tfv) {
                            tfv.push(i);
                        } else {
                            tfv = tf[row[field]] = [i];
                        }
                    }
                }
            }
            $.each(temp, function (field, colunm) {
                $.each(colunm, function () {
                    var group = this;

                    if (group.length > 1) {
                        var before,
						after,
						megerIndex = group[0];
                        for (var i = 0; i < group.length; i++) {
                            before = group[i];
                            after = group[i + 1];
                            if (after && (after - before) == 1) {
                                continue;
                            }
                            var rowspan = before - megerIndex + 1;
                            if (rowspan > 1) {
                                target.datagrid('mergeCells', {
                                    index: megerIndex,
                                    field: field,
                                    rowspan: rowspan
                                });
                            }
                            if (after && (after - before) != 1) {
                                megerIndex = after;
                            }
                        }
                    }
                });
            });
        });
    }
});
//动态添加和删除验证
$.extend($.fn.validatebox.methods, {
    remove: function (jq, newposition) {
        return jq.each(function () {
            $(this).removeClass("validatebox-text validatebox-invalid").unbind('focus').unbind('blur');
        });
    },
    reduce: function (jq, newposition) {
        return jq.each(function () {
            var opt = $(this).data().validatebox.options;
            $(this).addClass("validatebox-text").validatebox(opt);
        });
    }
});

//#endregion

//#region 单元格编辑方法
var editIndex = undefined;
function beginEditing(dgID, columHeader, rowIndex, field, value) {
    if (field == columHeader)
        return;

    if (rowIndex != editIndex) {
        if (endEditing(dgID)) {
            $(dgID).datagrid('beginEdit', rowIndex);
            editIndex = rowIndex;
            var ed = $(dgID).datagrid('getEditor', { index: rowIndex, field: field });
            $(ed.target).focus().bind('blur', function () {
                endEditing(dgID);
            });
        } else {
            $(dgID).datagrid('selectRow', editIndex);
        }
    }
}
function endEditing(dgID) {
    if (editIndex == undefined) {
        return true
    }
    if ($(dgID).datagrid('validateRow', editIndex)) {
        $(dgID).datagrid('endEdit', editIndex);
        $(dgID).datagrid('selectRow', editIndex);
        editIndex = undefined;
        return true;
    } else {
        return false;
    }
}
//#endregion

//#region databox
function databox_onBlur(current) {
    $(current).datebox('setValue', $(current).datebox('getValue'));
}
function onSelect(date) {
    //$(current).datebox('setValue', $(current).datebox('getValue'));
}
function DataToWeek(date) {
    var day = new Date(Date.parse(date));   //需要正则转换的则 此处为 : var day = new Date(Date.parse(date.replace(/-/g, '/')));  
    var today = new Array('日', '一', '二', '三', '四', '五', '六');
    var week = today[day.getDay()];
    return week;
}
//click扩展    
//onBlur: function (jq, onClick) {
//var _22 = $.data(jq[0], "textbox");
//var tb = _22.textbox;
//var _24 = tb.find(".textbox-text");
//_24.bind("blur.textbox", function (e) 
//$(jq[0]).textbox().next('span').find('input').bind('blur',function(e){
//onClick.call(target);
//});
//}
$.extend($.fn.textbox.methods, {
    onBlur: function (jq, fun) {
        return jq.each(function () {
            var t = $(this);
            var opts = t.textbox('options');
            opts.icons = opts.icons || [];
            t.textbox();
            t.textbox('textbox').bind('blur', function () {
                fun.call();
            });
        });
    }
});

$.extend($.fn.datebox.methods, {
    /**
    * 禁用combo文本域
    * @param {Object} jq
    * @param {Object} param stopArrowFocus:是否阻止点击下拉按钮时foucs文本域
    * stoptype:禁用类型，包含disable和readOnly两种方式
    */
    disableTextbox: function (jq, param) {
        return jq.each(function () {
            param = param || {};
            var textbox = $(this).combo("textbox");
            var that = this;
            var panel = $(this).combo("panel");
            var data = $(this).data('combo');
            if (param.stopArrowFocus) {
                data.stopArrowFocus = param.stopArrowFocus;
                var arrowbox = $.data(this, 'combo').combo.find('span.combo-arrow');
                arrowbox.unbind('click.combo').bind('click.combo', function () {
                    if (panel.is(":visible")) {
                        $(that).datebox('hidePanel');
                    } else {
                        $("div.combo-panel").panel("close");
                        $(that).datebox('showPanel');
                    }
                });
                textbox.unbind('mousedown.mycombo').bind('mousedown.mycombo', function (e) {
                    e.preventDefault();
                });
            }
            textbox.prop(param.stoptype ? param.stoptype : 'disabled', true);
            data.stoptype = param.stoptype ? param.stoptype : 'disabled';
        });
    },
    /**
    * 还原文本域
    * @param {Object} jq
    */
    enableTextbox: function (jq) {
        return jq.each(function () {
            var textbox = $(this).combo("textbox");
            var data = $(this).data('combo');
            if (data.stopArrowFocus) {
                var that = this;
                var panel = $(this).combo("panel");
                var arrowbox = $.data(this, 'combo').combo.find('span.combo-arrow');
                arrowbox.unbind('click.combo').bind('click.combo', function () {
                    if (panel.is(":visible")) {
                        $(that).datebox('hidePanel');
                    } else {
                        $("div.combo-panel").panel("close");
                        $(that).datebox('showPanel');
                    }
                    textbox.focus();
                });
                textbox.unbind('mousedown.mycombo');
                data.stopArrowFocus = null;
            }
            textbox.prop(data.stoptype, false);
            data.stoptype = null;
        });
    }
});

function getTextBoxControl(controlID) {
    return $(controlID).textbox().next('span').find('input');
}
//#endregion

//#region wcf操作
//Ajax common method
//jsonData:url data
//wcfServiceUrl:wcf service mothed url
//successFun:ajax success method
function __ajaxMethodCommon(jsonData, wcfServiceUrl, successFun) {
    //loading(true);
    $.ajax({
        url: wcfServiceUrl,
        type: 'POST',
        data: jsonData,
        dataType: 'json',
        async: false,
        success: function (msg) {
            //loading(false);
            successFun.apply(successFun, [msg, arguments]);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            loading(false);
            //alert(XMLHttpRequest.status);
            //alert(textStatus);
            //alert(errorThrown);
            alert(errorThrown);
        }
    });
};
//Ajax common method
//jsonData:url data
//wcfServiceUrl:wcf service mothed url
//successFun:ajax success method
function __ajaxMethodCommonByGet(jsonData, wcfServiceUrl, successFun) {
    $.ajax({
        data: jsonData,
        url: wcfServiceUrl,
        type: "get",
        success: function (msg) {
            //if (msg.d.length < 1)
            //    return;
            successFun.apply(successFun, [msg, arguments]);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
            alert(textStatus);
            alert(errorThrown);
        }
    });
};
//get call the method of wcf ajax url data string
function __getWcfUrlData(data) {
    try {
        var urlData = "{";
        for (var i = 0; i < data.length; i++) {
            urlData += '"' + data[i].split(':')[0] + '":"' + encodeURIComponent(data[i].split(':')[1].replace(/'/g, "&#039;")) + '"';
            if (i < data.length - 1)
                urlData += ",";
        }
        urlData += "}";
        return urlData;
    }
    catch (ex) {
        alert(ex)
    }
}
//json参数转换为url参数字符串
function __getUrlJson2String(data) {
    var ret = "";
    $.each(data, function (key, value) {
        if (typeof (value) == "object")
            ret += __getUrlJson2String(value);
        else
            ret += "&" + key + "=" + value;
    });
    return ret;
}
//#endregion

//#region datagrid 单元格编辑扩展
//gridEditCellHelper 对象为编辑所需的所有代码
//131012-datagrid 单元格编辑扩展
var gridEditCellHelper = {
    //开始单元格编辑
    beginCellEdit: function (_traget, _index, _fieldName) {
        var opts = $.data(_traget, "datagrid").options;
        var tr = opts.finder.getTr(_traget, _index);
        var row = opts.finder.getRow(_traget, _index);
        $(_traget).datagrid('endEdit', _index);
        gridEditCellHelper.bindCellEditEvent(_traget, _index);
        if (tr.hasClass("datagrid-row-editing")) {
            //return; //原:处在编辑状态时不进行编辑
            //单元格取消编辑操作
        } else {
            tr.addClass("datagrid-row-editing");
        }
        if (opts.onBeforeEdit.call(_traget, _index, row) == false) {
            return;
        }
        //tr.addClass("datagrid-row-editing");
        gridEditCellHelper._initCellEditor(_traget, _index, _fieldName); //初始化编辑器
        gridEditCellHelper._resizeEditors(_traget); //调整编辑器大小
        tr.find("div.datagrid-editable").each(function () {
            var _field = $(this).parent().attr("field");
            if (_field != _fieldName) return true;
            var ed = $.data(this, "datagrid.editor");
            ed.actions.setValue(ed.target, row[_field]); //编辑器赋值
        });
        //_validateEditingRow(_traget, _index); //　 --编辑行输入值验证
    },
    //初始化单元格编辑器
    _initCellEditor: function (_traget, _index, _fieldName) {
        var opts = $.data(_traget, "datagrid").options;
        var tr = opts.finder.getTr(_traget, _index);
        tr.children("td").each(function () {
            var cell = $(this).find("div.datagrid-cell");
            var _field = $(this).attr("field");
            if (_field != _fieldName) return true;
            var col = gridEditCellHelper._findField(_traget, _field);
            if (col && col.editor) {
                var _editorType, _editorOpts;
                if (typeof col.editor == "string") {
                    _editorType = col.editor;
                } else {
                    _editorType = col.editor.type;
                    _editorOpts = col.editor.options;
                }
                var _editor = opts.editors[_editorType];
                if (_editor) {
                    var _html = cell.html();
                    var _width = cell.outerWidth();
                    cell.addClass("datagrid-editable");
                    cell.outerWidth(_width);
                    cell.html("<table border=\"0\" cellspacing=\"0\" cellpadding=\"1\"><tr><td></td></tr></table>");
                    cell.children("table").bind("click dblclick contextmenu", function (e) {
                        e.stopPropagation();
                    });
                    $.data(cell[0], "datagrid.editor", { actions: _editor, target: _editor.init(cell.find("td"), _editorOpts), field: _field, type: _editorType, oldHtml: _html });
                    window.setTimeout(function () {
                        cell.children("table").find("input").select();
                    }, 100);
                }
            }
        });
        gridEditCellHelper._setRowHeight(_traget, _index, true); //设置行高度
    },
    //查找字段
    _findField: function (_traget, _field) {
        function _getCol(_columns) {
            if (_columns) {
                for (var i = 0; i < _columns.length; i++) {
                    var cc = _columns[i];
                    for (var j = 0; j < cc.length; j++) {
                        var c = cc[j];
                        if (c.field == _field) {
                            return c;
                        }
                    }
                }
            }
            return null;
        };
        var _opts = $.data(_traget, "datagrid").options;
        var col = _getCol(_opts.columns);
        if (!col) {
            col = _getCol(_opts.frozenColumns);
        }
        return col;
    },
    //调整编辑器大小
    _resizeEditors: function (_traget) {
        var dc = $.data(_traget, "datagrid").dc;
        dc.view.find("div.datagrid-editable").each(function () {
            var _ad = $(this);
            var _field = _ad.parent().attr("field");
            var colOpts = $(_traget).datagrid("getColumnOption", _field);
            _ad.outerWidth(colOpts.width);
            var ed = $.data(this, "datagrid.editor");
            if (ed.actions.resize) {
                ed.actions.resize(ed.target, _ad.width());
            }
        });
    },
    _setRowHeight: function (_traget, _index, _isSet) {//_traget, _index, true
        var _rows = $.data(_traget, "datagrid").data.rows;
        var _opts = $.data(_traget, "datagrid").options;
        var dc = $.data(_traget, "datagrid").dc;
        if (!dc.body1.is(":empty") && (!_opts.nowrap || _opts.autoRowHeight || _isSet)) {
            if (_index != undefined) {
                var tr1 = _opts.finder.getTr(_traget, _index, "body", 1);
                var tr2 = _opts.finder.getTr(_traget, _index, "body", 2);
                _setTrHeight(tr1, tr2);
            } else {
                var tr1 = _opts.finder.getTr(_traget, 0, "allbody", 1);
                var tr2 = _opts.finder.getTr(_traget, 0, "allbody", 2);
                _setTrHeight(tr1, tr2);
                if (_opts.showFooter) {
                    var tr1 = _opts.finder.getTr(_traget, 0, "allfooter", 1);
                    var tr2 = _opts.finder.getTr(_traget, 0, "allfooter", 2);
                    _setTrHeight(tr1, tr2);
                }
            }
        }
        _resizeView(_traget);
        if (_opts.height == "auto") {
            var _body1Parent = dc.body1.parent();
            var _body2 = dc.body2;
            var _bodySize = _getBodySize(_body2);
            var _bodyHeight = _bodySize.height;
            if (_bodySize.width > _body2.width()) {
                _bodyHeight += 18;
            }
            _body1Parent.height(_bodyHeight);
            _body2.height(_bodyHeight);
            dc.view.height(dc.view2.height());
        }
        dc.body2.triggerHandler("scroll");
        function _setTrHeight(_tr1, _tr2) {//tr1, tr2
            for (var i = 0; i < _tr2.length; i++) {
                var tr1 = $(_tr1[i]);
                var tr2 = $(_tr2[i]);
                tr1.css("height", "");
                tr2.css("height", "");
                var _maxHeight = Math.max(tr1.height(), tr2.height());
                tr1.css("height", _maxHeight);
                tr2.css("height", _maxHeight);
            }
        };
        function _getBodySize(cc) {
            var _3d = 0;
            var _3e = 0;
            $(cc).children().each(function () {
                var c = $(this);
                if (c.is(":visible")) {
                    _3e += c.outerHeight();
                    if (_3d < c.outerWidth()) {
                        _3d = c.outerWidth();
                    }
                }
            });
            return { width: _3d, height: _3e };
        };
        function _resizeView(_traget) {
            var _opts = $.data(_traget, "datagrid").options;
            var dc = $.data(_traget, "datagrid").dc;
            var _panel = $.data(_traget, "datagrid").panel;
            var _width = _panel.width();
            var _height = _panel.height();
            var _view = dc.view;
            var _view1 = dc.view1;
            var _view2 = dc.view2;
            var _header1 = _view1.children("div.datagrid-header");
            var _header2 = _view2.children("div.datagrid-header");
            var _table1 = _header1.find("table");
            var _table2 = _header2.find("table");
            _view.width(_width);
            var _2b = _header1.children("div.datagrid-header-inner").show();
            _view1.width(_2b.find("table").width());
            if (!_opts.showHeader) {
                _2b.hide();
            }
            _view2.width(_width - _view1.outerWidth());
            _view1.children("div.datagrid-header,div.datagrid-body,div.datagrid-footer").width(_view1.width());
            _view2.children("div.datagrid-header,div.datagrid-body,div.datagrid-footer").width(_view2.width());
            var hh;
            _header1.css("height", "");
            _header2.css("height", "");
            _table1.css("height", "");
            _table2.css("height", "");
            hh = Math.max(_table1.height(), _table2.height());
            _table1.height(hh);
            _table2.height(hh);
            _header1.add(_header2).outerHeight(hh);
            if (_opts.height != "auto") {
                var _2c = _height - _view2.children("div.datagrid-header").outerHeight() - _view2.children("div.datagrid-footer").outerHeight() - _panel.children("div.datagrid-toolbar").outerHeight();
                _panel.children("div.datagrid-pager").each(function () {
                    _2c -= $(this).outerHeight();
                });
                dc.body1.add(dc.body2).children("table.datagrid-btable-frozen").css({ position: "absolute", top: dc.header2.outerHeight() });
                var _2d = dc.body2.children("table.datagrid-btable-frozen").outerHeight();
                _view1.add(_view2).children("div.datagrid-body").css({ marginTop: _2d, height: (_2c - _2d) });
            }
            _view.height(_view2.height());
        };
    },
    bindCellEditEvent: function (_target, _index) {
        //131014-点击空白区域结束grid编辑
        $(document).on("click.datagrid", function (e) { //点击datagrid空白区域，结束编辑
            if (_index >= 0) {
                $(_target).datagrid('endEdit', _index);
            }
        });
    }
};
//datagrid 扩展方法
$.extend($.fn.datagrid.methods, {
    //开始编辑单元格:param={ index: _index, field: _field, value: _value, traget: _traget }
    beginCellEditExt: function (jq, param) {
        return jq.each(function () {
            gridEditCellHelper.beginCellEdit(this, param.index, param.field);
        });
    }
});
//#endregion

//#region easyUI验证扩展
//基盘编号是否存在验证
//$.extend($.fn.validatebox.defaults.rules, {
//    Base_NOExist: {
//        validator: function (value, param) {
//            value = $(param[0]).attr('value');  
//            var postData = {
//                    "action": "queryOne",
//                    "para": {
//                        "BASE_NO": value
//                    }
//                };
//                __ajaxMethodCommon(postData, param[1], function (msg) {
//                    if (msg.length < 1)
//                        return;
//                    if (msg.Statue == "ok") {
//                        return false;
//                    }
//                    else {
//                        return true;
//                    }
//                });
//        },
//        message: '此编号以存在，请重新输入！'
//    }
//});
//#endregion

//#region  判断前面字符串是否包含在后面字符串中
function Search_Str(id, data) {
    //    // 给前后加逗号
    //    data = ',' + data + ',';
    //    // 转义id里的.(点)， 不然new之后就变成通配符了
    //    id = id.replace(/\./, '\\.');
    //    var reg = "," + id + ",";
    //    var exp = new RegExp(reg, "g");
    //    data = data.replace(exp, ",");
    //    // 删除前后逗号
    //    data = data.replace(/(^,)|(,$)/g, '');
    //    alert(data);
    if (data.indexOf(id) >= 0) {
        return true;
    }
    else {
        return false;
    }
}
//#endregion

//#region 常用计算,转换函数
function myParseFloat(val) {
    var ret = parseFloat(val);
    if (isNaN(ret))
        ret = 0;
    return ret;
}
//#endregion

//#region input 获取焦点事件
function getTextBoxControl(controlID) {
    return $(controlID).textbox().next('span').find('input');
}
//#endregion

//#region 重新登录确认提示
function confirmLoginPage(data) {
    //使用easyui扩展
    //$.easyui.messager.confirm("温馨提示", NotLoginInfo + "是否重新登录?",
    //   function (c) {
    //       if (c) {
    //           window.parent.location = Config.LoginPage;
    //       }
    //   }
    //);
    var msg = "";
    if (data)
        msg = '异常信息为：' + data + '<br/>是否重新登录？';
    else
        msg = NotLoginInfo + '是否重新登录？';
    showConfirm('温馨提示', msg, function () {
        if (window.parent.parent)
            window.parent.parent.location = Config.LoginPage;
        else if (window.parent)
            window.parent.location = Config.LoginPage;
        else
            window.location = Config.LoginPage;
    });
}
//#endregion

//将treenode数据进行处理
function parseTreeNodeData(proot){		
	if(proot.children.length>0){
		proot.state="closed";
		for(var i=0;i<proot.children.length;i++){
			parseTreeNodeData(proot.children[i]);				
		}
	}
	else{
		proot.text = proot.text+"["+proot.code+"]";
		delete proot.children;
	}
};

//初始化样式列表
//icons
function initIconCls(id){
	var url = basePath+"static/common/js/easyUi/themes/icon.css";
	$.ajax({
		url:url,
		async:false,
		success:function(data){
			var splits = data.split("\r\n");
			var ary = splits.filter(x=>x.startsWith(".")).map(x=>x.split("{")[0].trim()).map(x=>x.substr(x.indexOf(".")+1,x.length));
			var dom = "<tr>";
			for(var i=0;i<ary.length;i++){
				//dom += "<td><input type='radio' name='iconVal' onClick='searchIconCls();' value='"+ary[i]+"'>&nbsp;";
				dom += "<td><a href='#' id='"+ary[i]+"' class='"+ary[i]+"' onClick='searchIconCls(\""+ary[i]+"\");' ></a></td>";
				if((i+1)%8==0){
					dom+="</tr><tr>";			
				}				
			}
			dom+="</tr>";			
			$("#"+id).append(dom);
			for(var i=0;i<ary.length;i++){
				$("#"+ary[i]).linkbutton({
					iconCls:"+ary[i]+"
				});
			}
		}
	})
}

function searchIconCls(val){
	$("#iconCls").textbox('setValue',val);
	$("#iconCls_btn").linkbutton({
		iconCls:val
	});
	$("#icons_dialog").dialog("close");	
}

function searchIcons(){	
	$("#icons_dialog").dialog("open");	
}

//获取所有项目数据
function getProjComboDatas(pcode){	
	var cmdata = [];	
	$.ajax( {    
		url:basePath +  'sysProj/getProjComboDatas.do',  
 	    type:'get',    
 	    cache:false,    
 	    async: false,
 	    dataType:'json',   
 	    data:{
 	    	pcode:pcode
 	    },
 	    success:function(data) {  
 	    	cmdata = data;
 	     },    
 	     error : function() {    
 	          alert("异常！");    
 	     }    
 	});	
	return cmdata;
}
//获取所有项目数据
function getTbmProjByCode(code){	
	var obj = null;	
	$.ajax( {    
		url:basePath +  'sysProj/getTbmProjByCode.do',  
		type:'get',    
		cache:false,    
		async: false,
		dataType:'json',   
		data:{code:code},
		success:function(data) {  
			if(data){
				obj = data;				
			}
			else{
				alert("异常！");    				
			}
		},    
		error : function() {    
			alert("异常！");    
		}    
	});	
	return obj;
}

//获取所有TBM信息
function getTbmInfoByCode(code){	
	var obj = null;	
	$.ajax( {    
		url:basePath +  'sysTbmInfo/getSysTbmInfoByCode.do',  
		type:'get',    
		cache:false,    
		async: false,
		dataType:'json',   
		data:{
			code:code
		},
		success:function(data) {  
			if(data){
				obj = data;				
			}
			else{
				alert("异常！");    				
			}
		},    
		error : function() {    
			alert("异常！");    
		}    
	});	
	return obj;
}
//获取所有项目数据
function getTbmTypeComboDatas(){	
	var cmdata = [];	
	$.ajax( {    
		url:basePath +  'sysTbmInfo/getTbmTypeComboDatas.do',  
		type:'get',    
		cache:false,    
		async: false,
		dataType:'json',   
		success:function(data) {  
			cmdata = data;
		},    
		error : function() {    
			alert("异常！");    
		}    
	});	
	return cmdata;
}

function getTbmWarning(tbmId){
	var obj = null;
	var url = basePath +  'sysTbmWarning/get.do';
	$.ajax({
        url: url,
        type: "get",        
        dataType: 'json',
        cache: false,
        async: false,
        data: {
            tbmId: tbmId
        },
        success: function (data) {
        	obj = data;
        },
        error:function(){
        	return "异常";
        }
	});
	return obj;
}

function getTbmCodeInfoByTbmId(tbmId){
	var obj = null;
	var url = basePath +  'baseSearch/getTbmCodeInfoByTbmId.do';
	$.ajax({
        url: url,
        type: "get",        
        dataType: 'json',
        cache: false,
        async: false,
        data: {
            tbmId: tbmId
        },
        success: function (data) {
        	obj = data;
        },
        error:function(){
        	return "异常";
        }
	});
	return obj;
}

function getWorkStatus(tbmId){
	var workInfo = null;
	var url = basePath +  'baseSearch/getWorkStatus.do';
	$.ajax({
        url: url,
        type: "get",        
        dataType: 'json',
        cache: false,
        async: false,
        data: {
            tbmId: tbmId
        },
        success: function (data) {
        	workInfo = data;
        },
        error:function(){
        	return "异常";
        }
	});
	return workInfo;
};

//获取TBMID对应的地质信息
function getSysGeologyInfosByTbmId(tbmId){
	var geoInfo = null;
	var url =  '/sysGeologyInfo/getSysGeologyInfosByTbmId.do';
	$.ajax({
		url: url,
		type: "get",        
		dataType: 'json',
		cache: false,
		async: false,
		data: {
			tbmId: tbmId
		},
		success: function (data) {
			geoInfo = data;
		},
		error:function(){
			alert("异常");
			return;
		}
	});
	return geoInfo;
};

//风险源信息
function getSysRiskInfosByTbmId(tbmId){
	var ary = null;
	$.ajax({
        url: basePath + 'sysRiskInfo/getSysRiskInfosByTbmId.do',
        type: "post",        
        dataType: 'json',
        cache: false,
        async: false,
        data: {
            tbmId: tbmId
        },
        success: function (data) {
        	ary = data.rows;
        },
        error:function(){
			alert("异常");
			return;
		}
	});
	return ary;
}

function getRiskInfos(projCode){
	var risks = null;
	var url = basePath +  'sysRiskInfo/getSysRiskInfos.do';
	$.ajax({
		url: url,
		type: "get",        
		dataType: 'json',
		cache: false,
		async: false,
		data: {
			projCode: projCode
		},
		success: function (data) {
			risks = data.rows;
		},
		error:function(){
			return "异常";
		}
	});
	return risks;
};

function initBaseInfo(tbmId){
	tbmInfo = getTbmInfoByCode(tbmId);
	projCode = tbmInfo.projCode;
	projInfo = getTbmProjByCode(projCode);
	var subName = tbmInfo.projName.replace(projInfo.name,"");
	$("#mainTitle").text(projInfo.name);
	$("#subTitle").text(subName);		
	warningDatas = getTbmWarning(tbmId);
	tbmCodeInfo = getTbmCodeInfoByTbmId(tbmId);	
	workStatus = getWorkStatus(tbmId);
}

function initLeftPanel(currentId) {	
	$.ajax({
		url : basePath + "treenode/getTreeNodesByCode.do",
		type : 'post',
		cache : false,
		async : false,
		dataType : 'json',
		data:{
			code:currentId
		},
		success : function(data) {
			var children = data.children;
			for (var i = 0; i < children.length; i++) {
				var node = children[i];
				var dom1 = "<ul> ";
				var nchs = node.children;
				if(nchs && nchs.length>0){
					for (var j = 0; j < nchs.length; j++) {
						var nnd = nchs[j];
						dom1 += "<li><span class='"+nnd.iconCls+"'></span>" +
							"<a  class='node'  id='" + nnd.id + "'  onClick='queryTabs(" + JSON.stringify(nnd) + ")' href='#'>" + nnd.text
							"</a></li>";							
					}
				}
				dom1 += " </ul>";			
				
				$('#nodePanel').accordion('add', {
					id:node.id,
					title: "&nbsp;"+node.text,
					content: dom1,
					iconCls:node.iconCls,					
					selected:i==0
				});
			}		
		},
		error : function() {
			alert("异常！");
		}
	});
}


function queryTabs(node) {
	if ($(this).tree('isLeaf', node.target)) {
		this.code = node.attributes.code;
		var url = basePath + "views/" + node.attributes.url;
		addTab(node.text, url);
	}
}

function addTab(title, url) {
	if ($('#tabs').tabs('exists', title)) {
		$('#tabs').tabs('select', title);
	} else {
		var content = '<iframe scrolling="auto" frameborder="0"  src="" style="width:100%;height:100%;margin-top:0px;border:0;"></iframe>';
		$('#tabs').tabs('add', {
			title : title,
			iconCls : 'icon-enginer',
			content : content,
			selected : true,
			fit : true,
			border : false,
			closable : true,
			style:{
				'padding-top':'3px',
				'padding-left':'3px',					
				'border': 0,
				'overflow': 'hidden'
			}
		});
		var subIframe = $('#tabs').tabs('getSelected').find('iframe')[0];
		$(subIframe).attr('src', url);
	}
}