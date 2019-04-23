$(function(){
setTabEvent();
ajaxErrorSet();
$(window).bind("unload",function(){try{window.opener.reloadIframe()}catch (e){}});
})
//初始化右侧界面
function initRightPanel(){
        var b1=$("#commentTitle").html()=="";
        if(b1){
            $("#rightP1_1").hide();
            $("#rightP1_2").show();
        }else{
            $("#rightP1_2").hide();
            $("#rightP1_1").show();
        }
    $('#emotion').qqFace({
        assign:'msgEditor', //给输入框赋值
        path:'/creg/allstatics/modules/chat/jQuery-qqFace/arclist/'    //表情图片存放的路径
    });
}
//设置ajax全局错误处理
function ajaxErrorSet(){
    $.ajaxSetup({
        error: function(jqXHR, textStatus, errorThrown){
            window.top.href=basePath;
        }
    });
}
//设置切换tab页时触发
function setTabEvent(){
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e){
        e.target // newly activated tab
        e.relatedTarget // previous active tab
        var domObj = $(e.target);
        //commentTitle
        var b = $(domObj).attr("href2")=="rightP1";
        if(b){
            $("#rightP2").hide();
            $("#rightP1").show();
          var b1=$("#commentTitle").html()=="";
            if(b1){
                $("#rightP1_1").hide();
                $("#rightP1_2").show();
            }else{
                $("#rightP1_2").hide();
                $("#rightP1_1").show();
            }
        }else{
            $("#rightP1").hide();
            $("#rightP2").show();
        }
    })
}
//选择一个聊天窗口
function selectAWin(obj){
    $(obj).addClass("selected-item");
    if(winPre!=null){
        $(winPre).removeClass("selected-item");
    }
    winPre = obj;
    var index = $(obj).attr("data-index");
    nowWinObj = winListObj[index];
    $("#commentTitle").html(nowWinObj.name);
    $("#msgBord").html("");
    $("#rightP1_2").hide();
    $("#rightP1_1").show();
    var limit;
    if(nowWinObj.notRead>parseInt(MSG_LIMIT)){
        limit = nowWinObj.notRead;
    }else{
        limit = parseInt(MSG_LIMIT);
    }
    var render = function(){
        var html = '<span class="list-group-item-icon"><i class="fa fa-comments-o"></i></span>'+nowWinObj.name;
        $(obj).html(html);
    }
    queryWinMsg(limit,nowWinObj.from,nowWinObj.to,nowWinObj.toType,render);

    var html='<span class="list-group-item-icon"><i class="fa fa-comments-o"></i></span>'+nowWinObj.name;
}
//选择一个用户
function selectAUsr(obj){
    $(obj).addClass("selected-item");
    if(usrPre!=null){
        $(usrPre).removeClass("selected-item");
    }
    usrPre = obj;
    var index = $(obj).attr("data-index");
    nowUsrObj = usrListObj[index];
    $("#userChoseDiv").html();
   $("#userTitle").html(nowUsrObj.name);
    $("#nowUsrIcon").hide();
    $("#nowUsrBtn").show();
}
//查询聊天窗口信息；
function queryWinMsg(limit,from,to,toType,callback){
    var queryObj = new Object();
    queryObj.from = from;
    queryObj.to = to;
    queryObj.toType = toType;
    queryObj.limit=limit;
    $("#rightP1_1").hide();
    $.ajax({
        url:basePath+'chat/queryWinMsg.action',
        dataType:'text',
        data:queryObj,
        type:'post',
        success:function(d){
            d = $.parseJSON(d);
            if(d.is){
               var msgs =  d.data;
                if(msgs==null){
                   return;
                }
                var html='';
                for(var i=0;i<msgs.length;i++){
                    var msg_i = msgs[i];
                    if(msg_i.from==parseInt(userid)){
                        html+= '<div class="msgDivAII">';
                        html+= '<div class="msgDivBII">';
                        html+= '<small class="small-date">'+msg_i.sendTime.replace(/-/g,'/')+'</small>';
                        html+= '<small class="small-title">'+msg_i.fromName+'</small>';
                        html+= '<br/>';
                        html+= '<small class="small-text">';
                        html+= msg_i.msg;
                        html+= '</small>';
                        html+= '</div>';
                        html+= '</div>';
                    }else{
                        html+= '<div class="msgDivA">';
                        html+= '<div class="msgDivB">';
                        html+= '<small class="small-date">'+msg_i.sendTime.replace(/-/g,'/')+'</small>';
                        html+= '<small class="small-title">'+msg_i.fromName+'</small>';
                        html+= '<br/>';
                        html+= '<small class="small-text">';
                        html+= msg_i.msg;
                        html+= '</small>';
                        html+= '</div>';
                        html+= '</div>';
                    }
                }
                $("#msgBord").html(html);
                $("#rightP1_1").show();
                window.requestAnimationFrame(function(){ $("body")[0].scrollTop=99999999999});

                callback();
            }
        },
        error:function(d){

        }
    })
}
//点击发送消息触发事件;
function openUsrWin(){
    var obj = $("#usrLis .selected-item")[0];
    if(obj){
        var chatWin = new Object();
        chatWin.from =userid;
        chatWin.toType =TO_TYPE_USR;
        chatWin.name =nowUsrObj.name;
        chatWin.to =nowUsrObj.id;
        chatWin.notRead=0;
        $.ajax({
            url:basePath+'chat/openUserWin.action',
            dataType:'text',
            data:chatWin,
            type:'post',
            success:function(d){
                var d = $.parseJSON(d);
                if(d.is){
                    winListObj = d[WIN_LIST];
                    var html='';
                    for(var i=0;i<winListObj.length;i++){
                        html+='<li class="list-group-item" onclick="selectAWin(this)" id="win'+winListObj[i].ids+'" data-index="'+i+'">';
                        html+='<span class="list-group-item-icon">';
                        if(winListObj[i].toType==TO_TYPE_GRP){
                            html+='<i class="fa fa-comments-o"></i>';
                        }else{
                            html+='<i class="fa fa-comment-o"></i>';
                        }
                        html+='</span>'+winListObj[i].name;
                        if(winListObj[i].notRead!=0){
                            html+='('+winListObj[i].notRead+')';
                        }
                        html+='</li>';
                    }
                    $("#winLis").html(html);
                    //将当前窗口设置为这个新添加的窗口；
                    nowWinObj = d[NOW_WIN];
                    $("#commentTitle").html(nowWinObj.name);
                    $("#msgBord").html("");
                    $("#rightP1_2").hide();
                    $("#rightP1_1").show();
                    var limit;
                    if(nowWinObj.notRead>parseInt(MSG_LIMIT)){
                        limit = nowWinObj.notRead;
                    }else{
                        limit = parseInt(MSG_LIMIT);
                    }
                    var rend = function(){
                        var html = '<span class="list-group-item-icon"><i class="fa fa-comments-o"></i></span>'+nowWinObj.name;
                        $(obj).html(html);
                    }
                    queryWinMsg(limit,nowWinObj.from,nowWinObj.to,nowWinObj.toType,rend);
                    $("#tab1btn").tab('show');
                }
            }
        })
    }
}
//点击发送按钮触发
function send(){
    if($.trim($("#msgEditor").html())==''){
        return;
    }
    if(nowWinObj.toType==TO_TYPE_USR){
        var chatMsg = new Object();
        chatMsg.msg=$("#msgEditor").html();
        chatMsg.from = nowWinObj.from;
        chatMsg.to = nowWinObj.to;
        chatMsg.toType = nowWinObj.toType;
        chatMsg.fromName =userName;
        ws.send(JSON.stringify(chatMsg));
        $("#msgEditor").html("");
    }else {
        //向组发送消息
        var chatMsg = new Object();
        chatMsg.msg=$("#msgEditor").html();
        chatMsg.from = nowWinObj.from;
        chatMsg.to = nowWinObj.to;
        chatMsg.toType = nowWinObj.toType;
        chatMsg.fromName =userName;
        ws.send(JSON.stringify(chatMsg));
        $("#msgEditor").html("");
    }
}
//重置数据库该聊天下的未读消息；
function resetNotRead(chatWin){
    $.ajax({
        url:basePath+'chat/resetNotRead.action',
        dataType:'text',
        data:chatWin,
        type:'post',
        success:function(d){}
    })
}
function insertEM(obj){
    var html = $("#msgEditor").html();
    html+=$(obj).parent().html();
    $("#msgEditor").html(html);
}
//触发文件选择框
function chooseFile(){
    $("#theFile").trigger("click");
}
function uploadFile(){
    //上传文件;
    var file = document.getElementById("theFile").files[0];
    fileName = file.name;
    fileSize = file.size;
    fileType = file.type;
    start = 0;
    limit = 1024*1024;//1M;
    if(nowWinObj.toType==TO_TYPE_USR){
        var chatMsg = new Object();
        chatMsg.from = nowWinObj.from;
        chatMsg.to = nowWinObj.to;
        chatMsg.toType = nowWinObj.toType;
        chatMsg.fromName =userName;
    }else {
        //向组发送消息
        var chatMsg = new Object();
        chatMsg.from = nowWinObj.from;
        chatMsg.to = nowWinObj.to;
        chatMsg.toType = nowWinObj.toType;
        chatMsg.fromName =userName;
    }
    chatMsg[FILE] = new Object();
    chatMsg[FILE].fileName = fileName;
    chatMsg[FILE].fileSize = fileSize;
    chatMsg[FILE].fileType = fileType;
    ws.send(JSON.stringify(chatMsg));
    $("#fd_icon").css("display","none");
}
function uploadFileII(a,b){
        var file = document.getElementById("theFile").files[0];
        ws.send(file.slice(a,b));
}
function tipMsg(){
    try{
        window.parent.msgIn();
    }catch(e){}
}