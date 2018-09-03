var closeP = false;
var cFlag = false;
var cirChange = false;
var cir1X,cir1Y,cir2X,cir2Y;
var cLength = 0;
var cId = null;
var cIdChange = false;
var drawCir = function () {//圆点的事件注册
    let miniCirs = document.getElementsByClassName("mini-cir");
    let ccurrentX,ccurrentY;
    let cthat = null;
    let changeId;//记录当前圆点是否发生变化
    let targetId = 0;
    for (let i = 0; i < miniCirs.length; i++) {
        $("#"+miniCirs[i].id).off('click').on('click',function (e) {
            cFlag = false;
            $(".mini-cir").removeClass("mini-cir-down");//移除所有选中状态
        }).off('mousedown').on('mousedown',function (e) {
            cFlag = true;//圆点移动标记
            if(cthat===null){
                cthat = e;
            }
            ccurrentX = e.pageX - parseInt($("#"+e.currentTarget.id).css("left"));
            ccurrentY = e.pageY - parseInt($("#"+e.currentTarget.id).css("top"));
            targetId = parseInt(e.target.id.substring(3));
        });
    }
    $("#drawLine").on('mousemove',function (e) {
        if (cFlag) {
            if(cthat===null){
                return;
            }
            if(window.event.altKey&&cthat){//点击圆点并按下alt键
                let x = e.pageX - ccurrentX;//移动时根据鼠标位置计算控件左上角的绝对位置
                let y = e.pageY - ccurrentY;
                $("#"+cthat.target.id).css({top: y, left: x});//选中圆点的新位置
                $("#"+cthat.target.id).addClass("mini-cir-down");//添加选中状态
                let ctarget = targetId;//获取当前点击的圆点ID
                let po,cX,cY;

                if(ctarget%2){//根据圆点ID获取与其成对的另一个圆点的坐标
                    po = document.getElementById("po"+(ctarget+1)/2);
                    cX = parseInt($("#cir"+(ctarget+1)).css('left')) - parseInt($("#po"+(ctarget+1)/2).css('left'));
                    cY = parseInt($("#cir"+(ctarget+1)).css('top')) - parseInt($("#po"+(ctarget+1)/2).css('top'));
                    changeId = ctarget+1;
                }else{
                    po = document.getElementById("po"+ctarget/2);
                    cX = parseInt($("#cir"+(ctarget-1)).css('left')) - parseInt($("#po"+ctarget/2).css('left'));
                    cY = parseInt($("#cir"+(ctarget-1)).css('top')) - parseInt($("#po"+ctarget/2).css('top'));
                    changeId = ctarget-1;
                }
                let X = parseInt(cthat.target.offsetLeft) -  parseInt(po.offsetLeft);//当前点击圆点与锚点的距离
                let Y = parseInt(cthat.target.offsetTop) - parseInt(po.offsetTop);
                let sLength = Math.sqrt(X*X + Y*Y);//计算当前圆点与锚点的长度
                if(cId === null){
                    cId = ctarget;
                }
                if(cId !== ctarget){//判断当前的圆点ID是否发生变化来确定是否重新计算成对圆点的长度
                    cId = ctarget;
                    cIdChange = true;
                }else{
                    cIdChange = false;
                }
                if(cLength===0||cIdChange){
                    cLength = parseInt(Math.sqrt(cX*cX + cY*cY));//计算与当前点击圆点成对的另一个圆点与锚点的长度
                }
                let mul1 = (X/sLength).toFixed(2);//省略小数以减小误差
                let mul2 = (Y/sLength).toFixed(2);
                if(X>0){//根据当前圆点相对于锚点的位置设置与之对应的圆点的坐标，使得当前圆点与对应圆点永远在一条直线上
                    if(mul2<0){
                        $("#cir"+changeId).css({top:(po.offsetTop-(cLength*mul2)),left:(po.offsetLeft-(cLength*mul1))});
                    }else{
                        $("#cir"+changeId).css({top:(po.offsetTop-(cLength*mul2)),left:(po.offsetLeft-(cLength*mul1))});
                    }
                }else{
                    if(mul2<0){
                        $("#cir"+changeId).css({top:(po.offsetTop-(cLength*mul2)),left:(po.offsetLeft-(cLength*mul1))});
                    }else{
                        $("#cir"+changeId).css({top:(po.offsetTop-(cLength*mul2)),left:(po.offsetLeft-(cLength*mul1))});
                    }
                }
            }
            if(window.event.ctrlKey&&cthat){//点击圆点并按住ctrl键
                let target = parseInt(cthat.target.id.substring(3));
                $(".mini-cir").removeClass("mini-cir-down");
                let x = e.pageX - ccurrentX;//移动时根据鼠标位置计算控件左上角的绝对位置
                let y = e.pageY - ccurrentY;
                $("#cir"+target).css({left:x,top:y});//此时只改变当前圆点的坐标
                $("#cir"+target).addClass("mini-cir-down");
            }

            drawPath();
        }
    }).off('mouseup').on('mouseup',function (e) {
        cthat = null;
        cFlag = false;
    });
};
var drawAll = function () {
    $("#point").css('visibility', 'visible');
    drawPath();
    let miniBoxs = document.getElementsByClassName("point-can");
    let cmove = false;//圆点移动的标志
    let flag = false;//锚点移动的标志
    let po1State = false;//第一个锚点的状态
    let delState = true;//删除状态
    let currentX,currentY;//存储当前坐标
    let that;//存储锚点状态
    $("#drawLine").css("z-index",999);
    for (let i = 0; i < miniBoxs.length; i++) {
        $("#"+miniBoxs[i].id).off('click').on('click',function (e) {//为每一个锚点注册事件
            if(closeP){//判断路径是否闭合
                if(po1State === false){//这是第一次点击第一个锚点，此时触发的事件为闭合路径
                    po1State =true;//修改第一个锚点的状态为true
                    flag = false;
                    cmove = false;
                    return;
                }
                if(delState){//判断是否删除锚点
                    if(miniBoxs.length===2){//如果锚点数=2，就不可再删除
                        return;
                    }
                    $("#"+e.currentTarget.id).remove();//删除锚点
                    let target = parseInt(e.currentTarget.id.substring(2));
                    $(".cir-can"+target).remove();//删除当前锚点下已存在的圆点
                    delState = false;
                    drawPath();//重新绘制路径
                }
            }
            if(miniBoxs.length>1&&delState){//路径未闭合状态
                if (e.currentTarget.id ==="po1"){
                    return;
                }else{
                    $("#"+e.currentTarget.id).remove();
                    let target = parseInt(e.currentTarget.id.substring(2));
                    $(".cir-can"+target).remove();
                    delState = false;
                    drawPath();
                }
            }

        }).off('mousedown').on('mousedown',function (e) {
            cmove = true;
            cirChange = true;//设置圆点改变状态为true，表示此时圆点的状态已经改变
            $(".mini-box").removeClass("mini-box-down");
            $(".mini-cir").removeClass("mini-cir-down");
            that = null;
            if(window.event.ctrlKey) {//点击锚点并按住ctrl键
                delState = false; //设置删除状态为false
                flag = true;//移动标志
                that = e;
            }else{
                delState = true;
            }
            if(window.event.altKey){//点击锚点并按住alt键
                that = e;
            }
            if(that===null){
                that = e;
            }
            $("#"+e.target.id).addClass("mini-box-down");
            currentX = e.pageX - parseInt($("#"+e.currentTarget.id).css("left"));
            currentY = e.pageY - parseInt($("#"+e.currentTarget.id).css("top"));
            if(e.currentTarget.id === "po1"&&!po1State){//第一次点击 第一个生成的锚点，闭合路径
                closeP = true; //设置闭合路径的状态为true
                $("#po1").removeClass("closeP");
                $("#po1").addClass("mini-box-down delP");
                $("#po1").removeAttr("title");
                $("#po1").attr("title","删除锚点");
                $("#po"+miniBoxs.length).removeClass("mini-box-down");//移除上一个锚点的选中状态
                drawPath();
            }
        }).off('mouseup').on('mouseup',function (e) {
            flag = false;
            cmove = false;
            that = null;
        });
    }

    $("#drawLine").on('mousemove',function (e) {
        let targetId;
        if(that){//获取当前点击的锚点ID
            targetId = "#"+that.target.id;
        }
        if(window.event.ctrlKey&&flag&&that) {
            delState = false;
            if (flag) {
                var x = e.pageX - currentX;//移动时根据鼠标位置计算控件左上角的绝对位置
                var y = e.pageY - currentY;
                $(targetId).css({top: y, left: x});//控件新位置
                $(targetId).addClass("mini-box-down");//添加选中状态
                let target = parseInt(that.target.id.substring(2));
                var cir = document.getElementsByClassName("cir-can"+target);
                if(cir.length){
                    if(cirChange){//判断与上次相比，圆点是否发生变化
                        cir1X = cir[0].offsetLeft - x;
                        cir1Y = cir[0].offsetTop - y;
                        cir2X = cir[1].offsetLeft - x;
                        cir2Y = cir[1].offsetTop - y;
                    }
                    if(cir1X){
                        $(cir[0]).css({top:y+cir1Y,left:x+cir1X});
                        $(cir[1]).css({top:y+cir2Y,left:x+cir2X});

                    }else{
                        $(cir[0]).css({top:(y),left:(x)});
                        $(cir[1]).css({top:(y),left:(x)});
                    }
                }
                drawPath();
                cirChange = false;
            }
            return;
        }
        if(window.event.altKey&&cmove&&that){//点击锚点并按住alt键
            delState = false;
            $(targetId).addClass("mini-box-down");
            let target = parseInt(that.target.id.substring(2));

            let cirCans = document.getElementsByClassName("cir-can"+target);
            if(!cirCans.length){//判断圆点是否存在，否则创建
                let cirs = [];
                let cirDiv1 = $('<div></div>');
                cirDiv1.attr({"class": "mini-cir cir-can"+target,"id":"cir"+(2*target-1)});
                cirs.push(cirDiv1);
                let cirDiv2 = $('<div></div>');
                cirDiv2.attr({"class": "mini-cir cir-can"+target,"id":"cir"+(target*2)});
                cirs.push(cirDiv2);
                $("#"+that.target.id).after(cirs);
                drawCir();
            }
            let x = e.pageX - currentX;//移动时根据鼠标位置计算控件左上角的绝对位置
            let y = e.pageY - currentY;
            $("#cir"+(target*2-1)).css({left:x,top:y});//根据鼠标位置改变奇数圆点即此锚点的第一个圆点坐标
            $("#cir"+(target*2-1)).addClass("mini-cir-down");
            let po = document.getElementById("po"+target);
            let X = x - parseInt(po.offsetLeft);
            let Y = y - parseInt(po.offsetTop);
            $("#cir"+target*2).css({left:(po.offsetLeft-X),top:(po.offsetTop-Y)});
            drawPath();
            return;
        }
        that = null;
    });
};
$(document).ready(function(){
    let currentX1,currentY1;
    $("#clickZone").click(function () {
    }).mousedown(function (e) {
        let length = document.getElementsByClassName("point-can").length;
        // if(length===20){
        //     alert("锚点不能超过20个");
        //     return;
        // }
        let poDiv;
        currentX1 = e.offsetX;//获取当前鼠标位置
        currentY1 = e.offsetY;
        if(length){//判断当前是否是第一个锚点
            let poCan = document.getElementsByClassName("point-can");
            let targetId = parseInt(poCan[(length-1)].id.substring(2));
            poDiv = $('<div></div>');
            poDiv.attr({"class": "mini-box point-can delP mini-box-down","id":"po"+(targetId+1),"title": "删除锚点"});
            let poId = "#po"+targetId;
            $(poId).removeClass("mini-box-down");
            $(poId).after(poDiv);
        }else{
            poDiv = $('<div></div>');
            poDiv.attr({"class": "mini-box point-can closeP mini-box-down","id":"po1","title": "闭合路径"});
            $("#point").html(poDiv);
        }
        $("#"+poDiv[0].id).css({top:currentY1,left:currentX1});//锚点位置为当前点击位置
        drawAll();//注册事件的方法
    });
});

