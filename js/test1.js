var closeP = false;
var cFlag = false;
var cirChange = false;
var cir1X,cir1Y,cir2X,cir2Y;
var cLength = 0;
var cId = null;
var cIdChange = false;
$(document).ready(function () {

});

var drawCir = function () {
    let miniCirs = document.getElementsByClassName("mini-cir");
    let ccurrentX,ccurrentY;
    let cthat = null;
    let changeId;
    let targetId = 0;
    for (let i = 0; i < miniCirs.length; i++) {
        $("#"+miniCirs[i].id).off('click').on('click',function (e) {
            //console.log("c--------click");
            cFlag = false;
            cirChange = true;

        }).off('mousedown').on('mousedown',function (e) {
            //console.log("c--------mousedown");
            cFlag = true;//移动标记
            if(cthat===null){
                cthat = e;
            }

            ccurrentX = e.pageX - parseInt($("#"+e.currentTarget.id).css("left"));
            ccurrentY = e.pageY - parseInt($("#"+e.currentTarget.id).css("top"));
            targetId = parseInt(e.target.id.substring(3));
        });

        $("#drawLine").mousemove(function (e) {
            //console.log("c--------mousemove");
                if (cFlag) {
                    if(cthat===null){
                        return;
                    }
                    let x = e.pageX - ccurrentX;//移动时根据鼠标位置计算控件左上角的绝对位置
                    let y = e.pageY - ccurrentY;
                    $("#"+cthat.target.id).css({top: y, left: x});//控件新位置
                    let ctarget = targetId;
                    let su,cX,cY;

                    if(ctarget%2){
                        su = document.getElementById("su"+(ctarget+1)/2);
                        cX = parseInt($("#cir"+(ctarget+1)).css('left')) - parseInt($("#su"+(ctarget+1)/2).css('left'));
                        cY = parseInt($("#cir"+(ctarget+1)).css('top')) - parseInt($("#su"+(ctarget+1)/2).css('top'));
                        changeId = ctarget+1;
                    }else{
                        su = document.getElementById("su"+ctarget/2);
                        //console.log("--------------------"+parseInt($("#cir"+(ctarget-1)).css('left')) +parseInt($("#su"+ctarget/2).css('left')));
                        cX = parseInt($("#cir"+(ctarget-1)).css('left')) - parseInt($("#su"+ctarget/2).css('left'));
                        cY = parseInt($("#cir"+(ctarget-1)).css('top')) - parseInt($("#su"+ctarget/2).css('top'));
                        changeId = ctarget-1;
                    }
                    let X = parseInt(cthat.target.offsetLeft) -  parseInt(su.offsetLeft);
                    let Y = parseInt(cthat.target.offsetTop) - parseInt(su.offsetTop);
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
                            $("#cir"+changeId).css({top:(su.offsetTop-(cLength*mul2)),left:(su.offsetLeft-(cLength*mul1))});
                        }else{
                            $("#cir"+changeId).css({top:(su.offsetTop-(cLength*mul2)),left:(su.offsetLeft-(cLength*mul1))});
                        }
                    }else{
                        if(mul2<0){
                            $("#cir"+changeId).css({top:(su.offsetTop-(cLength*mul2)),left:(su.offsetLeft-(cLength*mul1))});
                        }else{
                            $("#cir"+changeId).css({top:(su.offsetTop-(cLength*mul2)),left:(su.offsetLeft-(cLength*mul1))});
                        }
                    }

                    drawPath();
                }
        }).off('mouseup').on('mouseup',function (e) {
            //console.log("c--------mouseup");
            cthat = null;
            cFlag = false;

        });
    }
};
var drawAll = function (id,state,color) {
    $("#survey").css('visibility', 'hidden');
    $("#line").css('visibility', 'hidden');
    $("#plate").css('visibility', 'hidden');
    $("#"+id).css('visibility', 'visible');
    $("#lineSurvey").css("color","");
    $("#lineLeft").css("color","");
    $("#linePlate").css("color","");
    $("#"+state).css("color",color);
    drawPath();
    var miniBoxs = document.getElementsByClassName(id+"-can");
    var cmove = false;
    var flag = false;
    var su1State = false;
    var delState = true;
    var currentX,currentY;
    var ccurrentX,ccurrentY;
    var that;
    $("#drawLine").css("z-index",999);
    for (let i = 0; i < miniBoxs.length; i++) {
        //console.log(i);
        $("#"+miniBoxs[i].id).off('click').on('click',function (e) {
            //console.log("click"+ flag);
            if(closeP){
                if(su1State === false){
                    su1State =true;
                    flag = false;
                    cmove = false;
                    return;
                }
                if(delState){
                    $("#"+e.currentTarget.id).remove();
                    let target = parseInt(e.currentTarget.id.substring(2));
                    $(".cir-can"+target).remove();
                    delState = false;
                    drawPath();
                }
            }
            if(miniBoxs.length>1&&delState){
                if (e.currentTarget.id ==="su1"){
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
            //console.log("mousedown"+ flag);
            cmove = true;

            if(window.event.ctrlKey) {
                delState = false;
                flag = true;//移动标记
            }else{
                delState = true;
            }
            for(let i = 0;i<miniBoxs.length;i++){
                $("#"+miniBoxs[i].id).removeClass("mini-box-down");
            }
            if(that===null){
                that = e;
            }

            currentX = e.pageX - parseInt($("#"+e.currentTarget.id).css("left"));
            currentY = e.pageY - parseInt($("#"+e.currentTarget.id).css("top"));
            if(e.currentTarget.id === "su1"&&!su1State){
                closeP = true;
                $("#su1").removeClass("closeP");
                $("#su1").addClass("mini-box-down delP");
                $("#su1").removeAttr("title");
                $("#su1").attr("title","删除锚点");
                $("#su"+miniBoxs.length).removeClass("mini-box-down");
                drawPath();
            }

        }).off('mouseup').on('mouseup',function (e) {
            //console.log("mouseup"+ flag);
            flag = false;
            cmove = false;
            that = null;
        });
    }

    $("#drawLine").mousemove(function (e) {

        //console.log("mousemove");
        if(window.event.ctrlKey&&flag) {
            //console.log("ctrl"+ flag);
            delState = false;
            if (flag) {
                var x = e.pageX - currentX;//移动时根据鼠标位置计算控件左上角的绝对位置
                var y = e.pageY - currentY;
                $("#"+that.target.id).css({top: y, left: x});//控件新位置
                $("#"+that.target.id).addClass("mini-box-down");
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
        if(window.event.altKey&&cmove){
            //console.log("alt");
            delState = false;
            let target = parseInt(that.target.id.substring(2));
            var sus = document.getElementsByClassName("cir-can"+target);
            if(!sus.length){
                var cirs = [];
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
            let su = document.getElementById("su"+target);
            let X = x - parseInt(su.offsetLeft);
            let Y = y - parseInt(su.offsetTop);
            $("#cir"+target*2).css({left:(su.offsetLeft-X),top:(su.offsetTop-Y)});
            drawPath();
        }
    });
};
$(document).ready(function(){
    var currentX1,currentY1;
    $("#clickZone").click(function () {

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
            suDiv.attr({"class": "mini-box survey-can delP mini-box-down","id":"su"+(length+1),"title": "删除锚点"});
            $("#su"+length).removeClass("mini-box-down");
            $("#su"+length).after(suDiv);
            $("#"+suDiv[0].id).css({top:currentY1,left:currentX1});
            drawAll('survey','lineSurvey','red');
        }else{
            currentX1 = e.offsetX;
            currentY1 = e.offsetY;
            let suDiv = $('<div></div>');
            suDiv.attr({"class": "mini-box survey-can closeP mini-box-down","id":"su1","title": "闭合路径"});
            $("#survey").html(suDiv);
            $("#"+suDiv[0].id).css({top:currentY1,left:currentX1});
            drawAll('survey','lineSurvey','red');

        }

    });
});



var addSu = function () {
    let length = document.getElementsByClassName("survey-can").length;
    if(length === 20){
        $("#addSu").attr("disabled",true);
        return;
    }else{
        $("#addSu").attr("disabled",false);
        $("#reduceSu").attr("disabled",false);
    }
    let suDiv = $('<div></div>');
    suDiv.attr({"class": "mini-box survey-can","id":"su"+(length+1)});
    $("#"+suDiv[0].id).css({top:10,left:10});
    $("#su"+length).after(suDiv);
    drawAll('survey','lineSurvey','#FF0000');

};

var reduceSu = function () {
    let length = document.getElementsByClassName("survey-can").length;
    if(length === 3){
        $("#reduceSu").attr("disabled",true);
        return;
    }else{
        $("#reduceSu").attr("disabled",false);
        $("#addSu").attr("disabled",false);
    }
    $("#su"+length).remove();
    drawAll('survey','lineSurvey','#FF0000');
};
var suPositions = [];
var drawPath = function () {

    var configCan = document.getElementById("configCan");
    var cctx = configCan.getContext("2d");
    cctx.clearRect(0, 0, 800, 600);

    var suCan = document.getElementsByClassName("survey-can");

    suPositions = [];
    for(let i = 0;i<suCan.length;i++){
        let position = {x:0,y:0};
        position.x = suCan[i].offsetLeft + 4;
        position.y = suCan[i].offsetTop + 4;
        suPositions.push(position);
    }
    var cirCan = document.getElementsByClassName("mini-cir");

    var cirCanP = [];
    for(let i = 0;i<suCan.length;i++){
        let cir = document.getElementsByClassName("cir-can"+(i+1));
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
    cctx.clearRect(0, 0, 800, 600);
    for(let i = 0;i<suPositions.length;i++){
        if(suPositions[i]&&cirCanP[i]){
            cctx.beginPath();
            cctx.strokeStyle = "gray";
            cctx.moveTo(cirCanP[i][0].x,cirCanP[i][0].y);
            cctx.lineTo(suPositions[i].x,suPositions[i].y);
            cctx.lineTo(cirCanP[i][1].x,cirCanP[i][1].y);
            cctx.stroke();
        }
    }
    cctx.beginPath();
    cctx.strokeStyle = "#FF0000";
    cctx.moveTo(suPositions[0].x, suPositions[0].y);
    if(cirCanP[0]){
        if(!cirCanP[1]){
            //console.log("1")
            cctx.quadraticCurveTo(cirCanP[0][1].x,cirCanP[0][1].y,suPositions[1].x,suPositions[1].y);

        }else{
            cctx.bezierCurveTo(cirCanP[0][1].x, cirCanP[0][1].y, cirCanP[1][0].x,cirCanP[1][0].y, suPositions[1].x, suPositions[1].y);
        }


        for(let i = 1;i<suPositions.length;i++){
            if(i===(suCan.length-1)){
                if(cirCanP[(suCan.length-1)]){
                    cctx.quadraticCurveTo(cirCanP[i][0].x,cirCanP[i][0].y,suPositions[i].x, suPositions[i].y);
                    cctx.bezierCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, cirCanP[0][0].x,cirCanP[0][0].y, suPositions[0].x, suPositions[0].y);
                    cctx.stroke();
                    return;
                }else{
                    cctx.lineTo(suPositions[i-1].x, suPositions[i-1].y);
                    cctx.lineTo(suPositions[i].x, suPositions[i].y);
                    cctx.quadraticCurveTo(cirCanP[0][0].x,cirCanP[0][0].y,suPositions[0].x, suPositions[0].y);
                    cctx.stroke();
                    return;
                }
            }
            if(cirCanP[i]){
                if(cirCanP[i-1]){
                    if(cirCanP[i+1]){
                        cctx.bezierCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, cirCanP[i+1][0].x,cirCanP[i+1][0].y, suPositions[i+1].x, suPositions[i+1].y);
                    }else{
                        cctx.quadraticCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, suPositions[i+1].x, suPositions[i+1].y);
                    }

                }else if(cirCanP[i+1]){
                    cctx.quadraticCurveTo(cirCanP[i][0].x, cirCanP[i][0].y, suPositions[i].x, suPositions[i].y);
                    cctx.bezierCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, cirCanP[i+1][0].x,cirCanP[i+1][0].y, suPositions[i+1].x, suPositions[i+1].y);
                }else{
                    cctx.quadraticCurveTo(cirCanP[i][0].x, cirCanP[i][0].y, suPositions[i].x, suPositions[i].y);
                    cctx.quadraticCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, suPositions[i+1].x, suPositions[i+1].y);
                }
            }else{
                cctx.lineTo(suPositions[i].x, suPositions[i].y);
            }

        }
    }else{
        for(let i = 1;i<suPositions.length;i++){
            if(i===(suCan.length-1)){
                if(cirCanP[i]){
                    if(cirCanP[i-1]){
                        cctx.quadraticCurveTo(cirCanP[i-1][1].x, cirCanP[i-1][1].y, cirCanP[i][0].x,cirCanP[i][0].y, suPositions[i].x, suPositions[i].y);
                        cctx.quadraticCurveTo(cirCanP[i][1].x,cirCanP[i][1].y,suPositions[0].x, suPositions[0].y);
                        cctx.stroke();
                        return;
                    }else{
                        cctx.lineTo(suPositions[i-1].x, suPositions[i-1].y);
                        cctx.quadraticCurveTo(cirCanP[i][0].x,cirCanP[i][0].y,suPositions[i].x, suPositions[i].y);
                        cctx.quadraticCurveTo(cirCanP[i][1].x,cirCanP[i][1].y,suPositions[0].x, suPositions[0].y);
                        cctx.stroke();
                        return;
                    }
                }

            }
            // if(cirCanP[i]&&cirCanP[i+1]){
            //     cctx.bezierCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, cirCanP[i+1][0].x,cirCanP[i+1][0].y, suPositions[i+1].x, suPositions[i+1].y);
            // }else if(cirCanP[i]) {
            //     if(cirCanP[i-1]){
            //         cctx.bezierCurveTo(cirCanP[i-1][1].x, cirCanP[i-1][1].y, cirCanP[i][0].x,cirCanP[i][0].y, suPositions[i].x, suPositions[i].y);
            //         //cctx.quadraticCurveTo(cirCanP[i][1].x,cirCanP[i][1].y,suPositions[i+1].x, suPositions[i+1].y);
            //     }else if(cirCanP[i+1]){
            //         cctx.bezierCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, cirCanP[i+1][0].x,cirCanP[i+1][0].y, suPositions[i+1].x, suPositions[i+1].y);
            //     }else{
            //         cctx.quadraticCurveTo(cirCanP[i][0].x, cirCanP[i][0].y, suPositions[i].x, suPositions[i].y);
            //         cctx.quadraticCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, suPositions[i+1].x, suPositions[i+1].y);
            //     }
            // }else{
            //     cctx.lineTo(suPositions[i].x, suPositions[i].y);
            // }
            if(cirCanP[i]){
                if(cirCanP[i-1]){
                    if(cirCanP[i+1]){
                        cctx.bezierCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, cirCanP[i+1][0].x,cirCanP[i+1][0].y, suPositions[i+1].x, suPositions[i+1].y);
                    }else{
                        cctx.quadraticCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, suPositions[i+1].x, suPositions[i+1].y);
                    }

                }else if(cirCanP[i+1]){
                    cctx.quadraticCurveTo(cirCanP[i][0].x, cirCanP[i][0].y, suPositions[i].x, suPositions[i].y);
                    cctx.bezierCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, cirCanP[i+1][0].x,cirCanP[i+1][0].y, suPositions[i+1].x, suPositions[i+1].y);
                }else{
                    cctx.quadraticCurveTo(cirCanP[i][0].x, cirCanP[i][0].y, suPositions[i].x, suPositions[i].y);
                    cctx.quadraticCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, suPositions[i+1].x, suPositions[i+1].y);
                }
            }else{
                cctx.lineTo(suPositions[i].x, suPositions[i].y);
            }

        }
    }

    if(closeP){
        cctx.closePath();
    }
    cctx.stroke();



};