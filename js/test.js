// videojs.options.flash.swf = '/adminlte-2.3.6/plugins/video-js-5.19.2/video-js-fixed.swf';
// videojs.options.techOrder = ['html5', 'flash'];
// var itemHtml = $(".show-list").html();
// $(".show-list").empty();
// var videoHtml = $(".window10").html();
// var onlyVideo = $(".window11").html();
// var players = [];
// var windows = [1, 2, 4, 3];
// $(function () {
//
//     if (!isPC()) {
//         $(".show-type").css("display", "none");
//     }
//     function renderChannel($channel) {
//         var channel = $channel.data("channel");
//         var snap = channel["SnapURL"] || "/images/snap.png";
//         $channel.find("img").attr("src", snap).attr("alt", channel["Name"]);
//         $channel.find(".channel-name").text("[channel"+channel["Channel"]+"]"+channel["Name"]);
//         if (!channel["Online"]) {
//             if (channel["ErrorString"]!="") {
//                 var errorMessage =  "<div class='error-message'>错误码："+channel["ErrorString"]+"</div>";
//             }
//             $channel.find(".thumbnail").append(errorMessage);
//             $channel.addClass("offline");
//             $channel.find(".channel-status-text").text("不在线");
//         } else {
//             $channel.find(".channel-status-text").text("在线");
//             $channel.find(".caption").addClass("text-green");
//         }
//     }
//
//     $.get(_url + "/getchannels?t="+new Date().getTime(), function (data) {
//         try {
//             var ret = JSON.parse(data);
//             if (ret.EasyDarwin.Body.ChannelCount==0) {
//                 $(".cont0").append("<div style='color:#ccc;font-weight:bold;font-size:24px;text-align:center'>当前没有通道，记得配置通道哦！</div>")
//             } else {
//                 ret.EasyDarwin.Body.Channels.sort(function (a, b) {
//                     return parseInt(a["Channel"]) - parseInt(b["Channel"]);
//                 })
//                 $.each(ret.EasyDarwin.Body.Channels, function (i, channel) {
//                     var html = $(".channel-template").html();
//                     var $channel = $(html);
//                     $(".channels").append($channel);
//                     $channel.data("channel", channel);
//                     renderChannel($channel);
//                 })
//                 $.each(ret.EasyDarwin.Body.Channels, function (i, channel) {
//                     var $item = $(itemHtml);
//                     $(".show-list").append($item);
//                     $item.data("channel", channel);
//                     $item.text("-----" + channel.Name).attr({ "alt": channel.Channel, "title": channel.Name });
//                     if (channel.Online == 0) {
//                         $item.css({ "color": "#999", "background": "none" });
//                     } else {
//                         $item.css({ "color": "green" });
//                         $item.mouseover(function () {
//                             $item.css({ "background-color": "#dddddd", "color": "#fff" });
//                         });
//                         $item.mouseout(function () {
//                             $item.css({ "background": "none", "color": "green" });
//                         });
//                     }
//                 })
//             }
//
//         } catch (e) {
//             console.log(e);
//         }
//     })
//     $(".add-list").on("click", function () {
//         var static = $(this).find("img").attr("title");
//         if (static == "展示") {
//             $(this).find("img").attr({ "src": "images/close.png", "title": "收起" });
//             $(".show-list").css("display", "block");
//             $(".video-title").removeClass("col-sm-1").addClass("col-sm-3");
//             $(".video-show").removeClass("col-sm-11").addClass("col-sm-9");
//         } else {
//             $(this).find("img").attr({ "src": "images/show.png", "title": "展示" });
//             $(".show-list").css("display", "none");
//             $(".video-title").removeClass("col-sm-3").addClass("col-sm-1");
//             $(".video-show").removeClass("col-sm-9").addClass("col-sm-11");
//         }
//     })
//     $(document).on("click", ".channel img", function (e) {
//         var $img = $(this);
//         var $channel = $img.closest(".channel");
//         var channel = $channel.data("channel");
//         $("body").mask("加载中...", 100);
//         $.ajax({
//             type: "GET",
//             url: _url + "/getchannelstream",
//             data: {
//                 Channel: channel["Channel"],
//                 Protocol: isPC() ? "RTMP" : "HLS",
//                 Line: "local",
//                 From: "lan"
//             },
//             success: function (data) {
//                 try {
//                     var ret = JSON.parse(data);
//                     var videoUrl = ret.EasyDarwin.Body.URL;
//                     var DeviceType = ret.EasyDarwin.Body.DeviceType;
//                     if (!videoUrl) {
//                         throw new Error('URL is empty');
//                     }
//                     videoUrl = videoUrl.replace("{host}", host);
//                     $.cookie("videoUrl", videoUrl);
//                     $.cookie("DeviceType", DeviceType);
//                     $.cookie("videoImg", $img.attr("src"));
//                     $.cookie("channel", channel["Channel"]);
//                     $.cookie("channelName", channel["Name"]);
//                     if (isIntegrate) {
//                         location.href = "./play.html?isIntegrate=true&channel=" + channel["Channel"];
//                     }else {
//                         top.location.href = "./play.html?channel=" + channel["Channel"];
//                     }
//                     return;
//                 } catch (e) {
//                     $.gritter.add({
//                         text: '获取视频流失败!',
//                         class_name: 'gritter-error'
//                     });
//                     console.log(e);
//                 }
//             },
//             error: function (xhr, ts, err) {
//                 $.gritter.add({
//                     text: '获取视频流失败!',
//                     class_name: 'gritter-error'
//                 });
//             },
//             complete: function () {
//                 $("body").unmask();
//             }
//         });
//     })
// })
// function changeType(type) {
//     $(".show-type").find("i").css("color", "#666");
//     $('.show-content').addClass('hide');
//     if (type == 1) {
//         $(".show-type").find("i:eq(1)").css("color", "#00a65a");
//         $('.cont1').removeClass("hide");
//         $('.cont0').addClass('hide');
//     } else {
//         $(".show-type").find("i:eq(0)").css("color", "#00a65a");
//         $('.cont0').removeClass('hide');
//         windows.length = 0;
//         windows = [1, 2, 3, 4];
//         $.each(players, function (index, item) {
//             clearInterval($("#player" + item).data("timer"));
//             videojs("player" + item).dispose();
//             $(".window" + item).html(onlyVideo);
//         });
//         players.length = 0;
//     }
// }
// function goPlay(mine) {
//     var name = $(mine).html();
//     var channelVal = $(mine).attr('alt');
//     $.ajax({
//         type: "GET",
//         url: _url + "/getchannelstream",
//         data: {
//             Channel: channelVal,
//             Protocol: isPC() ? "RTMP" : "HLS",
//             Line: "local",
//             From: "lan"
//         },
//         success: function (data) {
//             var ret = JSON.parse(data);
//             var videoUrl = ret.EasyDarwin.Body.URL;
//             videoUrl = videoUrl.replace("{host}", host);
//             if (videoUrl == "") {
//                 $.gritter.add("当前通道不在线");
//             } else {
//                 if (windows.length == 0) {
//                     $.gritter.add("当前播放窗口已被占满");
//                 } else {
//                     windows = windows.sort();
//                     var i = windows[0];
//                     $(".window" + i).html("");
//                     $(".window" + i).append(videoHtml);
//                     $(".window" + i).find("video").attr("id", "player" + i);
//                     // $(".window" + i).find("video").append("<source></source>");
//                     if(videoUrl.indexOf("rtmp") == 0){
//                         $(".window" + i).find("video").find("source").attr({"src": videoUrl,"type":"rtmp/mp4"});
//                         // alert($(".window" + i).html())
//                         player = videojs("player" + i, {
//                             notSupportedMessage: '您的浏览器没有安装或开启Flash，戳我开启！',
//                             techOrder: ["flash"],
//                             autoplay: true
//                         });
//                         player.on("error",function(e){
//                             var $e = $("#player"+i+ ".vjs-error .vjs-error-display .vjs-modal-dialog-content");
//                             var $a = $("<a href='http://www.adobe.com/go/getflashplayer' target='_blank'></a>").text($e.text());
//                             $e.empty().append($a);
//                         })
//                         $(".vjs-tech").prop("disabled",true);
//
//                         windows.splice(0, 1);
//                         players.push(i);
//                     }else{
//                         var timeout = 10000;
//                         var step = 500;
//                         var cnt = 0;
//                         function testHls(){
//                             cnt += step;
//                             $.ajax(videoUrl,{
//                                 type : "HEAD",
//                                 global : false,
//                                 complete :function(xhr,ts){
//                                     if(cnt>timeout){
//                                         $(".player-wrapper").unmask();
//                                         $.gritter.add("请求数据失败");
//                                         $(".window" + i).html("<div style='color:#fff;text-align:center;padding-top:25%;font-weight: bold;'>尚无直播视频</div>");
//                                         $('.not-click').addClass("hide");
//                                         return;
//                                     }
//                                     if(xhr.status == 404 || xhr.status == 0){
//                                         console.log("video is no ready, waiting...");
//                                         $(".window" + i).html("<div style='color:#fff;text-align:center;padding-top:25%;font-weight: bold;'>正在准备视频，请稍等...</div>");
//                                         // $.gritter.add("等待视频加载！！！");
//                                         $('.not-click').removeClass("hide");
//                                         setTimeout(testHls,step);
//                                     }else{
//                                         $(".window" + i).html("");
//                                         $(".window" + i).append(videoHtml);
//                                         $(".window" + i).find("video").attr("id", "player" + i);
//                                         // $(".window" + i).find("video").append("<source></source>");
//                                         $('.not-click').addClass("hide");
//                                         $(".window" + i).find("video").find("source").attr("src", videoUrl).attr("type","application/x-mpegURL");
//                                         player = videojs("player" + i,{
//                                             autoplay : true
//                                         });
//                                         $(".vjs-tech").prop("disabled",true);
//
//                                         windows.splice(0, 1);
//                                         players.push(i);
//                                     }
//                                 }
//                             })
//                         }
//                         testHls();
//                     }
//
//                     // nowTimeLive="timerLive"+channelVal;
//                     nowTimeLive = setInterval(function() {
//                         $.get(_url + "/touchchannelstream", {
//                             Channel:channelVal,
//                             Protocol: isPC() ? "RTMP" : "HLS",
//                             Line: "local",
//                             From: "lan"
//                         }, function(data) {
//                             console.log(data);
//                         })
//                     }, 30000);
//                     $("#player"+i).data("timer", nowTimeLive);
//                 }
//             }
//         }
//     })
// }
//
// function closeWin(mine) {
//     var winNum = $(mine).parent().attr("alt");
//     var videoId = $(mine).next().attr("id")
//     clearInterval($("#" + videoId).data("timer"));
//     videojs(videoId).dispose();
//     $(mine).parent().html(onlyVideo);
//     $.each(players, function (index, item) {
//         if (item == winNum) {
//             players.splice(index, 1);
//         }
//     });
//     windows.push(winNum);
// }




