var closeP = false;
var cFlag = false;
var cirChange = false;
var cir1X,cir1Y,cir2X,cir2Y;
var cLength = 0;
var cId = null;
var cIdChange = false;
var drawCir = function () {
    let miniCirs = document.getElementsByClassName("mini-cir");
    let ccurrentX,ccurrentY;
    let cthat = null;
    let changeId;
    let targetId = 0;
    for (let i = 0; i < miniCirs.length; i++) {
        $("#"+miniCirs[i].id).off('click').on('click',function (e) {
            cFlag = false;
        }).off('mousedown').on('mousedown',function (e) {
            cFlag = true;//移动标记
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
            let x = e.pageX - ccurrentX;//移动时根据鼠标位置计算控件左上角的绝对位置
            let y = e.pageY - ccurrentY;
            $("#"+cthat.target.id).css({top: y, left: x});//控件新位置
            let ctarget = targetId;
            let po,cX,cY;

            if(ctarget%2){
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
            let X = parseInt(cthat.target.offsetLeft) -  parseInt(po.offsetLeft);
            let Y = parseInt(cthat.target.offsetTop) - parseInt(po.offsetTop);
            let sLength = Math.sqrt(X*X + Y*Y);
            if(cId === null){
                cId = ctarget;
            }
            if(cId !== ctarget){
                cId = ctarget;
                cIdChange = true;
            }else{
                cIdChange = false;
            }
            if(cLength===0||cIdChange){
                cLength = parseInt(Math.sqrt(cX*cX + cY*cY));
            }
            let mul1 = (X/sLength).toFixed(2);
            let mul2 = (Y/sLength).toFixed(2);
            if(X>0){
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
    let cmove = false;
    let flag = false;
    let po1State = false;
    let delState = true;
    let currentX,currentY;
    var that;
    $("#drawLine").css("z-index",999);
    for (let i = 0; i < miniBoxs.length; i++) {
        $("#"+miniBoxs[i].id).off('click').on('click',function (e) {
            if(closeP){
                if(po1State === false){
                    po1State =true;
                    flag = false;
                    cmove = false;
                    return;
                }
                if(delState){
                    if(miniBoxs.length===2){
                        return;
                    }
                    $("#"+e.currentTarget.id).remove();
                    let target = parseInt(e.currentTarget.id.substring(2));
                    $(".cir-can"+target).remove();
                    delState = false;
                    drawPath();
                }
            }
            if(miniBoxs.length>1&&delState){
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
            cirChange = true;
            for(let i = 0;i<miniBoxs.length;i++){
                $("#"+miniBoxs[i].id).removeClass("mini-box-down");
            }
            that =null;
            if(window.event.ctrlKey) {
                delState = false;
                flag = true;//移动标记
                that = e;
            }else{
                delState = true;
            }
            if(window.event.altKey){
                that = e;
            }
            if(that===null){
                that = e;
            }
            $("#"+e.target.id).addClass("mini-box-down");
            currentX = e.pageX - parseInt($("#"+e.currentTarget.id).css("left"));
            currentY = e.pageY - parseInt($("#"+e.currentTarget.id).css("top"));
            if(e.currentTarget.id === "po1"&&!po1State){
                closeP = true;
                $("#po1").removeClass("closeP");
                $("#po1").addClass("mini-box-down delP");
                $("#po1").removeAttr("title");
                $("#po1").attr("title","删除锚点");
                $("#po"+miniBoxs.length).removeClass("mini-box-down");
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
        if(that){
            targetId = "#"+that.target.id;
        }
        if(window.event.ctrlKey&&flag&&that) {
            delState = false;
            if (flag) {
                var x = e.pageX - currentX;//移动时根据鼠标位置计算控件左上角的绝对位置
                var y = e.pageY - currentY;
                $(targetId).css({top: y, left: x});//控件新位置
                $(targetId).addClass("mini-box-down");
                let target = parseInt(that.target.id.substring(2));
                var cir = document.getElementsByClassName("cir-can"+target);
                if(cir.length){
                    if(cirChange){
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
        if(window.event.altKey&&cmove&&that){
            delState = false;
            $(targetId).addClass("mini-box-down");
            let target = parseInt(that.target.id.substring(2));
            var pos = document.getElementsByClassName("cir-can"+target);
            if(!pos.length){
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
            $("#cir"+(target*2-1)).css({left:x,top:y});
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
        if(length){
            currentX1 = e.offsetX;
            currentY1 = e.offsetY;
            let poCan = document.getElementsByClassName("point-can");
            let targetId = parseInt(poCan[(length-1)].id.substring(2));
            let poDiv = $('<div></div>');
            poDiv.attr({"class": "mini-box point-can delP mini-box-down","id":"po"+(targetId+1),"title": "删除锚点"});
            let poId = "#po"+targetId;
            $(poId).removeClass("mini-box-down");
            $(poId).after(poDiv);
            $("#"+poDiv[0].id).css({top:currentY1,left:currentX1});
            drawAll();
        }else{
            currentX1 = e.offsetX;
            currentY1 = e.offsetY;
            let poDiv = $('<div></div>');
            poDiv.attr({"class": "mini-box point-can closeP mini-box-down","id":"po1","title": "闭合路径"});
            $("#point").html(poDiv);
            $("#"+poDiv[0].id).css({top:currentY1,left:currentX1});
            drawAll();
        }
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
    ctx.clearRect(0, 0, 800, 600);
    let poCan = document.getElementsByClassName("point-can");
    poPositions = [];
    for(let i = 0;i<poCan.length;i++){
        let position = {x:0,y:0};
        position.x = poCan[i].offsetLeft + 4;
        position.y = poCan[i].offsetTop + 4;
        poPositions.push(position);
    }
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
    }
    ctx.clearRect(0, 0, 800, 600);
    for(let i = 0;i<poPositions.length;i++){
        if(poPositions[i]&&cirCanP[i]){
            ctx.beginPath();
            ctx.strokeStyle = "#1984ec";
            ctx.moveTo(cirCanP[i][0].x,cirCanP[i][0].y);
            ctx.lineTo(poPositions[i].x,poPositions[i].y);
            ctx.lineTo(cirCanP[i][1].x,cirCanP[i][1].y);
            ctx.stroke();
        }
    }
    ctx.beginPath();
    ctx.strokeStyle = "#1984ec";
    ctx.moveTo(poPositions[0].x, poPositions[0].y);
    if(cirCanP[0]){
        if(!cirCanP[1]){
            ctx.quadraticCurveTo(cirCanP[0][1].x,cirCanP[0][1].y,poPositions[1].x,poPositions[1].y);
        }else{
            ctx.bezierCurveTo(cirCanP[0][1].x, cirCanP[0][1].y, cirCanP[1][0].x,cirCanP[1][0].y, poPositions[1].x, poPositions[1].y);
        }
        for(let i = 1;i<poPositions.length;i++){
            if(i===(poCan.length-1)){
                if(cirCanP[i]){
                    if(cirCanP[(i-1)]){
                        ctx.bezierCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, cirCanP[0][0].x,cirCanP[0][0].y, poPositions[0].x, poPositions[0].y);
                        ctx.stroke();
                        return;
                    }else{
                        ctx.quadraticCurveTo(cirCanP[i][0].x,cirCanP[i][0].y,poPositions[i].x, poPositions[i].y);
                        ctx.bezierCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, cirCanP[0][0].x,cirCanP[0][0].y, poPositions[0].x, poPositions[0].y);
                        ctx.stroke();
                        return;
                    }

                }else{
                    if(cirCanP[(i-1)]){
                        ctx.quadraticCurveTo(cirCanP[0][0].x,cirCanP[0][0].y,poPositions[0].x, poPositions[0].y);
                        ctx.stroke();
                        return;
                    }else{
                        ctx.lineTo(poPositions[i-1].x, poPositions[i-1].y);
                        ctx.lineTo(poPositions[i].x, poPositions[i].y);
                        ctx.quadraticCurveTo(cirCanP[0][0].x,cirCanP[0][0].y,poPositions[0].x, poPositions[0].y);
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
    }else{
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
    if(closeP){
        ctx.closePath();
    }
    ctx.stroke();
};