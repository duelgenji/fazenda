/**
 * Created by knight on 2016/12/28.
 */

var current_liquid_level = 0; //当前液体水平面
var current_zIndex = 100; //当前液体水平面

$(document).ready(function() {
    addLiquid(50,"brown");

    setTimeout(function(){
        addLiquid(50,"");
    },5000);
    setTimeout(function(){
        addLiquid(50,"blue");
    },10000);
    setTimeout(function(){
        addLiquid(50,"white");
    },15000);

});

function addLiquid(height,color){
    var h = 50; //液体增长高度
    var c = ""; //液体颜色
    var $pour = $('.pour'); //液柱
    var $bottle = $('#bottle'); //杯子
    if(height){
        h = height;
    }
    if(color){
        c = color;
    }

    var basic_delay = 1000;
    $pour.addClass(c);
    $pour.css({
        marginTop:"0px"
    });
    $pour //Pour Me Another Drink, Bartender!
        .delay(basic_delay)
        .animate({
            height: '360px'
        }, basic_delay + 500)
        .delay(basic_delay)
        .animate({
            height: '0px',
            marginTop:"360px"
        },function(){
            $pour.removeClass(c);
        });



    $bottle.append('<div class="liquid '+c+'"></div>');
    var liquid = $bottle.find(".liquid:last");
    liquid.css({
        height:current_liquid_level,
        zIndex:current_zIndex--
    });
    liquid // I Said Fill 'Er Up!
        .delay(basic_delay + 1400)
        .animate({
            height: current_liquid_level + h + 'px'
        }, basic_delay + 500);

    $('.beer-foam') // Keep that Foam Rollin' Toward the Top! Yahooo!
        .delay(basic_delay + 1400)
        .animate({
            bottom: current_liquid_level + h + 20 + 'px'
        }, basic_delay + 500);
    current_liquid_level = current_liquid_level + h;
}