var drawSurvey = function () {
    $("#lineSurvey").css("color","red");
    $("#lineLeft").css("color","");
    $("#linePlate").css("color","");
    $("#suZone").css("display","block");
    $("#lineZone").css("display","none");
    $("#plaZone").css("display","none");
    $("#survey").css('visibility', 'visible');
    $("#line").css('visibility', 'hidden');
    $("#plate").css('visibility', 'hidden');
    var flag1 = false;
    var currentX1,currentY1;
    var that1;
    $("#suZone").click(function (e) {
        //
        // alert("draw");
        //     if (flag) {
        //         var x = e.pageX - currentX1;//移动时根据鼠标位置计算控件左上角的绝对位置
        //         var y = e.pageY - currentY1;
        //         $("#"+that1.target.id).css({top: y, left: x});//控件新位置
        //         drawAll('survey','lineSurvey','red');
        //     }
        // }).mouseup(function () {
        //
        // });

    }).mousedown(function (e) {
        let length = document.getElementsByClassName("survey-can").length;
        if(length==20){
            alert("锚点不能超过20个");
            return;
        }
        if(length){
            currentX1 = e.offsetX;
            currentY1 = e.offsetY;
            let suDiv = $('<div></div>');
            suDiv.attr({"class": "mini-box survey-can","id":"su"+(length+1)});
            $("#su"+length).after(suDiv);
            $("#"+suDiv[0].id).css({top:currentY1,left:currentX1});
            drawAll('survey','lineSurvey','red');
            return;
        }else{
            currentX1 = e.offsetX;
            currentY1 = e.offsetY;
            let suDiv = $('<div></div>');
            suDiv.attr({"class": "mini-box survey-can","id":"su1"});
            $("#survey").html(suDiv);
            $("#"+suDiv[0].id).css({top:currentY1,left:currentX1});
            drawAll('survey','lineSurvey','red');
            return;
        }
        flag = true;//移动标记
        that1 = e;

    });

};





