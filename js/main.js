window.onload = function () {

    $('#urlTable').bootstrapTable({
        url: 'http://192.168.1.207:8088/RTSP/servlet/SelectUrlServlet',
        method: "get",
        toolbar:"#toolbar",
        editable: true,
        striped: true,
        clickToSelect: true,
        cache: false,
        columns: [{
            field: 'channel',
            title: '通道ID'
        }, {
            field: 'name',
            title: '通道名',
            editable: {
                type: 'text',
                title: '通道名',
            }
        }, {
            field: 'url',
            title: 'URL',
            editable: {
                type: 'text',
                title: 'URL',
            }
        }, {
            field: "channel",
            title: "Action",
            align: "center",
            formatter: function (value, row, index) {
                var strHtml =
                '<a  href="javascript:void(0);" onclick="removeChannel('+value+')"  style="margin-left:5px;"><li class="glyphicon glyphicon-remove"></li></a>';
                return strHtml;
            }, edit: false
        }],
        onEditableSave: function (field, row, oldValue, $el) {
            let newUrl = row.url;
            if(newUrl==""){
                //var insertHtml='<span id="uMessage"></span>';
                //$('.').find('p').eq(1).after(insertHtml);
                alert("输入不能为空");
                $("#urlTable").bootstrapTable('refresh');
                return false;
            }else if(!/rtsp:\/\/\w+/.test(newUrl)){
                // $(".editable-clear-x").addClass("warning");
                //                 // $(".editable-clear-x").html("地址格式无法解析");
                alert("地址格式无法解析");
                $("#urlTable").bootstrapTable('refresh');
                return false;
            }
            $.ajax({
                type: "post",
                url: "http://192.168.1.207:8088/RTSP/servlet/UrlUpdateServlet",
                data: row,
                dataType: 'JSON',
                success: function (data, status) {
                    if (status == "success") {
                        alert(data.info);
                        $("#urlTable").bootstrapTable('refresh');
                    }
                },
                error: function () {
                    alert('编辑失败');
                },
                complete: function () {

                }

            });

        }
    });
    $("#showList").on("click", function () {
        var flag = $(this).find("span").attr("title");
        if (flag === "展示") {
            $(this).find("span").attr({"class": "glyphicon glyphicon-minus", "title": "收起"});
            $("#list").css("display", "block");
        } else {
            $(this).find("span").attr({"class": "glyphicon glyphicon-plus", "title": "展示"});
            $("#list").css("display", "none");
        }
    });
    // var configCan = document.getElementById("configCan");
    // var cctx = configCan.getContext("2d");
    // var testImg = document.createElement("img");
    //
    // testImg.onload = ()=>{
    //     cctx.drawImage(testImg,0,0,800,600);
    // }
    // testImg.src = "img/user.jpg";

};

function removeChannel(channel) {
    $.ajax({
        type: "POST",
        url: "http://192.168.1.207:8088/RTSP/servlet/UrlDeleteServlet",
        data: {"channel": channel},
        success: function (data) {
            $("#urlTable").bootstrapTable('refresh');
            alert(data.info);
        }
    });

}


function getFileName(file){//通过第一种方式获取文件名
    var pos=file.lastIndexOf("\\");//查找最后一个\的位置
    return file.substring(pos+1); //截取最后一个\位置到字符长度，也就是截取文件名
}


function uploadFile(){
    var file = $("#localFile").val();
    var channelNum = $("#channelNum").val();
    var fileName = getFileName(file);

    if(channelNum ==""){
        $("#numMessage").addClass("warning");
        $("#numMessage").html("通道ID不能为空");
        return false;
    }else if(fileName == ""){
        $("#upMessage").addClass("warning");
        $("#upMessage").html("未选择文件！");
        return false;
    } else{
        $('#uploadForm span').html('');
        $.ajax({
            type: "POST",
            url: "http://192.168.1.207:8088/RTSP/servlet/UrlSelectChannelServlet",
            data: {
                "channel": channelNum,
            },
            success: function (data) {
                if (data.result==="false") {
                    $("#numMessage").addClass("warning");
                    $("#numMessage").html("通道不存在");
                    return false;
                }else{
                    //返回String对象中子字符串最后出现的位置.
                    var seat=fileName.lastIndexOf(".");
                    //返回位于String对象中指定位置的子字符串并转换为小写.
                    var extension=fileName.substring(seat).toLowerCase();
                    if(extension==".mp4"){
                        var submitURL="http://192.168.1.207:8088/RTSP/servlet/SaveVideoServlet";
                        var options={
                            url: submitURL,
                            type: "post",
                            //beforeSubmit:
                            data:{
                                channelNum:channelNum
                            },
                            processData: false,
                            contentType: "application/x-www-form-urlencoded; charset=utf-8",
                            dataType:"json",
                            success: function (data) {
                                $("#upModal").modal("hide");
                                $("#urlTable").bootstrapTable('refresh');
                                alert("上传成功");

                            }
                        };
                        $("#uploadForm").ajaxSubmit(options);
                    }else{
                        $("#numMessage").addClass("warning");
                        $("#numMessage").html("不支持"+extension+"格式");
                        $("#localFile").val("");
                        return false;
                    }
                }
            }
        });
    }


}
// //上传文件以及验证
// function uploadFile(){
//     let channelNum = $("#channelNum").val();
//     var file = $("#localFile").val();
//     var fileName = getFileName(file);
//     alert(file+fileName);
//
//     if(fileName == ""){
//         $("#upMessage").addClass("warning");
//         $("#upMessage").html("未选择文件！");
//     }
//     //返回String对象中子字符串最后出现的位置.
//     var seat=fileName.lastIndexOf(".");
//     //返回位于String对象中指定位置的子字符串并转换为小写.
//     var extension=fileName.substring(seat).toLowerCase();
//     if(extension==".mp4"){
//         var submitURL="http://192.168.1.207:8088/RTSP/servlet/SaveVideoServlet";
//         var options={
//             url: submitURL,
//             type: "post",
//             processData: false,
//             contentType: "application/x-www-form-urlencoded; charset=utf-8",
//             dataType:"json",
//             success: function (data) {
//                 $('#upModal').modal('hide');
//                 $('#modalBody').html("上传成功"+data.filepath);
//                 $('#modal').modal('show');
//             }
//         }
//         $("#upForm").ajaxSubmit(options);
//         alert("-----");
//     }else{
//         $("#upMessage").addClass("warning");
//         $("#upMessage").html("不支持"+extension+"格式！");
//         $("#localFile").val("");
//         return false;
//     }
//
// }

