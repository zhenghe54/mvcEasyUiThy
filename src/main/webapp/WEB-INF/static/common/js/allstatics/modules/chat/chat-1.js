/**
 * Created by ken on 2016-10-13.
 */
var ws = new WebSocket(wsPath);
    ws.onopen = function(evt){
        $("#connectStatus").html("已连接");
    };
    ws.onmessage = function(evt)
    {
        if(!evt.data){
            return;
        }
        var data = $.parseJSON(evt.data);
        if(data[ACT]==ACT_OPEN){
            if(data[WIN_LIST][0].from==userid){
                winListObj = data[WIN_LIST];
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
                if(data[LAST_NOT_READ_WIN]!=null){
                    lastNotReadWinObj = data[LAST_NOT_READ_WIN]
                    for(var i=0;i<winListObj.length;i++){
                        var b = lastNotReadWinObj.from==winListObj[i].from&&lastNotReadWinObj.to==winListObj[i].to&&lastNotReadWinObj.toType==winListObj[i].toType;

                        if(b){
                            var obj = $("#winLis li[data-index='"+i+"']")[0];
                              try{
                                  selectAWin(obj);
                              }catch(e){}
                        }
                    }
                }else{
                    initRightPanel();
                }
            }
            usrListObj = data[USR_LIST];
            var html='';
            for(var i=0;i<usrListObj.length;i++){
                if(usrListObj[i].id==parseInt(userid)){
                    continue;
                }
                html+='<li class="list-group-item"onclick="selectAUsr(this)" id="usr'+usrListObj[i].id+'"data-index="'+i+'">';
                html+='<span class="list-group-item-icon"><i class="fa fa-user"></i></span>'+usrListObj[i].name;
                if(usrListObj[i][ONLINE_TAG]){html+="(在线)"}
                html+= '</li>';
            }
            $('#usrLis').html(html);
        }
        if(data[ACT]==ACT_SEND){
            if(data[NEW_MSG].from==userid){
                //A接到消息的处理方法;
                var chatMsg = data[NEW_MSG];
                var b=chatMsg.from==nowWinObj.from&&chatMsg.to==nowWinObj.to&&chatMsg.toType==nowWinObj.toType;
                var b1=data[FILE]==undefined;
                var b2=data[FILE_UPLOAD_FINISH]==undefined;
                var html=$("#msgBord").html();
                if(b&&b1){
                    html+= '<div class="msgDivAII">';
                    html+= '<div class="msgDivBII">';
                    html+= '<small class="small-date">'+data[NEW_MSG].sendTime.replace(/-/g,'/')+'</small>';
                    html+= '<small class="small-title">'+data[NEW_MSG].fromName+'</small>';
                    html+= '<br/>';
                    html+= '<small class="small-text">';
                    html+= data[NEW_MSG].msg;
                    html+= '</small>';
                    html+= '</div>';
                    html+= '</div>';
                    $("#msgBord").html(html);
                    $("body")[0].scrollTop=99999999999;
                }else{
                    fileId = data[FILE].fileId;
                    if(limit>fileSize){
                        uploadFileII(start,fileSize);
                    }else{
                        uploadFileII(start,limit);
                    }

                }
                if(!b2){
                    $("#progress").html("");
                    $("#fd_icon").css("display","inline-block");
                }
            }else{
                var chatMsg = data[NEW_MSG];
                if(data[HAS_WIN_TAG]==0){
                    alert();
                    html='';
                    winListObj.push(data[NEW_WIN]);
                    html+='<li class="list-group-item" onclick="selectAWin(this)" id="win'+data[NEW_WIN].ids+'" data-index="'+(winListObj.length-1)+'">';
                    html+='<span class="list-group-item-icon">';
                    if(data[NEW_WIN].toType==TO_TYPE_GRP){
                        html+='<i class="fa fa-comments-o"></i>';
                    }else{
                        html+='<i class="fa fa-comment-o"></i>';
                    }
                    html+='</span>'+data[NEW_WIN].name;
                    if(data[NEW_WIN].notRead!=0){
                        html+='('+data[NEW_WIN].notRead+')';
                    }
                    html+='</li>';
                    $("#winLis").html($("#winLis").html()+html);
                    //通知父页面;
                    tipMsg();
                }else{
                    var targetWin=data[TARGET_WIN];
                    var b = false;
                    if(nowWinObj!=null){
                        b = nowWinObj.from==targetWin.from&&nowWinObj.to==targetWin.to&&nowWinObj.toType==targetWin.toType;
                    }
                    if(b){
                        var html=$("#msgBord").html();
                        html+= '<div class="msgDivA">';
                        html+= '<div class="msgDivB">';
                        html+= '<small class="small-date">'+data[NEW_MSG].sendTime.replace(/-/g,'/')+'</small>';
                        html+= '<small class="small-title">'+data[NEW_MSG].fromName+'</small>';
                        html+= '<br/>';
                        html+= '<small class="small-text">';
                        html+= data[NEW_MSG].msg;
                        html+= '</small>';
                        html+= '</div>';
                        html+= '</div>';
                        $("#msgBord").html(html);
                        resetNotRead(nowWinObj);
                    }else{
                        for(var i=0;i<winListObj.length;i++){
                            var win_i = winListObj[i];
                            var b = win_i.from==targetWin.from&&win_i.to==targetWin.to&&win_i.toType==targetWin.toType;
                            if(b){
                                win_i.notRead=win_i.notRead+1;
                                var win_i_dom = $("#winLis li[data-index='"+i+"']")[0];
                                var html="";
                                html+='<span class="list-group-item-icon"><i class="fa fa-comments-o"></i></span>'+winListObj[i].name;
                                if(win_i.notRead!=0){
                                    html+='('+win_i.notRead+')';
                                }
                                $(win_i_dom).html(html);
                                break;
                            }
                        }
                        //向父页面发消息;
                        tipMsg();
                    }
                }
            }
        }
        if(data[ACT]==ACT_CLOSE){
            usrListObj = data[USR_LIST];
            var html='';
            for(var i=0;i<usrListObj.length;i++){
                if(usrListObj[i].id==parseInt(userid)){
                    continue;
                }
                html+='<li class="list-group-item"onclick="selectAUsr(this)" id="usr'+usrListObj[i].id+'"data-index="'+i+'">';
                html+='<span class="list-group-item-icon"><i class="fa fa-user"></i></span>'+usrListObj[i].name;
                if(usrListObj[i][ONLINE_TAG]){html+="(在线)"}
                html+= '</li>';
            }
            $('#usrLis').html(html);
        }
        if(data[ACT]==ACT_UPLOAD){
            if(data.is==1){
                start=start+limit;
                var progress = 0;
                if(start>=fileSize){
                    progress==100;
                    $("#progress").html("99%");
                    var chatMsg = new Object();
                    if(nowWinObj.toType==TO_TYPE_USR){
                        chatMsg.msg="<a href="+basePath+"'chat/download.action?fileId="+fileId+"'>"+fileName+"</a>";
                        chatMsg.from = nowWinObj.from;
                        chatMsg.to = nowWinObj.to;
                        chatMsg.toType = nowWinObj.toType;
                        chatMsg.fromName =userName;
                        chatMsg.fileId = fileId;
                    }else {
                        //向组发送消息
                        var chatMsg = new Object();
                        chatMsg.msg="<a href="+basePath+"'chat/download.action?fileId="+fileId+"'>"+fileName+"</a>";
                        chatMsg.from = nowWinObj.from;
                        chatMsg.to = nowWinObj.to;
                        chatMsg.toType = nowWinObj.toType;
                        chatMsg.fromName =userName;
                        chatMsg.fileId = fileId;
                    }
                    ws.send(JSON.stringify(chatMsg));
                }else{
                    progress = parseInt(start/fileSize*100);
                    $("#progress").html(progress+"%");
                    if((start+limit)>fileSize){
                        uploadFileII(start,fileSize);
                    }else{
                        uploadFileII(start,start+limit);
                    }
                }
            }else{
                $("#progress").html("文件上传失败");
                window.setTimeout(function(){$("#progress").html("")},1000);
            }
        }
    };
    ws.onclose = function(evt)
    {
        $("#connectStatus").html("断开");
    };
    ws.onerror = function(evt)
    {
        console.log("链接异常");
    };