var drawLine = function () {
    $("#lineSurvey").css("color","");
    $("#lineLeft").css("color","#00FFFF");
    $("#linePlate").css("color","");
    $("#suZone").css("display","none");
    $("#lineZone").css("display","block");
    $("#plaZone").css("display","none");
    $("#survey").css('visibility', 'hidden');
    $("#line").css('visibility', 'visible');
    $("#plate").css('visibility', 'hidden');
    var checkB = document.getElementsByClassName("checkbox");
    var lineNum = document.getElementsByClassName("lineNum");
    var flag1 = false;
    var currentX1,currentY1;
    var that1;
    $("#lineZone").click(function () {

    }).mousedown(function (e) {
        let length = document.getElementsByClassName("line-can").length;
        if(length===10){
            alert("车道线不能超过5条");
            return;
        }
        var can = 0;
        if(length%2){
            can = (length+1)/2;
            $("#lineSelect").val(can);
        }else{
            can = (length/2+1);
        }
        if(length){
                currentX1 = e.offsetX;
                currentY1 = e.offsetY;
                let lineDiv = $('<div></div>');
                if(length===1){
                    can = 1;
                }
                lineDiv.attr({"class": "mini-box line-can line-can" + can, "id": "line" + (length+1)});
                $("#line"+length).after(lineDiv);
                $("#"+lineDiv[0].id).css({top:currentY1,left:currentX1});
                drawAll('line','lineLeft','#00FFFF');

            if((length+1)>=4&&length%2){
                var che = document.getElementsByClassName("check"+(can-1));
                for(let j = 0;j<4;j++){
                    $(che[j]).attr("disabled",false);
                    $(che[j]).attr("checked",false);
                }
                $(checkB[(can-2)]).removeClass("dis");
                $(lineNum[(can-1)]).removeClass("dis");
            }
        }else{
            currentX1 = e.offsetX;
            currentY1 = e.offsetY;
            let lineDiv = $('<div></div>');
            lineDiv.attr({"class": "mini-box line-can line-can1", "id": "line1"});
            $("#line").html(lineDiv);
            $("#"+lineDiv[0].id).css({top:currentY1,left:currentX1});
            drawAll('line','lineLeft','#00FFFF')
        }
        // flag = true;//移动标记
        // that1 = e;

    });
    // $("#lineZone").mousemove(function (e) {
    //     if (flag1) {
    //         var x = e.pageX - currentX1;//移动时根据鼠标位置计算控件左上角的绝对位置
    //         var y = e.pageY - currentY1;
    //         $("#"+that1.target.id).css({top: y, left: x});//控件新位置
    //         drawAll('line','lineLeft','#00FFFF')
    //     }
    // }).mouseup(function () {
    //
    // });
};