function addChannel() {
    let channel_num=$("#channel_num").val();
    let channel_name=$("#channel_name").val();
    let channel_url=$("#channel_url").val();
    if(channel_num==""){
        $("#channelMessage").addClass("warning");
        $("#channelMessage").html("输入不能为空");
        return false;
    }else if(!/^\d+$/.test(channel_num)){
        $("#channelMessage").addClass("warning");
        $("#channelMessage").html("请输入数字");
        return false;
    }else if(channel_name==""){
        $("#nameMessage").addClass("warning");
        $("#nameMessage").html("输入不能为空");
        return false;
    }else if(channel_url==""){
        $("#urlMessage").addClass("warning");
        $("#urlMessage").html("输入不能为空");
        return false;
    }else if(!/rtsp:\/\/\w+/.test(channel_url)){
        $("#urlMessage").addClass("warning");
        $("#urlMessage").html("地址格式无法解析");
        return false;
    }
    else {
        $.ajax({
            type: "POST",
            url: "http://192.168.1.207:8088/RTSP/servlet/UrlSelectChannelServlet",
            data: {
                "channel": channel_num,
            },
            success: function (data) {
                if (data.result==="true") {
                    $("#channelMessage").addClass("warning");
                    $("#channelMessage").html(data.info);
                    return false;
                }else{
                    $("#channelMessage").html("");
                    $.ajax({
                        type: "POST",
                        url: "http://192.168.1.207:8088/RTSP/servlet/UrlInsertServlet",
                        data: {
                            "channel_num": channel_num,
                            "channel_name":channel_name,
                            "channel_url":channel_url
                        },
                        success: function (data) {
                            $('#myModal').modal('hide');
                            $("#urlTable").bootstrapTable('refresh');
                            alert(data.info);
                        }
                    });
                }
            }
        });
    }


}

