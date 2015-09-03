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
    var shortObj,middleObj,longObj;
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

        shortObj = graphic.select('.svg-lange-short');
        middleObj = graphic.select('.svg-lange-middle');
        longObj = graphic.select('.svg-lange-long');
        $window.on('resize.svg', updateOffset).trigger('resize.svg');
        $window.on('mousemove.svg', mouseMove);
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
});