// 添加锚点的操作，未完善
// var addpo = function () {
//     let length = document.getElementsByClassName("point-can").length;
//     if(length === 20){
//         $("#addpo").attr("disabled",true);
//         return;
//     }else{
//         $("#addpo").attr("disabled",false);
//         $("#reducepo").attr("disabled",false);
//     }
//     let poDiv = $('<div></div>');
//     poDiv.attr({"class": "mini-box point-can","id":"po"+(length+1)});
//     $("#"+poDiv[0].id).css({top:10,left:10});
//     $("#po"+length).after(poDiv);
//     drawAll();
//
// };

var reducePo = function () {
    let poCan = document.getElementsByClassName("point-can");
    let length = poCan.length;
    let targetId = parseInt(poCan[(length-1)].id.substring(2));
    if(length === 3){
        $("#reducePo").attr("disabled",true);
        return;
    }else{
        $("#reducePo").attr("disabled",false);
        $("#addpo").attr("disabled",false);
    }
    $("#po"+targetId).remove();
    $(".cir-can"+targetId).remove();
    drawAll();
};
var poPositions = [];
var drawPath = function () {

    let configCan = document.getElementById("configCan");
    let ctx = configCan.getContext("2d");
    ctx.clearRect(0, 0, 800, 600);//清空画布
    let poCan = document.getElementsByClassName("point-can");
    poPositions = [];
    for(let i = 0;i<poCan.length;i++){
        let position = {x:0,y:0};
        position.x = poCan[i].offsetLeft + 4;
        position.y = poCan[i].offsetTop + 4;
        poPositions.push(position);
    }//获取锚点坐标
    let cirCanP = [];
    for(let i = 0;i<poCan.length;i++){
        let targetId = parseInt(poCan[i].id.substring(2));
        let cir = document.getElementsByClassName("cir-can"+targetId);
        let cirP ;
        if(cir.length){
            cirP = [];
            for(let j = 0;j<2;j++){
                let position = {x:0,y:0};
                position.x = cir[j].offsetLeft + 4;
                position.y = cir[j].offsetTop + 4;
                cirP.push(position);
            }
        }
        cirCanP[i] = cirP;
    }//获取圆点坐标
    for(let i = 0;i<poPositions.length;i++){
        if(poPositions[i]&&cirCanP[i]){
            ctx.beginPath();
            ctx.strokeStyle = "#1984ec";
            ctx.moveTo(cirCanP[i][0].x,cirCanP[i][0].y);
            ctx.lineTo(poPositions[i].x,poPositions[i].y);
            ctx.lineTo(cirCanP[i][1].x,cirCanP[i][1].y);
            ctx.stroke();
        }
    }//绘制已存在圆点与其对应锚点的直线

    // for(let i = 0;i<poPositions.length;i++){
    //     if(poPositions[i]&&cirCanP[i]){
    //         ctx.beginPath();
    //         ctx.strokeStyle = "red";
    //         ctx.moveTo(cirCanP[i][0].x,cirCanP[i][0].y);
    //         ctx.lineTo(cirCanP[i][0].x,poPositions[i].y);
    //         ctx.lineTo(cirCanP[i][1].x,poPositions[i].y);
    //         ctx.lineTo(cirCanP[i][1].x,cirCanP[i][1].y);
    //         ctx.stroke();
    //     }
    // }
    ctx.beginPath();
    ctx.strokeStyle = "#1984ec";
    ctx.moveTo(poPositions[0].x, poPositions[0].y);
    if(cirCanP[0]){//如果第一个锚点的圆点存在
        if(!cirCanP[1]){//且第二个锚点的圆点不存在，则绘制二次贝塞尔曲线
            ctx.quadraticCurveTo(cirCanP[0][1].x,cirCanP[0][1].y,poPositions[1].x,poPositions[1].y);
        }else{//且第二个锚点的圆点存在，则绘制三次贝塞尔曲线
            ctx.bezierCurveTo(cirCanP[0][1].x, cirCanP[0][1].y, cirCanP[1][0].x,cirCanP[1][0].y, poPositions[1].x, poPositions[1].y);
        }
        for(let i = 1;i<poPositions.length;i++){
            if(i===(poCan.length-1)){
                if(cirCanP[i]){//如果最后一个锚点的圆点存在
                    if(cirCanP[(i-1)]){//且倒数第二个锚点的圆点存在，则绘制三次贝塞尔曲线
                        ctx.bezierCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, cirCanP[0][0].x,cirCanP[0][0].y, poPositions[0].x, poPositions[0].y);
                        ctx.stroke();
                        return;
                    }else{//且倒数第二个锚点不存在
                        ctx.quadraticCurveTo(cirCanP[i][0].x,cirCanP[i][0].y,poPositions[i].x, poPositions[i].y);//先绘制倒数第二个锚点与倒数第三个点的二次贝塞尔曲线
                        ctx.bezierCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, cirCanP[0][0].x,cirCanP[0][0].y, poPositions[0].x, poPositions[0].y);//再绘制最后一个锚点与第一个锚点的三次贝塞尔曲线
                        ctx.stroke();
                        return;
                    }

                }else{//如果最后一个锚点不存在
                    if(cirCanP[(i-1)]){//且倒数第二个锚点存在，则绘制第一个锚点与最后一个锚点的二次贝塞尔曲线
                        ctx.quadraticCurveTo(cirCanP[0][0].x,cirCanP[0][0].y,poPositions[0].x, poPositions[0].y);
                        ctx.stroke();
                        return;
                    }else{//且倒数第二个锚点不存在
                        ctx.lineTo(poPositions[i-1].x, poPositions[i-1].y);//绘制第二个锚点
                        ctx.lineTo(poPositions[i].x, poPositions[i].y);//绘制最后一个锚点
                        ctx.quadraticCurveTo(cirCanP[0][0].x,cirCanP[0][0].y,poPositions[0].x, poPositions[0].y);//绘制最后一个锚点到第一个锚点的二次贝塞尔曲线
                        ctx.stroke();
                        return;
                    }
                }
            }
            if(cirCanP[i]){//如果当前锚点存在小圆点
                if(cirCanP[i-1]){//且前一个锚点小圆点存在
                    if(cirCanP[i+1]){//且后一个锚点小圆点存在
                        ctx.bezierCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, cirCanP[i+1][0].x,cirCanP[i+1][0].y, poPositions[i+1].x, poPositions[i+1].y);//绘制当前锚点与下一个锚点的三次贝塞尔曲线
                    }else{//且后一个锚点小圆点不存在
                        ctx.quadraticCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, poPositions[i+1].x, poPositions[i+1].y);//绘制当前锚点与下一个锚点的二次贝塞尔曲线
                    }
                }else if(cirCanP[i+1]){//且后一个锚点小圆点存在，此时前一个锚点不存在小圆点
                    ctx.quadraticCurveTo(cirCanP[i][0].x, cirCanP[i][0].y, poPositions[i].x, poPositions[i].y);//则绘制前一个锚点与当前锚点的二次贝塞尔曲线
                    ctx.bezierCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, cirCanP[i+1][0].x,cirCanP[i+1][0].y, poPositions[i+1].x, poPositions[i+1].y);//绘制当前锚点与后一个锚点的三次贝塞尔曲线
                }else{//前一个锚点与后一个锚点都不存在小圆点
                    ctx.quadraticCurveTo(cirCanP[i][0].x, cirCanP[i][0].y, poPositions[i].x, poPositions[i].y);//绘制前一个锚点的与当前锚点的二次贝塞尔曲线
                    ctx.quadraticCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, poPositions[i+1].x, poPositions[i+1].y);//绘制当前锚点与后一个锚点的二次贝塞尔曲线
                }
            }else{//如果当前锚点不存在小圆点
                ctx.lineTo(poPositions[i].x, poPositions[i].y);//则绘制当前锚点
            }
        }
    }else{//第一个锚点的小圆点不存在的情况，其余同上
        for(let i = 1;i<poPositions.length;i++){
            if(i===(poCan.length-1)){
                if(cirCanP[i]){
                    if(cirCanP[i-1]){
                        ctx.quadraticCurveTo(cirCanP[i][1].x,cirCanP[i][1].y,poPositions[0].x, poPositions[0].y);
                        ctx.stroke();
                        return;
                    }else{
                        ctx.lineTo(poPositions[i-1].x, poPositions[i-1].y);
                        ctx.quadraticCurveTo(cirCanP[i][0].x,cirCanP[i][0].y,poPositions[i].x, poPositions[i].y);
                        ctx.quadraticCurveTo(cirCanP[i][1].x,cirCanP[i][1].y,poPositions[0].x, poPositions[0].y);
                        ctx.stroke();
                        return;
                    }
                }
            }
            if(cirCanP[i]){
                if(cirCanP[i-1]){
                    if(cirCanP[i+1]){
                        ctx.bezierCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, cirCanP[i+1][0].x,cirCanP[i+1][0].y, poPositions[i+1].x, poPositions[i+1].y);
                    }else{
                        ctx.quadraticCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, poPositions[i+1].x, poPositions[i+1].y);
                    }

                }else if(cirCanP[i+1]){
                    ctx.quadraticCurveTo(cirCanP[i][0].x, cirCanP[i][0].y, poPositions[i].x, poPositions[i].y);
                    ctx.bezierCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, cirCanP[i+1][0].x,cirCanP[i+1][0].y, poPositions[i+1].x, poPositions[i+1].y);
                }else{
                    ctx.quadraticCurveTo(cirCanP[i][0].x, cirCanP[i][0].y, poPositions[i].x, poPositions[i].y);
                    ctx.quadraticCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, poPositions[i+1].x, poPositions[i+1].y);
                }
            }else{
                ctx.lineTo(poPositions[i].x, poPositions[i].y);
            }

        }
    }
    if(closeP){//如果闭合路径状态为true，则闭合路径
        ctx.closePath();
    }
    ctx.stroke();
};