var windowsNum = [];
var fourView = function () {
    $("#tableInfo").bootstrapTable('removeAll');
    if(websocket){
        websocket.close();
        websocket = null;
    }
    if(document.getElementById("example-video_1")!=null){
        clearInterval($("#example-video_1").data("timer"));
        videojs("example-video_1").dispose();
    }
    var fourV = "<div class=\"col-md-6 col-lg-6\">\n" +
    "                <div class=\"video-window windows_1\" alt=\"1\">\n" +
    "                    <div style=\"color:#fff;text-align:center;padding-top:25%;font-weight: bold;\">还没有添加视频哦</div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6 col-lg-6\">\n" +
    "                <div class=\"video-window windows_2\" alt=\"2\">\n" +
    "                    <div style=\"color:#fff;text-align:center;padding-top:25%;font-weight: bold;\">还没有添加视频哦</div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6 col-lg-6\">\n" +
    "                <div class=\"video-window windows_3\" alt=\"3\">\n" +
    "                    <div style=\"color:#fff;text-align:center;padding-top:25%;font-weight: bold;\">还没有添加视频哦</div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6 col-lg-6\">\n" +
    "                <div class=\"video-window windows_4\" alt=\"4\">\n" +
    "                    <div style=\"color:#fff;text-align:center;padding-top:25%;font-weight: bold;\">还没有添加视频哦</div>\n" +
    "                </div>\n" +
    "            </div>";
    $(".video-detail").css("margin-bottom","10px");
    $("#playArea").html(fourV);
    windowsNum= [1,2,3,4];
    $("#one").removeClass("btn-primary");
    $("#one").addClass("btn-default");
    $("#four").removeClass("btn-default");
    $("#four").addClass("btn-primary");
    flag = true;
};
function sortNumber(a,b)
{
    return a - b
}
function closeW(mine) {
    flag = true;
    var winNum = $(mine).parent().attr("alt");
    var videoId = $(mine).next().attr("id");
    clearInterval($("#" + videoId).data("timer"));
    videojs(videoId).dispose();
    $(".windows_"+winNum).html("<div style=\"color:#fff;text-align:center;padding-top:25%;font-weight: bold;\">还没有添加视频哦</div>");
    if(windowsNum.length>2){
        windowsNum.sort(sortNumber);
    }
    var videos = document.getElementsByTagName("video");
    var position=0;
    for(let i=0;i<windowsNum.length;i++){
        if(winNum>windowsNum[i]){
            position=i+1;
        }else{
            position=i;
            break;
        }
    }
    windowsNum.splice(position,0,winNum);
    if(videos.length<1){
        websocket.close();
        websocket = null;
    }
    
}
var websocket = null;
var flag = true;
function play(channel){
    var size = $(".video-window").size();
    if(size ===1){

        if (!flag) {
            alert("当前只能播放一个窗口哦！");
        }else{
            flag = false;
            loadData();
            $(".windows_1").html("<div onclick='closeW(this)' class='video_close'>关闭</div><video id=example-video_1 class=\"video-js vjs-default-skin video-size\" controls>\n" +
                "                                <source\n" +
                "                                        src=\"/hls/ch0"+channel+"/hls.m3u8\"\n" +
                "                                        type=\"application/x-mpegURL\">\n" +
                "                            </video>");
            var myPlayer = videojs('example-video_1',{
                bigPlayButton : true,
                textTrackDisplay : false,
                posterImage: true,
                errorDisplay : false,
                autoplay: true,
                controlBar : true
            },function(){
                this.on('loadedmetadata',function(){
                    console.log('loadedmetadata');
                    //加载到元数据后开始播放视频
                    $('.vjs-live-display').remove();


                    if ('WebSocket' in window) {
                            //建立连接，这里的/websocket ，是Servlet中开头注解中的那个值
                            if(websocket===null){
                             websocket = new WebSocket("ws://192.168.1.207:8088/RTSP/websocket");
                         }
                            console.log(websocket);
                            
                        }
                        else {
                            alert('当前浏览器 Not support websocket');
                        }
                        //连接发生错误的回调方法
                        websocket.onerror = function () {
                            console.log("WebSocket连接发生错误");
                        };
                        //连接成功建立的回调方法
                        websocket.onopen = function () {
                            console.log("WebSocket连接成功");
                        };
                        //接收到消息的回调方法
                        websocket.onmessage = function (event) {
                            console.log(event.data);
                            if(event.data=="1"){
                                console.log("数据更新啦");
                                $("#car_table").bootstrapTable('refresh');
                            }
                        };
                        //连接关闭的回调方法
                        websocket.onclose = function () {
                            console.log("WebSocket连接关闭");
                        };
                        //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
                        window.onbeforeunload = function () {
                            closeWebSocket();
                        };
                        //关闭WebSocket连接
                        var closeWS = function () {
                            websocket.close();
                        }





                    startVideo();


                });

                this.on('ended',function(){
                    console.log('ended')
                });
                this.on('firstplay',function(){
                    console.log('firstplay')
                });
                this.on('loadstart',function(){
                    //开始加载
                    console.log('loadstart')
                });
                this.on('loadeddata',function(){
                    console.log('loadeddata')
                });
                this.on('seeking',function(){
                    //正在去拿视频流的路上
                    console.log('seeking')
                });
                this.on('seeked',function(){
                    //已经拿到视频流,可以播放
                    console.log('seeked')
                });
                this.on('waiting',function(){
                    console.log('waiting')
                });
                this.on('pause',function(){
                    console.log('pause')
                });
                this.on('play',function(){
                    console.log('play')
                })

            });

            var isVideoBreak;
            function startVideo() {

                $('.vjs-styles-defaults').remove();
                $('.vjs-styles-dimensions').remove();

                myPlayer.play();

                //微信内全屏支持
                //document.getElementById('example-video').style.width = window.screen.width + "px";
                //document.getElementById('example-video').style.height = window.screen.height + "px";


                //判断开始播放视频，移除高斯模糊等待层
                var isVideoPlaying = setInterval(function(){
                    var currentTime = myPlayer.currentTime();
                    if(currentTime > 0){
                        $('.vjs-poster').remove();
                        clearInterval(isVideoPlaying);
                    }
                },200);

                // //判断视频是否卡住，卡主3s重新load视频
                // var lastTime = -1,
                //     tryTimes = 0;
                //
                // clearInterval(isVideoBreak);
                // isVideoBreak = setInterval(function(){
                //     var currentTime = myPlayer.currentTime();
                //     console.log('currentTime'+currentTime+'lastTime'+lastTime);
                //
                //     if(currentTime == lastTime){
                //         //此时视频已卡主3s
                //         //设置当前播放时间为超时时间，此时videojs会在play()后把currentTime设置为0
                //         myPlayer.currentTime(currentTime+10000);
                //         myPlayer.play();
                //
                //         //尝试5次播放后，如仍未播放成功提示刷新
                //         if(++tryTimes > 5){
                //             alert('您的网速有点慢，刷新下试试');
                //             tryTimes = 0;
                //         }
                //     }else{
                //         lastTime = currentTime;
                //         tryTimes = 0;
                //     }
                // },3000)

            }
        }
    }else {

        if (windowsNum.length === 0) {
            alert("当前播放窗口已被占满");
        } else {
            loadData();
            var i = windowsNum.splice(0, 1);
            $(".windows_" + i).html("<div onclick='closeW(this)' class='video_close'>关闭</div><video id=example-video_" + i + " class=\"video-js vjs-default-skin video-size\" controls>\n" +
                "                                <source\n" +
                "                                        src=\"/hls/ch0"+channel+"/hls.m3u8\"\n" +
                "                                        type=\"application/x-mpegURL\">\n" +
                "                            </video>");
            var myPlayer = videojs('example-video_' + i, {
                bigPlayButton: true,
                textTrackDisplay: false,
                posterImage: true,
                errorDisplay: false,
                autoplay: true,
                controlBar: true
            }, function () {
                this.on('loadedmetadata', function () {
                    console.log('loadedmetadata');
                    //加载到元数据后开始播放视频
                    $('.vjs-live-display').remove();


                    if ('WebSocket' in window) {
                            //建立连接，这里的/websocket ，是Servlet中开头注解中的那个值
                            if(websocket===null){
                             websocket = new WebSocket("ws://192.168.1.207:8088/RTSP/websocket");
                         }
                            console.log(websocket);
                            
                        }
                        else {
                            alert('当前浏览器 Not support websocket');
                        }
                        //连接发生错误的回调方法
                        websocket.onerror = function () {
                            console.log("WebSocket连接发生错误");
                        };
                        //连接成功建立的回调方法
                        websocket.onopen = function () {
                            console.log("WebSocket连接成功");
                        };
                        //接收到消息的回调方法
                        websocket.onmessage = function (event) {
                            console.log(event.data);
                            if(event.data=="1"){
                                console.log("数据更新啦");
                                $("#car_table").bootstrapTable('refresh');
                            }
                        };
                        //连接关闭的回调方法
                        websocket.onclose = function () {
                            console.log("WebSocket连接关闭");
                        };
                        //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
                        window.onbeforeunload = function () {
                            closeWebSocket();
                        };
                        //关闭WebSocket连接
                        var closeWS = function () {
                            websocket.close();
                        }

                    startVideo();


                });

                this.on('ended', function () {
                    console.log('ended')
                });
                this.on('firstplay', function () {
                    console.log('firstplay')
                });
                this.on('loadstart', function () {
                    //开始加载
                    console.log('loadstart')
                });
                this.on('loadeddata', function () {
                    console.log('loadeddata')
                });
                this.on('seeking', function () {
                    //正在去拿视频流的路上
                    console.log('seeking')
                });
                this.on('seeked', function () {
                    //已经拿到视频流,可以播放
                    console.log('seeked')
                });
                this.on('waiting', function () {
                    console.log('waiting')
                });
                this.on('pause', function () {
                    console.log('pause')
                });
                this.on('play', function () {
                    console.log('play')
                })

            });

            var isVideoBreak;

            function startVideo() {

                $('.vjs-styles-defaults').remove();
                $('.vjs-styles-dimensions').remove();

                myPlayer.play();

                //微信内全屏支持
                //document.getElementById('example-video').style.width = window.screen.width + "px";
                //document.getElementById('example-video').style.height = window.screen.height + "px";


                //判断开始播放视频，移除高斯模糊等待层
                var isVideoPlaying = setInterval(function () {
                    var currentTime = myPlayer.currentTime();
                    if (currentTime > 0) {
                        $('.vjs-poster').remove();
                        clearInterval(isVideoPlaying);
                    }
                }, 200);

                // //判断视频是否卡住，卡主3s重新load视频
                // var lastTime = -1,
                //     tryTimes = 0;
                //
                // clearInterval(isVideoBreak);
                // isVideoBreak = setInterval(function(){
                //     var currentTime = myPlayer.currentTime();
                //     console.log('currentTime'+currentTime+'lastTime'+lastTime);
                //
                //     if(currentTime == lastTime){
                //         //此时视频已卡主3s
                //         //设置当前播放时间为超时时间，此时videojs会在play()后把currentTime设置为0
                //         myPlayer.currentTime(currentTime+10000);
                //         myPlayer.play();
                //
                //         //尝试5次播放后，如仍未播放成功提示刷新
                //         if(++tryTimes > 5){
                //             alert('您的网速有点慢，刷新下试试');
                //             tryTimes = 0;
                //         }
                //     }else{
                //         lastTime = currentTime;
                //         tryTimes = 0;
                //     }
                // },3000)

            }
        }
    }
}
function loadData(){
    $("#car_table").bootstrapTable({
        url: 'http://192.168.1.207:8088/RTSP/servlet/VideoInfoServlet',
        method: "get",
        striped: true,
        cache: false,
        height:300,
        columns: [{
            field: 'c_id',
            title: '通道ID',
            width:200,
        }, {
            field: 'c_id',
            title: '通道ID',
            visible: false

        }, {
            field: 'c_cphm',
            title: '车牌号码',
            width:300,
        }, {
            field: "c_car_chexing",
            title: "车型",
            align: "center",
        }],
        onDblClickRow: function (row) {
            if (row){
                $.ajax({
                    type: "POST",
                    url: "http://192.168.1.207:8088/RTSP/servlet/FindByIdServlet",
                    data: {"c_id":row.c_id},
                    success: function(data){
                        this.data = data;
                        var multiple = 4;
                        var x=0;
                        var y=0;
                        var c=document.getElementById("can");
                        var ctx=c.getContext("2d");
                                var bigImg = document.createElement("img");     //创建一个img元素
                                bigImg.src="/img/" + data.c_img_path;   //给img元素的src属性赋值
                                cDraw(0,0,data,multiple);
                                var $trTemp = $("<tr></tr>");
                                 //往行里面追加 td单元格
                                 $trTemp.append("<td>"+ data.c_cphm +"</td>");
                                 $trTemp.append("<td>"+ data.c_car_color +"</td>");
                                 $trTemp.append("<td>"+ data.c_car_brand +"</td>");
                                 $trTemp.append("<td>"+ data.c_car_chexing +"</td>");
                                // $("#J_TbData").append($trTemp);
                                $trTemp.appendTo("#J_TbData");
                                function getLocation(x, y) {
                                    var bbox = c.getBoundingClientRect();
                                    return {
                                        x: (x - bbox.left) * (c.width / bbox.width),
                                        y: (y - bbox.top) * (c.height / bbox.height)
                                    };
                                }
                                var mc=document.getElementById("magCanvas");
                                var mctx = mc.getContext("2d");
                                mc.style.display = "none";
                                //存储未绘制状态
                                ctx.save();
                                c.onmouseout = function(){
                                    mc.style.display = "none";
                                }
                                c.onmousemove = function (e) {
                                    mc.style.display = "block";
                                    mctx.clearRect(0,0,250,300);
                                    // 图片被放大区域的中心点，也是放大镜的中心点
                                    var location = getLocation(e.clientX, e.clientY);
                                    var centerPoint = {x:location.x,y:location.y};
                                    // 图片被放大区域的半径
                                    var originalRadius = 200;
                                    var biggerImg = document.createElement("img");     //创建一个img元素
                                    biggerImg.src="/img/" + data.c_img_path;   //给img元素的src属性赋值
                                    mctx.drawImage(biggerImg,
                                        centerPoint.x*4-50, centerPoint.y*4-50,
                                        originalRadius, originalRadius,
                                        0, 0,
                                        originalRadius, originalRadius
                                        );
                                    if(data.c_drop_num){
                                        pRects(centerPoint.x*4,centerPoint.y*4,mctx,data.c_drop_info,data.c_drop_num,"#FFFF00","挂饰",1);
                                    }
                                    if(data.c_platenum){
                                        pRects(centerPoint.x*4,centerPoint.y*4,mctx,data.c_plateinfo,data.c_platenum,"#ff0000","车牌",1);
                                    }
                                    if(data.c_tissbox_num){
                                        pRects(centerPoint.x*4,centerPoint.y*4,mctx,data.c_tissbox_info,data.c_tissbox_num,"#4EEE94","纸巾盒",1);
                                    }
                                    if(data.c_lamp_num){
                                        pRects(centerPoint.x*4,centerPoint.y*4,mctx,data.c_lamp_info,data.c_lamp_num,"#e287b0","大灯",1);
                                    }
                                    if(data.c_mirror_num){
                                        pRects(centerPoint.x*4,centerPoint.y*4,mctx,data.c_mirror_info,data.c_mirror_num,"#00B2EE","后视镜",1);
                                    }
                                    if(data.c_sunvisor_num){
                                        pRects(centerPoint.x*4,centerPoint.y*4,mctx,data.c_sunvisor_info,data.c_sunvisor_num,"#00FF00","遮阳板",1);
                                    }
                                    if(data.c_dangersign_num){
                                        pRects(centerPoint.x*4,centerPoint.y*4,mctx,data.c_dangersign_info,data.c_dangersign_num,"#637acd","危险品",1);
                                    }
                                    if(data.c_callphone_num){
                                        pRects(centerPoint.x*4,centerPoint.y*4,mctx,data.c_callphone_info,data.c_callphone_num,"#CD00CD","打手机",1);
                                    }
                                    if(data.c_sparetire_num){
                                        pRects(centerPoint.x*4,centerPoint.y*4,mctx,data.c_sparetire_info,data.c_sparetire_num,"#66CD00","备胎",1);
                                    }
                                    if(data.c_anninsp_num){
                                        pRects(centerPoint.x*4,centerPoint.y*4,mctx,data.c_anninsp_info,data.c_anninsp_num,"#00FFFF","年检标",1);
                                    }
                                    if(data.c_decoritem_num){
                                        pRects(centerPoint.x*4,centerPoint.y*4,mctx,data.c_decoritem_info,data.c_decoritem_num,"#8B3626","摆件",1);
                                    }
                                    if(data.c_roofrack_num){
                                        pRects(centerPoint.x*4,centerPoint.y*4,mctx,data.c_roofrack_info,data.c_roofrack_num,"#B0E2FF","行李架",1);
                                    }
                                    if(data.c_skylight_num){
                                        pRects(centerPoint.x*4,centerPoint.y*4,mctx,data.c_skylight_info,data.c_skylight_num,"#EE9A00","天窗",1);
                                    }
                                    if(data.c_passenger_num){
                                        pRects(centerPoint.x*4,centerPoint.y*4,mctx,data.c_passenger_info,data.c_passenger_num,"#008B00","乘客",1);
                                    }
                                    console.log("img-onload")
                                    mc.style.left = centerPoint.x +"px";
                                    mc.style.top = centerPoint.y + "px";
                                };
                            }
                        });
$('#myModal').modal('show');
}
}
})
};


