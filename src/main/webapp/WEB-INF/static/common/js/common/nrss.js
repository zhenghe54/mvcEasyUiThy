//$(function () {
//    if (window.location.href.indexOf("WebMenuUtility") > -1) {
//
//    }
//    else {
//        InitLeftMenu();
//    }
//
//    tabClose();
//    tabCloseEven();
//})
//改变左侧菜单宽度
function leftMenuWidthSet() {
    if ($(window).height() < ($("#regionWest")[0].scrollHeight + $("#regionNorth").height() + 49)) {
        $('#tMenu').accordion({
            width: 196
        });
    }
    else {
        $('#tMenu').accordion({
            width: 213
        });
    }
}
//初始化左侧
function InitLeftMenu() {
    $("#tMenu").html('');
    $('#tMenu').accordion({
        onSelect:function(title, index){
            leftMenuWidthSet();
        },
        onUnselect: function () {
            leftMenuWidthSet();
        }
    });
    var postData = {
        "action": "getMenu"
        //"solution": $('#ddlSolution').combobox('getValue')
    };
    __ajaxMethodCommon(postData, "webClientMain2.ashx", function (msg) {
        if (msg.length < 1)
            return;
        msg = msg[0].children;
        var ifFirst = true;
        $.each(msg, function (i, n) {
            var icon = "";
            if (n.IMAGEURL != null && n.IMAGEURL != "")
                icon = Config.Application + "Image/MenuTree/" + n.IMAGEURL;
            else
                icon = Config.Application + "Image/MenuTree/user_business_boss.png";  //默认icon
            //添加手风琴
            $('#tMenu').accordion('add', {
                title: n.text,
                content: '',
                iconCls: 'icon icon-accordion',
                selected: ifFirst
            });
            ifFirst = false;
            //添加其子菜单树
            $('#tMenu').accordion('getPanel', i).tree({
                data: msg[i].children,
                method: 'post',
                lines: true,
                iconCls: 'icon icon-tree',
                onClick: function (node) {
                    $(this).tree(node.state === 'closed' ? 'expand' : 'collapse', node.target);
                    MenuClick(node);
                    leftMenuWidthSet();
                },
                onDblClick: function (node) {
                    $(this).tree(node.state === 'closed' ? 'expand' : 'collapse', node.target);
                    leftMenuWidthSet();
                }
            });
        });
    });
    var icons = $('#tMenu').find("span.tree-icon");
    if (icons) {
        $.each(icons, function (i, n) {
            //$(icons[i]).addClass("icon icon-tree");
            //$(icons[i]).removeClass("tree-file");
        });
    }
    //移除手风琴选中时黄色标题
    //$('#tMenu').accordion({
    //    onSelect: function (title, index) {
    //        $('#tMenu').accordion('getPanel', index).parent().children().removeClass('accordion-header-selected');
    //    }
    //});
    $(".easyui-accordion").accordion();
}
function TreeNodeOnClick(tabId, tabTitle, url, icon, current) {
    var _current = $(current);
    addTab(tabId, tabTitle, url, icon);
}
/*
Set  WebSite Path
*/
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
    Config.NRSS = '/';
Config.Application = Config.Local + Config.NRSS;
Config.LoginPage = Config.Application + "infologin.aspx";
Config.WebUpwdControl = Config.Application + "WebUpwdControl.ashx";
//系统当前登录用户信息
Config.LoginUserInfo = {};

function addTab(tabId, subtitle, url, icon) {
    if (url.indexOf('NRSSApp') == -1) {
        if (url.indexOf('NRSS') > -1)
            url = url.replace(/NRSS/gm, 'NRSSApp');
    }
    tabId = "iframe_" + tabId;
    subtitle = '<img class="tabs-icon" style="margin-top: -10px;" src="' + icon + '"> <span style="margin-left: 16px;">' + subtitle + '</span>';
    if (!$('#tabs').tabs('exists', subtitle)) {
        $('#tabs').tabs('add', {
            title: subtitle,
            content: '<iframe scrolling="auto" frameborder="0" name="' + tabId + '" src="' + Config.Application + url + '" style="width:100%;height:100%;"></iframe>',
            closable: true
        });
        TabOnSelect();
    } else {
        $('#tabs').tabs('select', subtitle);
        TabOnSelect();
    }
    tabClose();
}