var drawPlate = function () {
    $("#lineSurvey").css("color","");
    $("#lineLeft").css("color","");
    $("#linePlate").css("color","#EE00EE");
    $("#suZone").css("display","none");
    $("#lineZone").css("display","none");
    $("#plaZone").css("display","block");
    $("#survey").css('visibility', 'hidden');
    $("#line").css('visibility', 'hidden');
    $("#plate").css('visibility', 'visible');
    var currentX1,currentY1;
    $("#plaZone").click(function () {

    }).mousedown(function (e) {
        let length = document.getElementsByClassName("plate-can").length;
        if(length===2){
            alert("车牌检测区已存在");
            return;
        }
        if(length){
            currentX1 = e.offsetX;
            currentY1 = e.offsetY;
            let plateDiv = $('<div></div>');
            plateDiv.attr({"class": "mini-box plate-can plate-can" + (length+1), "id": "plate" + (length+1)});
            $("#plate"+length).after(plateDiv);
            $("#"+plateDiv[0].id).css({top:currentY1,left:currentX1});
            drawAll('plate','linePlate','#EE00EE');
        }else{
            currentX1 = e.offsetX;
            currentY1 = e.offsetY;
            let plateDiv = $('<div></div>');
            plateDiv.attr({"class": "mini-box plate-can plate-can1", "id": "plate1"});
            $("#plate").html(plateDiv);
            $("#"+plateDiv[0].id).css({top:currentY1,left:currentX1});
            drawAll('plate','linePlate','#EE00EE');
        }
        // flag = true;//移动标记
        // that1 = e;

    });
};

//
//
// var drawFront = function () {
//     $("#survey").css('visibility', 'hidden');
//     $("#left").css('visibility', 'hidden');
//     $("#right").css('visibility', 'hidden');
//     $("#front").css('visibility', 'visible');
//     $("#back").css('visibility', 'hidden');
//     $("#wait").css('visibility', 'hidden');
//     $("#stop").css('visibility', 'hidden');
//     $("#lineSurvey").css("color","");
//     $("#lineLeft").css("color","");
//     $("#lineRight").css("color","");
//     $("#lineFront").css("color","yellow");
//     $("#lineBack").css("color","");
//     $("#lineWait").css("color","");
//     $("#lineStop").css("color","");
//
//     drawPath();
//     var miniBoxs = document.getElementsByClassName("front-can");
//     var flag = false;
//     var currentX,currentY;
//     var that;
//     $("#drawLine").css("z-index",999);
//     for (let i = 0; i < miniBoxs.length; i++) {
//         $("#"+miniBoxs[i].id).click(function () {
//             flag = false;
//             // $("#survey").css('visibility', 'hidden');
//
//         }).mousedown(function (e) {
//             flag = true;//移动标记
//             that = e;
//             currentX = e.pageX - parseInt($("#"+miniBoxs[i].id).css("left"));
//             currentY = e.pageY - parseInt($("#"+miniBoxs[i].id).css("top"));
//         });
//         $("#drawLine").mousemove(function (e) {
//             if (flag) {
//                 var x = e.pageX - currentX;//移动时根据鼠标位置计算控件左上角的绝对位置
//                 var y = e.pageY - currentY;
//                 $("#"+that.target.id).css({top: y, left: x});//控件新位置
//                 drawPath();
//             }
//         }).mouseup(function () {
//
//         });
//     }
// };
// var drawBack = function () {
//     $("#survey").css('visibility', 'hidden');
//     $("#left").css('visibility', 'hidden');
//     $("#right").css('visibility', 'hidden');
//     $("#front").css('visibility', 'hidden');
//     $("#back").css('visibility', 'visible');
//     $("#wait").css('visibility', 'hidden');
//     $("#stop").css('visibility', 'hidden');
//     $("#lineSurvey").css("color","");
//     $("#lineLeft").css("color","");
//     $("#lineRight").css("color","");
//     $("#lineFront").css("color","");
//     $("#lineBack").css("color","pink");
//     $("#lineWait").css("color","");
//     $("#lineStop").css("color","");
//
//     drawPath();
//     var miniBoxs = document.getElementsByClassName("back-can");
//     var flag = false;
//     var currentX,currentY;
//     var that;
//     $("#drawLine").css("z-index",999);
//     for (let i = 0; i < miniBoxs.length; i++) {
//         $("#"+miniBoxs[i].id).click(function () {
//             flag = false;
//             // $("#survey").css('visibility', 'hidden');
//
//         }).mousedown(function (e) {
//             flag = true;//移动标记
//             that = e;
//             currentX = e.pageX - parseInt($("#"+miniBoxs[i].id).css("left"));
//             currentY = e.pageY - parseInt($("#"+miniBoxs[i].id).css("top"));
//         });
//         $("#drawLine").mousemove(function (e) {
//             if (flag) {
//                 var x = e.pageX - currentX;//移动时根据鼠标位置计算控件左上角的绝对位置
//                 var y = e.pageY - currentY;
//                 $("#"+that.target.id).css({top: y, left: x});//控件新位置
//                 drawPath();
//             }
//         }).mouseup(function () {
//
//         });
//     }
// };
//
// var drawWait = function () {
//     $("#survey").css('visibility', 'hidden');
//     $("#left").css('visibility', 'hidden');
//     $("#right").css('visibility', 'hidden');
//     $("#front").css('visibility', 'hidden');
//     $("#back").css('visibility', 'hidden');
//     $("#wait").css('visibility', 'visible');
//     $("#stop").css('visibility', 'hidden');
//     $("#lineSurvey").css("color","");
//     $("#lineLeft").css("color","");
//     $("#lineRight").css("color","");
//     $("#lineFront").css("color","");
//     $("#lineBack").css("color","");
//     $("#lineWait").css("color","purple");
//     $("#lineStop").css("color","");
//
//     drawPath();
//     var miniBoxs = document.getElementsByClassName("wait-can");
//     var flag = false;
//     var currentX,currentY;
//     var that;
//     $("#drawLine").css("z-index",999);
//     for (let i = 0; i < miniBoxs.length; i++) {
//         $("#"+miniBoxs[i].id).click(function () {
//             flag = false;
//             // $("#survey").css('visibility', 'hidden');
//
//         }).mousedown(function (e) {
//             flag = true;//移动标记
//             that = e;
//             currentX = e.pageX - parseInt($("#"+miniBoxs[i].id).css("left"));
//             currentY = e.pageY - parseInt($("#"+miniBoxs[i].id).css("top"));
//         });
//         $("#drawLine").mousemove(function (e) {
//             if (flag) {
//                 var x = e.pageX - currentX;//移动时根据鼠标位置计算控件左上角的绝对位置
//                 var y = e.pageY - currentY;
//                 $("#"+that.target.id).css({top: y, left: x});//控件新位置
//                 drawPath();
//             }
//         }).mouseup(function () {
//
//         });
//     }
// };
//
// var drawStop = function () {
//     $("#survey").css('visibility', 'hidden');
//     $("#left").css('visibility', 'hidden');
//     $("#right").css('visibility', 'hidden');
//     $("#front").css('visibility', 'hidden');
//     $("#back").css('visibility', 'hidden');
//     $("#wait").css('visibility', 'hidden');
//     $("#stop").css('visibility', 'visible');
//     $("#lineSurvey").css("color","");
//     $("#lineLeft").css("color","");
//     $("#lineRight").css("color","");
//     $("#lineFront").css("color","");
//     $("#lineBack").css("color","");
//     $("#lineWait").css("color","");
//     $("#lineStop").css("color","white");
//
//     drawPath();
//     var miniBoxs = document.getElementsByClassName("stop-can");
//     var flag = false;
//     var currentX,currentY;
//     var that;
//     $("#drawLine").css("z-index",999);
//     for (let i = 0; i < miniBoxs.length; i++) {
//         $("#"+miniBoxs[i].id).click(function () {
//             flag = false;
//             // $("#survey").css('visibility', 'hidden');
//
//         }).mousedown(function (e) {
//             flag = true;//移动标记
//             that = e;
//             currentX = e.pageX - parseInt($("#"+miniBoxs[i].id).css("left"));
//             currentY = e.pageY - parseInt($("#"+miniBoxs[i].id).css("top"));
//         });
//         $("#drawLine").mousemove(function (e) {
//             if (flag) {
//                 var x = e.pageX - currentX;//移动时根据鼠标位置计算控件左上角的绝对位置
//                 var y = e.pageY - currentY;
//                 $("#"+that.target.id).css({top: y, left: x});//控件新位置
//                 drawPath();
//             }
//         }).mouseup(function () {
//
//         });
//     }
// };