var oneView = function () {
    $("#tableInfo").bootstrapTable('removeAll');
    if(websocket){
        websocket.close();
        websocket = null;
    }
    
    if(document.getElementById("example-video_1")!=null){
        clearInterval($("#example-video_1").data("timer"));
        videojs("example-video_1").dispose();
    }
    if(document.getElementById("example-video_2")!=null){
        clearInterval($("#example-video_2").data("timer"));
        videojs("example-video_2").dispose();
    }
    if(document.getElementById("example-video_3")!=null){
        clearInterval($("#example-video_3").data("timer"));
        videojs("example-video_3").dispose();
    }
    if(document.getElementById("example-video_4")!=null){
        clearInterval($("#example-video_4").data("timer"));
        videojs("example-video_4").dispose();
    }
    var view = "<div class=\"col-md-12 col-lg-12\">\n" +
    "                <div class=\"video-window windows_1\" alt=\"1\">\n" +
    "                    <div style=\"color:#fff;text-align:center;padding-top:25%;font-weight: bold;\">还没有添加视频哦</div>\n" +
    "                </div>\n" +
    "            </div>";
    $("#playArea").html(view);
    windowsNum = [1];
    $(".video-detail").css("margin-bottom","");
    $("#four").removeClass("btn-primary");
    $("#four").addClass("btn-default");
    $("#one").removeClass("btn-default");
    $("#one").addClass("btn-primary");
};

