$(document).ready(function () {

    var profile_path = 'files/profile_cup.html';
    var colors = ['#630', '#00F', '#999'];
    var heights = [40, 70, 100];
    var liquidHeight = 0;

    setupPour();
    setupVessel();

    setTimeout(function () {
        pourLiquid(colors[0], heights[0]);
    }, 500);
    setTimeout(function () {
        pourLiquid(colors[1], heights[1]);
    }, 2500);
    setTimeout(function () {
        pourLiquid(colors[2], heights[2]);
    }, 4000);

    /*******private*******/
    function setupPour() {
        $('#pour').css("margin-bottom", "10px");
    }

    function setupVessel() {
        var vessel = $($('#template_vessel').html());
        vessel.find('svg').load(profile_path);
        vessel.find('svg').attr("stroke", "#000");
        $("#vessel").append(vessel);
    }

    function pourLiquid(color, height) {
        var $pour = $($('#template_pour').html());
        $('#pour').prepend($pour);

        var duration = (height - liquidHeight) * 30;
        var pourTime = 1500;

        $pour.css("background-color", color)
            .animate({
                top: '0',
                bottom: '0'
            }, {
                duration: pourTime,
                easing : 'linear',
                queue : false,
                complete: function () {
                    var $liquid = $($('#template_liquid').html());
                    $liquid.css("height", liquidHeight + "px");
                    $liquid.find('svg').attr("fill", color);
                    $liquid.find('svg').load(profile_path);
                    $('#liquid').prepend($liquid);

                    $liquid.animate({
                        height: height + "px"
                    }, {
                        duration: duration,
                        easing : 'linear',
                        queue : false,
                        complete: function () {
                            liquidHeight = height;
                        }
                    });
                }
            });
        setTimeout(function () {
            $pour.animate({
                top: '100%'
            }, {
                duration: pourTime,
                easing : 'linear',
                queue : false,
                complete: function () {
                    $pour.remove();
                }
            });

        }, duration);
    }
});