// $(document).ready(function(){
//     var flag1 = false;
//     var currentX1,currentY1;
//     var that1;
//     $("#clickZone").click(function () {
//
//     }).mousedown(function (e) {
//         var clickZone = document.getElementById("clickZone");
//         let length = document.getElementsByClassName("survey-can").length;
//         if(length==20){
//             alert("锚点不能超过20个");
//             return;
//         }
//         if(length){
//             currentX1 = e.offsetX;
//             currentY1 = e.offsetY;
//             let suDiv = $('<div></div>');
//             suDiv.attr({"class": "mini-box survey-can","id":"su"+(length+1)});
//             $("#su"+length).after(suDiv);
//             $("#"+suDiv[0].id).css({top:currentY1,left:currentX1});
//             drawAll('survey','lineSurvey','red');
//         }else{
//             currentX1 = e.offsetX;
//             currentY1 = e.offsetY;
//             let suDiv = $('<div></div>');
//             suDiv.attr({"class": "mini-box survey-can","id":"su1"});
//             $("#survey").html(suDiv);
//             $("#"+suDiv[0].id).css({top:currentY1,left:currentX1});
//             drawAll('survey','lineSurvey','red');
//         }
//         // flag = true;//移动标记
//         // that1 = e;
//
//     });
//     $("#clickZone").mousemove(function (e) {
//         if (flag1) {
//             var x = e.pageX - currentX1;//移动时根据鼠标位置计算控件左上角的绝对位置
//             var y = e.pageY - currentY1;
//             $("#"+that1.target.id).css({top: y, left: x});//控件新位置
//             drawAll('survey','lineSurvey','red');
//         }
//     }).mouseup(function () {
//
//     });
// });
$(document).ready(function () {
    $("#lineSelect").change(function () {
        $("#lineZone").css("display","block");
        var lineN = document.getElementsByClassName("line-can").length;
        var options=$("#lineSelect option:selected");
        var optionsNum = options.text();
        var lineDivs = [];
        var lineNum = document.getElementsByClassName("lineNum");
        var checkB = document.getElementsByClassName("checkbox");
        var unSelected = "#999";
        var selected = "#333";
        if(optionsNum>lineN/2){
            let add = 0;
            for(let i = 0;i<(optionsNum-lineN/2);i++){
                for(let j = 1 ;j<3;j++){
                    add++;
                    let lineDiv = $('<div></div>');
                    lineDiv.attr({"class": "mini-box line-can line-can" + (lineN/2+i+1), "id": "line" + (lineN+add)});
                    lineDivs.push(lineDiv);
                }
            }
            for(let i = 0;i<(optionsNum-lineN/2);i++){
                $(lineNum[(lineN/2+i)]).removeClass("dis");
            }
            for(let i = 0;i<(optionsNum-lineN/2);i++){
                var che = document.getElementsByClassName("check"+(lineN/2+i));
                for(let j = 0;j<4;j++){
                    $(che[j]).attr("disabled",false);
                    $(che[j]).attr("checked",false);
                }
                $(checkB[(lineN/2+i-1)]).removeClass("dis");
            }
            if(lineN){
                $("#line"+lineN).after(lineDivs);
                drawAll('line','lineLeft','#00FFFF');
            }else{
                $("#line").html(lineDivs);
                drawAll('line','lineLeft','#00FFFF');
            }

        }else if(optionsNum<lineN/2){
            for(let i = 0;i<lineN/2-optionsNum;i++){
                $(".line-can"+(lineN/2-i)).remove();
                drawAll('line','lineLeft','#00FFFF');
            }
            for(let i = 0;i<(lineN/2-optionsNum);i++){
                $(lineNum[(lineN/2-i-1)]).addClass("dis");
            }
            for(let i = 0;i<(lineN/2-optionsNum);i++){
                var che = document.getElementsByClassName("check"+(lineN/2-i-1));
                for(let j = 0;j<4;j++){
                    $(che[j]).attr("disabled",true);
                    $(che[j]).attr("checked",false);
                }
                $(checkB[(lineN/2-i-2)]).addClass("dis");
            }
        }

        // for(let i = 0;i<lineNum;i++){
        //     for(let j = 0;j<2;j++) {
        //         let lineDiv = $('<div></div>');
        //         lineDiv.attr({"class": "mini-box line-can line-can" + i, "id": "line" + i+j});
        //
        //     }
        // }
        // $("#line").html(lineDivs);
        $("#lineLeft").css("color","#00FFFF");
        $("#line").css('visibility', 'visible');
    });




});