var menuDown = function () {
    var show = $('.menu-down ul').css('display');
    $(".menu-down ul").css("display",show ==="block" ?"none":"block");
};

$(function () {
    $(".menu-down").on("click",function(){
        var show = $('.menu-down ul').css('display');
        $(".menu-down ul").css("display",show ==="block" ?"none":"block");
    });
    $('#myModal').on('hidden.bs.modal', function (e) {
        x=0;
        y=0;
        multiple = 4;
        $(".modal-body img").remove();
        $("#carInfo td").remove();
        $("#moveLeft").off("click");
        $("#moveRight").off("click");
        $("#moveUp").off("click");
        $("#moveDown").off("click");
        $("#zoomIn").off("click");
        $("#zoomOut").off("click");
    });
});

var pRect = function (x,y,ctx,data,num,color,name,mul){
            ctx.beginPath();
            ctx.strokeStyle=color;
            for(let i = 0;i<num;i++){
                ctx.rect((data[i].position_x-x)/mul, (data[i].position_y-y)/mul, (data[i].position_w)/mul, (data[i].position_h)/mul);
                ctx.font = 'bold 12px SimSun';
                ctx.fillStyle=color;
                ctx.fillText(name,((data[i].position_x-x)/mul),((data[i].position_y-y)/mul));
                ctx.stroke();

            }
            ctx.closePath();
        }
        var pRects = function (x,y,ctx,data,num,color,name,mul){
            ctx.beginPath();
            ctx.strokeStyle=color;
            for(let i = 0;i<num;i++){
                ctx.rect((data[i].position_x-x+50)/mul, (data[i].position_y-y+50)/mul, (data[i].position_w)/mul, (data[i].position_h)/mul);
                ctx.font = 'bold 12px SimSun';
                ctx.fillStyle=color;
                ctx.fillText(name,((data[i].position_x-x+50)/mul),((data[i].position_y-y+50)/mul));
                ctx.stroke();

            }
            ctx.closePath();
        }
        var cDraw = function(x,y,data,mul){
            if(bigImg){
                bigImg= null;
            }
            var bigImg = document.createElement("img");     //创建一个img元素
            // bigImg.src="/img/" + data.c_img_path;   //给img元素的src属性赋值
            // bigImg.width=1600/mul;
            // bigImg.height=1200/mul;
            var c=document.getElementById("can");
            var ctx=c.getContext("2d");
            
            // if (bigImg.complete) {
            //     callback(img.width, img.height);
            // } else {
            //     img.onload = function () {
            //     callback(img.width, img.height);
            //     img.onload = null;
            //    };
            // };
            bigImg.onload = ()=>{
                var c=document.getElementById("can");
                var ctx=c.getContext("2d");

                var width = (1600/mul);
                var height = (1200/mul);
                if(x||y){
                    if(mul==4){
                        ctx.clearRect(0,0,400,300);
                        ctx.drawImage(bigImg,0,0,width,height);
                    }else{
                        ctx.clearRect(0,0,400,300);
                        ctx.drawImage(bigImg,x,y,400,300,0,0,400,300);
                        console.log("x||y");
                    }

                }else{
                    ctx.clearRect(0,0,400,300);
                    ctx.drawImage(bigImg,0,0,width,height);
                    console.log(0);
                }

                if(data.c_drop_num){
                    pRect(x,y,ctx,data.c_drop_info,data.c_drop_num,"#FFFF00","挂饰",mul);
                }
                if(data.c_platenum){
                    pRect(x,y,ctx,data.c_plateinfo,data.c_platenum,"#FF0000","车牌",mul);
                }
                if(data.c_tissbox_num){
                    pRect(x,y,ctx,data.c_tissbox_info,data.c_tissbox_num,"#4EEE94","纸巾盒",mul);
                }
                if(data.c_lamp_num){
                    pRect(x,y,ctx,data.c_lamp_info,data.c_lamp_num,"#e287b0","大灯",mul);
                }
                if(data.c_mirror_num){
                    pRect(x,y,ctx,data.c_mirror_info,data.c_mirror_num,"#00B2EE","后视镜",mul);
                }
                if(data.c_sunvisor_num){
                    pRect(x,y,ctx,data.c_sunvisor_info,data.c_sunvisor_num,"#00FF00","遮阳板",mul);
                }
                if(data.c_dangersign_num){
                    pRect(x,y,ctx,data.c_dangersign_info,data.c_dangersign_num,"#637acd","危险品",mul);
                }
                if(data.c_callphone_num){
                    pRect(x,y,ctx,data.c_callphone_info,data.c_callphone_num,"#CD00CD","打手机",mul);
                }
                if(data.c_sparetire_num){
                    pRect(x,y,ctx,data.c_sparetire_info,data.c_sparetire_num,"#66CD00","备胎",mul);
                }
                if(data.c_anninsp_num){
                    pRect(x,y,ctx,data.c_anninsp_info,data.c_anninsp_num,"#00FFFF","年检标",mul);
                }
                if(data.c_decoritem_num){
                    pRect(x,y,ctx,data.c_decoritem_info,data.c_decoritem_num,"#8B3626","摆件",mul);
                }
                if(data.c_roofrack_num){
                    pRect(x,y,ctx,data.c_roofrack_info,data.c_roofrack_num,"#B0E2FF","行李架",mul);
                }
                if(data.c_skylight_num){
                    pRect(x,y,ctx,data.c_skylight_info,data.c_skylight_num,"#EE9A00","天窗",mul);
                }
                if(data.c_passenger_num){
                    pRect(x,y,ctx,data.c_passenger_info,data.c_passenger_num,"#008B00","乘客",mul);
                }
                console.log("img-onload")
            }
            bigImg.src="/img/" + data.c_img_path;   //给img元素的src属性赋值
            bigImg.width=1600/mul;
            bigImg.height=1200/mul;

        };