function TabOnSelect() {
    var subIframe = $('#tabs').tabs('getSelected').find('iframe');
    //调用PageTabOnSelect事件:重新创建报表对象并查询数据
    $(subIframe).load(function () {
        if (jQuery.isFunction(subIframe[0].contentWindow.PageTabOnSelect)) {
            subIframe[0].contentWindow.PageTabOnSelect();
        }
    });
}
//首页按钮
function openIndex(index) {
    $('#tabs').tabs('select', 0);
    var subIframe = $('#tabs').tabs('getSelected').find('iframe');
    if (jQuery.isFunction(subIframe[0].contentWindow.TabSelect)) {
        subIframe[0].contentWindow.TabSelect(index);
    }
}

function tabClose() {
    /*双击关闭TAB选项卡*/
    $(".tabs-inner").dblclick(function () {
        var subtitle = $(this).children(".tabs-closable").html();
        $('#tabs').tabs('close', subtitle);
    })
    /*为选项卡绑定右键*/
    $(".tabs-inner").bind('contextmenu', function (e) {
        $('#mm').menu('show', {
            left: e.pageX,
            top: e.pageY
        });

        var subtitle = $(this).children(".tabs-closable").html();

        $('#mm').data("currtab", subtitle);
        $('#tabs').tabs('select', subtitle);
        return false;
    });

}

var _defaultTab = "主页";
//绑定右键菜单事件
function tabCloseEven() {
    //刷新当前
    $('#mm-tabReload').click(function () {
        var currtabIframe = $('#tabs').tabs('getSelected').find('iframe');
        currtabIframe.attr('src', currtabIframe.attr('src'));

    })
    //关闭当前
    $('#mm-tabclose').click(function () {
        var currtab_title = $('#mm').data("currtab");
        if (currtab_title != _defaultTab)
            $('#tabs').tabs('close', currtab_title);
    })
    //全部关闭
    $('#mm-tabcloseall').click(function () {
        $('.tabs-inner span').each(function (i, n) {
            var t = $(n).html();
            if (t != _defaultTab)
                $('#tabs').tabs('close', t);
        });
    });
    //关闭除当前之外的TAB
    $('#mm-tabcloseother').click(function () {
        var currtab_title = $('#mm').data("currtab");
        $('.tabs-inner span').each(function (i, n) {
            var t = $(n).html();
            if (t != currtab_title)
                if (t != _defaultTab)
                    $('#tabs').tabs('close', t);
        });
    });
    //关闭当前右侧的TAB
    $('#mm-tabcloseright').click(function () {
        var nextall = $('.tabs-selected').nextAll();
        if (nextall.length == 0) {
            //msgShow('系统提示','后边没有啦~~','error');
            //alert('后边没有啦~~');
            return false;
        }
        nextall.each(function (i, n) {
            var t = $('a:eq(0) span', $(n)).html();
            if (t != _defaultTab)
                $('#tabs').tabs('close', t);
        });
        return false;
    });
    //关闭当前左侧的TAB
    $('#mm-tabcloseleft').click(function () {
        var prevall = $('.tabs-selected').prevAll();
        if (prevall.length == 0) {
            //alert('到头了，前边没有啦~~');
            return false;
        }
        prevall.each(function (i, n) {
            var t = $('a:eq(0) span', $(n)).html();
            if (t != _defaultTab)
                $('#tabs').tabs('close', t);
        });
        return false;
    });

    //全屏
    $("#mm-exit").click(function () {
        if ($.util.supportsFullScreen) {
            if ($.util.isFullScreen()) {
                $.util.cancelFullScreen();
                $(this).find('.menu-text').html('全屏');
            } else {
                $.util.requestFullScreen();
                $(this).find('.menu-text').html('退出全屏');
            }
        } else {
            $.messager.show("当前浏览器不支持全屏 API，请更换至最新的 Chrome/Firefox/Safari 浏览器或通过 F11 快捷键进行操作。");
        }
    });
}