var drawAll = function (id,state,color) {
    // $("#survey").css('visibility', 'hidden');
    // $("#line").css('visibility', 'hidden');
    // $("#plate").css('visibility', 'hidden');
    // // $("#front").css('visibility', 'hidden');
    // // $("#back").css('visibility', 'hidden');
    // // $("#wait").css('visibility', 'hidden');
    // // $("#stop").css('visibility', 'hidden');
    // $("#"+id).css('visibility', 'visible');

    // // $("#lineFront").css("color","");
    // // $("#lineBack").css("color","");
    // // $("#lineWait").css("color","");
    // // $("#lineStop").css("color","");
    $("#"+state).css("color",color);
    drawPath();
    var miniBoxs = document.getElementsByClassName(id+"-can");
    var flag = false;
    var currentX,currentY;
    var that;
    $("#drawLine").css("z-index",999);
    for (let i = 0; i < miniBoxs.length; i++) {
        $("#"+miniBoxs[i].id).click(function () {
            flag = false;
            // $("#survey").css('visibility', 'hidden');

        }).mousedown(function (e) {
            flag = true;//移动标记
            that = e;
            currentX = e.pageX - parseInt($("#"+miniBoxs[i].id).css("left"));
            currentY = e.pageY - parseInt($("#"+miniBoxs[i].id).css("top"));
        });
        $("#drawLine").mousemove(function (e) {
            if (flag) {
                var x = e.pageX - currentX;//移动时根据鼠标位置计算控件左上角的绝对位置
                var y = e.pageY - currentY;
                $("#"+that.target.id).css({top: y, left: x});//控件新位置
                drawPath();
            }
        }).mouseup(function () {

        });
    }
};