var drawPath = function (id,cla,color) {

    var can1 = document.getElementById(id);
    $("#"+id.id).css("z-index","999");
    var ctx1 = id.getContext("2d");
    var ors = [];
    var or = null;
    ctx1.clearRect(0, 0, 800, 600);
    var boxs = document.getElementsByClassName(cla);
    for(let i = 0;i<boxs.length;i++){
        or={x:0,y:0};
        ors.push(or);
    }
    for(let i = 0;i<boxs.length;i++){
        ors[i].x = boxs[i].offsetLeft + 24;
        ors[i].y = boxs[i].offsetTop + 24;
    }
    if(boxs.length>2){
        var temp = ors[2];
        ors[2] = ors [3];
        ors[3] = temp;
    }
    // var leftUpY = $("#leftUp").offset().top + 4;
    // var leftUpX = $("#leftUp").offset().left + 4;
    //
    // var leftDownY = $("#leftDown").offset().top + 4;
    // var leftDownX = $("#leftDown").offset().left + 4;
    //
    // var rightUpY = $("#rightUp").offset().top + 4;
    // var rightUpX = $("#rightUp").offset().left + 4;
    //
    // var rightDownY = $("#rightDown").offset().top + 4;
    // var rightDownX = $("#rightDown").offset().left + 4;


    ctx1.beginPath();
    ctx1.strokeStyle = color;
    // ctx1.moveTo(leftUpX, leftUpY);
    // ctx1.lineTo(leftDownX, leftDownY);
    // ctx1.lineTo(rightDownX, rightDownY);
    // ctx1.lineTo(rightUpX, rightUpY);
    ctx1.moveTo(ors[0].x,ors[0].y);
    for(let i = 1;i<boxs.length;i++){
        ctx1.lineTo(ors[i].x,ors[i].y);
    }
    ctx1.closePath();
    ctx1.stroke();
};


