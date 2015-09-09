/*
 The MIT License (MIT)
 Copyright (c) 2015 tsukasa
*/

$(function() {
    var $window = $(window);
    var eventElement = document.body;
    var offset = {x: 0, y: 0};
    var mouse = {x: 0, y: 0};
    var width = 0;
    var height = 0;
    var coefficient = 100;
    var shortObj,middleObj,longObj,moveXObj,moveYObj,scaleYObj,winkObj,shakeObj;
    var paper = Snap().remove();
    paper.el('title', '');
    $(paper.node).find('title').html('Eye');

    Snap.load('Eye.svg', function(fg){
        var svg = fg.select('svg');
        paper.attr('viewBox', svg.node.viewBox.baseVal.x+" "+svg.node.viewBox.baseVal.y+" "+svg.node.viewBox.baseVal.width+" "+svg.node.viewBox.baseVal.height);

        var graphic = fg.select('g');
        var Allgroup = graphic.selectAll('g');
        clearID(Allgroup);
        paper.append(graphic);
        paper.prependTo(document.getElementById('svg'));

        //mouseMove Set
        shortObj = graphic.select('.svg-lange-short');
        middleObj = graphic.select('.svg-lange-middle');
        longObj = graphic.select('.svg-lange-long');
        $window.on('resize.svg', updateOffset).trigger('resize.svg');
        $window.on('mousemove.svg', mouseMove);

        //partsAnimation Set
        moveXObj = graphic.selectAll('.moveX');
        moveYObj = graphic.selectAll('.moveY');
        scaleYObj = graphic.selectAll('.scaleY');
        winkObj = graphic.selectAll('.wink');
        shakeObj = graphic.selectAll('.shake');

        if(moveXObj.length !== 0){
            for(var i=0; i<=moveXObj.length - 1; i++){
                cosMoveAnimation(moveXObj[i], 100, 2.0);
            }
        }

        if(moveYObj.length !== 0){
            for(var i=0; i<=moveYObj.length - 1; i++){
                sinMoveAnimation(moveYObj[i], 100, 2.0);
            }
        }

        if(shakeObj.length !== 0){
            for(var i=0; i<=shakeObj.length - 1; i++){
                shakeAnimation(shakeObj[i], 3, 0.1, 1.0, true);
            }
        }

        if(winkObj.length !== 0){
            for(var i=0; i<=winkObj.length - 1; i++){
                var winkObjBox = winkObj[i].getBBox();
                winkAnimation(winkObj[i], winkObjBox, 0.1, 0.5, 2.0, true);
            }
        }
    });

    var clearID = function(targetArray){
        for(var i=0; i<=targetArray.length-1; i++){
            var id = targetArray[i].attr('id');
            if(id !== undefined && id !== null && id !== ''){
                var repId = id.replace(/_.*_/, "");
                targetArray[i].attr({id:''});
                targetArray[i].attr({class:repId});
            }
        }
    };

    /* -----------------------------------
        mouseMove Animation
    ----------------------------------- */

    var updateOffset = function(){
        var bound = eventElement.getBoundingClientRect();
        width = bound.width;
        height = bound.height;
        offset = {x:bound.left, y:bound.top};
    };

    var mouseMove = function(event){
        var x = event.clientX;
        var y = event.clientY;
        mouse.x = ((clamp(x-offset.x, 0, width) - (width/2)) / (width/2)) * coefficient;
        mouse.y = ((clamp(y-offset.y, 0, height) - (height/2))/ (height/2)) * coefficient;
        var longTxt = "translate(" + (mouse.x*0.2) + ","+ (mouse.y*0.2) + ")";
        var middleTxt = "translate(" + (mouse.x*0.5) + ","+ (mouse.y*0.5) + ")";
        var shortTxt = "translate(" + (mouse.x) + "," + (mouse.y) + ")";
        if(longObj !== null){
            longObj.node.setAttribute('transform', longTxt);
        }
        if(middleObj !== null){
            middleObj.node.setAttribute('transform', middleTxt);
        }
        if(shortObj !== null){
            shortObj.node.setAttribute('transform', shortTxt);
        }
    };

    var clamp = function(a, b, c){
        return a < b ? b : (a > c ? c : a);
    };

    /* -----------------------------------
     parts Animation
     ----------------------------------- */

    var sinMoveAnimation = function(targetObj, scale, moveTime){
        var animObj = {progress: 0};
        TweenLite.to(animObj, moveTime, {
            progress: 1,
            ease: Linear.easeNone,
            onUpdate: function(){
                var nowRotate = (360*animObj.progress) * Math.PI / 180;
                var sinTxt = 'translate(0,'+scale*Math.sin(nowRotate)+')';
                targetObj.node.setAttribute('transform', sinTxt);
            },
            onComplete: function(){
                sinMoveAnimation(targetObj, scale, moveTime);
            }
        });
    };

    var cosMoveAnimation = function(targetObj, scale, moveTime){
        var animObj = {progress: 0};
        TweenLite.to(animObj, moveTime, {
            progress: 1,
            ease: Linear.easeNone,
            onUpdate: function(){
                var nowRotate = ((360*animObj.progress)+90) * Math.PI / 180;
                var cosTxt = 'translate('+scale*Math.cos(nowRotate)+',0)';
                targetObj.node.setAttribute('transform', cosTxt);
            },
            onComplete: function(){
                cosMoveAnimation(targetObj, scale, moveTime);
            }
        });
    };

    var shakeAnimation = function(targetObj, move, shakeTime, delayTime, isFirst){
        var delayT;
        if(isFirst){delayT = 0;} else {delayT = delayTime;}
        var animObj = {progress: 0};
        TweenLite.to(animObj, shakeTime, {
            progress: 1,
            delay: delayT,
            ease: Cubic.easeInOut,
            onUpdate: function(){
                var shakeTxt = 'translate(0,'+move*animObj.progress+')';
                targetObj.node.setAttribute('transform', shakeTxt);
            },
            onComplete: function(){
                targetObj.node.setAttribute('transform', 'translate(0,0)');
                shakeAnimation(targetObj, move, shakeTime, delayTime, false);
            }
        });
    };

    var winkAnimation = function(targetObj, targetObBox, scale, winkTime, delayTime, isFirst){
        var delayT;
        if(isFirst){delayT = 0;} else {delayT = delayTime;}
        var animObj = {progress: scale};
        TweenLite.to(animObj, winkTime, {
            progress: 1,
            delay: delayT,
            ease: Cubic.easeInOut,
            onUpdate: function(){
                var scaleTxt = 'scale(1,' + animObj.progress + ',' + targetObBox.cx + ',' + targetObBox.cy + ')';
                targetObj.transform(scaleTxt);
            },
            onComplete: function(){
                winkAnimation(targetObj, targetObBox, scale, winkTime, delayTime, false);
            }
        });
    };
});