var addSu = function () {
    $("#suZone").css("display","block");
    $("#lineZone").css("display","none");
    $("#pleZone").css("display","none");
    $("#survey").css('visibility', 'visible');
    $("#line").css('visibility', 'hidden');
    $("#plate").css('visibility', 'hidden');
    let length = document.getElementsByClassName("survey-can").length;
    if(length === 20){
        $("#addSu").attr("disabled",true);
        return;
    }else{
        $("#addSu").attr("disabled",false);
        $("#reduceSu").attr("disabled",false);
    }
    // length = length+1;
    // var suDivs = [];
    // for(let i = 0;i<length;i++){
    //     let suDiv = $('<div></div>');
    //     suDiv.attr({"class": "mini-box survey-can","id":"su"+i});
    //     $("#"+suDiv[0].id).css({top:i*10,left:i*10});
    //     suDivs.push(suDiv);
    // }
    // $("#survey").html(suDivs);
    let suDiv = $('<div></div>');
    suDiv.attr({"class": "mini-box survey-can","id":"su"+(length+1)});
    $("#"+suDiv[0].id).css({top:10,left:10});
    $("#su"+length).after(suDiv);
    drawAll('survey','lineSurvey','#FF0000');

};
var reduceSu = function () {
    $("#suZone").css("display","block");
    $("#lineZone").css("display","none");
    $("#pleZone").css("display","none");
    $("#survey").css('visibility', 'visible');
    $("#line").css('visibility', 'hidden');
    $("#plate").css('visibility', 'hidden');
    let length = document.getElementsByClassName("survey-can").length;
    if(length === 3){
        $("#reduceSu").attr("disabled",true);
        return;
    }else{
        $("#reduceSu").attr("disabled",false);
        $("#addSu").attr("disabled",false);
    }
    // length = length-1;
    // var suDivs = [];
    // for(let i = 0;i<length;i++){
    //     let suDiv = $('<div></div>');
    //     suDiv.attr({"class": "mini-box survey-can","id":"su"+i});
    //     suDivs.push(suDiv);
    // }
    // $("#survey").html(suDivs);
    $("#su"+length).remove();
    drawAll('survey','lineSurvey','#FF0000');
};
var suPositions = [];
var line = [];
var plate = [];
var drawPath = function () {

    var configCan = document.getElementById("configCan");
    var cctx = configCan.getContext("2d");
    cctx.clearRect(0, 0, 800, 600);

    var bbox = configCan.getBoundingClientRect();

    // var suleftUpY = $("#suLeftUp").offset().top + 4 - bbox.top;
    // var suleftUpX = $("#suLeftUp").offset().left + 4 - bbox.left;
    //
    // var suleftDownY = $("#suLeftDown").offset().top + 4 - bbox.top;
    // var suleftDownX = $("#suLeftDown").offset().left + 4 - bbox.left;
    //
    // var surightUpY = $("#suRightUp").offset().top + 4 - bbox.top;
    // var surightUpX = $("#suRightUp").offset().left + 4 - bbox.left;
    //
    // var surightDownY = $("#suRightDown").offset().top + 4 - bbox.top;
    // var surightDownX = $("#suRightDown").offset().left + 4 - bbox.left;

    var suCan = document.getElementsByClassName("survey-can");
    if(suCan.length){
        suPositions = [];
        for(let i = 0;i<suCan.length;i++){
            let position = {x:0,y:0};
            // position.x = $("#"+suCan[i].id).offset().left + 4 - bbox.left;
            // position.y = $("#"+suCan[i].id).offset().top + 4 - bbox.top;
            position.x = suCan[i].offsetLeft + 4;
            position.y = suCan[i].offsetTop + 4;
            suPositions.push(position);
        }
    }

    var lineCan = document.getElementsByClassName("line-can");
    if(lineCan.length%2===0){
        line = [];
        for(let i = 0;i<lineCan.length/2;i++){
            let linePosition=[];
            for(let j = 0;j<2;j++){
                let position = {x:0,y:0};
                // position.x = $("#"+lineCan[j].id).offset().left + 4 - bbox.left;
                // position.y = $("#"+lineCan[j].id).offset().top + 4 - bbox.top;
                position.x = lineCan[j+i*2].offsetLeft + 4;
                position.y = lineCan[j+i*2].offsetTop + 4;
                linePosition.push(position);
            }
            line.push(linePosition);

        }
    }

    var plateCan = document.getElementsByClassName("plate-can");
    if(plateCan.length===2){
        plate = [];
        for(let i = 0;i<plateCan.length;i++){
            let position = {x:0,y:0};
            // position.x = $("#"+suCan[i].id).offset().left + 4 - bbox.left;
            // position.y = $("#"+suCan[i].id).offset().top + 4 - bbox.top;
            position.x = plateCan[i].offsetLeft + 4;
            position.y = plateCan[i].offsetTop + 4;
            plate.push(position);
        }
    }
    // var leftUpY = $("#leftUp").offset().top + 4 - bbox.top;
    // var leftUpX = $("#leftUp").offset().left + 4 - bbox.left;
    //
    // var leftDownY = $("#leftDown").offset().top + 4 - bbox.top;
    // var leftDownX = $("#leftDown").offset().left + 4 - bbox.left;

    // var rightUpY = $("#rightUp").offset().top + 4 - bbox.top;
    // var rightUpX = $("#rightUp").offset().left + 4 - bbox.left;
    //
    // var rightDownY = $("#rightDown").offset().top + 4 - bbox.top;
    // var rightDownX = $("#rightDown").offset().left + 4 - bbox.left;
    //
    // var frontLeftY = $("#frontLeft").offset().top + 4 - bbox.top;
    // var frontLeftX = $("#frontLeft").offset().left + 4 - bbox.left;
    //
    // var frontRightY = $("#frontRight").offset().top + 4 - bbox.top;
    // var frontRightX = $("#frontRight").offset().left + 4 - bbox.left;
    //
    // var backLeftY = $("#backLeft").offset().top + 4 - bbox.top;
    // var backLeftX = $("#backLeft").offset().left + 4 - bbox.left;
    //
    // var backRightY = $("#backRight").offset().top + 4 - bbox.top;
    // var backRightX = $("#backRight").offset().left + 4 - bbox.left;
    //
    // var waitLeftY = $("#waitLeft").offset().top + 4 - bbox.top;
    // var waitLeftX = $("#waitLeft").offset().left + 4 - bbox.left;
    //
    // var waitRightY = $("#waitRight").offset().top + 4 - bbox.top;
    // var waitRightX = $("#waitRight").offset().left + 4 - bbox.left;
    //
    // var stopLeftY = $("#stopLeft").offset().top + 4 - bbox.top;
    // var stopLeftX = $("#stopLeft").offset().left + 4 - bbox.left;
    //
    // var stopRightY = $("#stopRight").offset().top + 4 - bbox.top;
    // var stopRightX = $("#stopRight").offset().left + 4 - bbox.left;

    if(suPositions.length){
        cctx.beginPath();
        cctx.strokeStyle = "#FF0000";
        cctx.moveTo(suPositions[0].x, suPositions[0].y);
        cctx.font = 'bold 15px SimSun';
        cctx.fillStyle="#FF0000";
        cctx.fillText(1,(suPositions[0].x),(suPositions[0].y));
        for(let i = 1;i<suPositions.length;i++){
            cctx.lineTo(suPositions[i].x, suPositions[i].y);
            cctx.font = 'bold 15px SimSun';
            cctx.fillStyle="#FF0000";
            cctx.fillText((i+1),(suPositions[i].x),(suPositions[i].y));
        }
        cctx.closePath();

        cctx.stroke();
    }



    if(line.length){
        for(let i = 0;i<line.length;i++){
            cctx.beginPath();
            cctx.strokeStyle = "#00FFFF";
            cctx.moveTo(line[i][0].x, line[i][0].y);
            cctx.lineTo(line[i][1].x, line[i][1].y);
            cctx.closePath();
            cctx.font = 'bold 15px SimSun';
            cctx.fillStyle="#00FFFF";
            cctx.fillText((i+1),line[i][0].x,line[i][0].y);
            cctx.stroke();

        }
    }



    if(plate.length){
        cctx.beginPath();
        cctx.strokeStyle = "#EE00EE";
        cctx.moveTo(plate[0].x, plate[0].y);
        cctx.lineTo(plate[0].x, plate[1].y);
        cctx.lineTo(plate[1].x, plate[1].y);
        cctx.lineTo(plate[1].x, plate[0].y);
        cctx.closePath();
        cctx.stroke();

    }
    // cctx.beginPath();
    // cctx.strokeStyle = "#FFFF00";
    // cctx.moveTo(rightUpX, rightUpY);
    // cctx.lineTo(rightDownX, rightDownY);
    // cctx.stroke();
    // cctx.closePath();
    //
    // cctx.beginPath();
    // cctx.strokeStyle = "yellow";
    // cctx.moveTo(frontLeftX, frontLeftY);
    // cctx.lineTo(frontRightX, frontRightY);
    // cctx.stroke();
    // cctx.closePath();
    //
    // cctx.beginPath();
    // cctx.strokeStyle = "pink";
    // cctx.moveTo(backLeftX, backLeftY);
    // cctx.lineTo(backRightX, backRightY);
    // cctx.stroke();
    // cctx.closePath();
    //
    // cctx.beginPath();
    // cctx.strokeStyle = "purple";
    // cctx.moveTo(waitLeftX, waitLeftY);
    // cctx.lineTo(waitRightX, waitRightY);
    // cctx.stroke();
    // cctx.closePath();
    //
    // cctx.beginPath();
    // cctx.strokeStyle = "grey";
    // cctx.moveTo(stopLeftX, stopLeftY);
    // cctx.lineTo(stopRightX, stopRightY);
    // cctx.stroke();
    // cctx.closePath();

};
var updateConfig = function () {
    var p1 = [];
    for(let i = 0;i<line.length;i++){
        let position = {x:0,y:0};
        position.x = line[i][0].x*2;
        position.y = line[i][0].y*2;
        p1.push(position);
    }
    var p2 = [];
    for(let i = 0;i<line.length;i++){
        let position = {x:0,y:0};
        position.x = line[i][1].x*2;
        position.y = line[i][1].y*2;
        p2.push(position);
    }
    var zone_info = [];
    for(let i = 0;i<suPositions.length;i++){
        let position = {x:0,y:0};
        position.x = suPositions[i].x*2;
        position.y = suPositions[i].y*2;
        zone_info.push(position);
    }
    var lrz_info = [];
    for(let i = 0;i<plate.length;i++){
        let position = {x:0,y:0};
        position.x = plate[i].x*2;
        position.y = plate[i].y*2;
        lrz_info.push(position);
    }
    var lane_direction = [];
    var lane_d1 = [];
    var lane_d2 = [];
    var checkB = document.getElementsByClassName("checkbox");
    var lane_d_num = $("#lineSelect").val();
    // for(let i = 1;i<lane_d_num;i++){
    //     $.each($(".check"+i+":checkbox:checked"),function(){
    //         window.alert("你选了："+
    //             $(".check"+i+":checkbox:checked").length+"个，其中有："+$(this).val());
    //     });
    // }
    for(let i = 1;i<lane_d_num;i++){
        var checkV = 0;
        $.each($(".check"+i+":checkbox:checked"),function(){
            checkV = checkV + parseInt($(this).val());
        });
        lane_direction.push(checkV);
    }
    // for(let i = 0 ;i<plate.length;i++){
    //     for(let j = 1;j<plate.length;i++){
    //         if(plate[i].x>plate[j].x||)
    //     }
    // }

    $.ajax({
        type:"POST",
        url:"http://localhost:8088/VWeb/servlet/ConfigUpdateServlet",
        traditional:true,
        data:{
                    "lane_number": line.length,
                    "detect_zone_number": suPositions.length,
                    "lane_direction": JSON.stringify(lane_direction),
                    "lrz_info": JSON.stringify(lrz_info),
                    "lane_p2_info": JSON.stringify(p2),
                    "detect_zone_info": JSON.stringify(zone_info),
                    "lane_p1_info": JSON.stringify(p1),
                    "detect_signal": 0
        },
        dataType:"json",
        success:function (data) {
            console.log("success");
        }
    });
};