var drawSurvey = function () {
    $("#surveyCan").css("display","block");
    $("#leftCan").css("display","none");
    $("#rightCan").css("display","none");
    $("#frontCan").css("display","none");
    $("#backCan").css("display","none");
    $("#waitCan").css("display","none");
    $("#stopCan").css("display","none");

    var visible = document.getElementById("survey");
    if(!visible){
        var survey = "<div id=\"survey\">\n" +
            "        <div id=\"suLeftUp\" class=\"mini-box survey-can\"></div>\n" +
            "        <div id=\"suLeftDown\" class=\"mini-box survey-can\"></div>\n" +
            "        <div id=\"suRightUp\" class=\"mini-box survey-can\"></div>\n" +
            "        <div id=\"suRightDown\" class=\"mini-box survey-can\"></div>\n" +
            "    </div>";
        $("#drawLine").append(survey);
        $("#suLeftUp").css({top: -4, left: -4});
        $("#suLeftDown").css({bottom: -4, left: -4});
        $("#suRightUp").css({top: -4, right: -4});
        $("#suRightDown").css({bottom: -4, right: -4});
    }
    $("#survey").css('display', 'block');
    drawPath(surveyCan,"survey-can","red");
    var miniBoxs = document.getElementsByClassName("mini-box");
    var flag = false;
    var currentX,currentY;
    var that;
    $("#lineSurvey").css("color","red");
    for (let i = 0; i < miniBoxs.length; i++) {
        $("#"+miniBoxs[i].id).click(function () {
            flag = false;
            $("#survey").css('display', 'none');
            $("#lineSurvey").css("color","");
            $("#surveyCan").css("z-index","100");
        }).mousedown(function (e) {
                flag = true;//移动标记
                that = e;
                currentX = e.pageX - parseInt($("#"+miniBoxs[i].id).css("left"));
                currentY = e.pageY - parseInt($("#"+miniBoxs[i].id).css("top"));
            });
        $("#surveyCan").mousemove(function (e) {
            if (flag) {
                var x = e.pageX - currentX;//移动时根据鼠标位置计算控件左上角的绝对位置
                var y = e.pageY - currentY;
                $("#"+that.target.id).css({top: y, left: x});//控件新位置
                drawPath(surveyCan,"survey-can","red");
            }
            console.log("move");
        }).mouseup(function () {

        });
    }
};

var drawLeft = function () {
    $("#surveyCan").css("display","none");
    $("#leftCan").css("display","block");
    $("#rightCan").css("display","none");
    $("#frontCan").css("display","none");
    $("#backCan").css("display","none");
    $("#waitCan").css("display","none");
    $("#stopCan").css("display","none");
    var visible = document.getElementById("left");
    if(!visible){
        var left = "<div id=\"left\">\n" +
            "        <div id=\"lfUp\" class=\"mini-box left-can\"></div>\n" +
            "        <div id=\"lfDown\" class=\"mini-box left-can\"></div>\n" +
            "    </div>";
        $("#drawLine").append(left);
        $("#lfUp").css({top: 20, left: 20});
        $("#lfDown").css({bottom: -4, left: -4});
    }
    $("#left").css('display', 'block');
    drawPath(leftCan,"left-can","blue");
    var miniBoxs = document.getElementsByClassName("mini-box");
    var flag = false;
    var currentX,currentY;
    var that;
    $("#lineLeft").css("color","blue");
    for (let i = 0; i < miniBoxs.length; i++) {
        $("#"+miniBoxs[i].id).click(function () {
            flag = false;
            $("#left").css('display', 'none');
            $("#lineLeft").css("color","");
            $("#leftCan").css("z-index","100");
        })
            .mousedown(function (e) {
                flag = true;//移动标记
                that = e;
                currentX = e.pageX - parseInt($("#"+miniBoxs[i].id).css("left"));
                currentY = e.pageY - parseInt($("#"+miniBoxs[i].id).css("top"));
            });
        $("#leftCan").mousemove(function (e) {
            if (flag) {
                var x = e.pageX - currentX;//移动时根据鼠标位置计算控件左上角的绝对位置
                var y = e.pageY - currentY;
                $("#"+that.target.id).css({top: y, left: x});//控件新位置
                drawPath(leftCan,"left-can","blue");
            }
            console.log("move");
        }).mouseup(function () {

        });
    }
};

var showAll = function () {
    $("#surveyCan").css("display","block");
    $("#leftCan").css("display","block");
    $("#rightCan").css("display","block");
    $("#frontCan").css("display","block");
    $("#backCan").css("display","block");
    $("#waitCan").css("display","block");
    $("#stopCan").css("display","block");
};