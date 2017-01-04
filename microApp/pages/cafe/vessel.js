
const ctxPadding = 10;  //画布padding

module.exports = function (profile) {
    return new Vessel(profile);
};

function Vessel(profile) {
    const that = this;

    var profile = require('profile/' + profile + '.js');
    this.ctxWidth = profile.ctxWidth + ctxPadding * 2; // 画布宽;
    this.ctxHeight = profile.ctxHeight + ctxPadding * 2; // 画布高;

    /*liquid图形上下文*/
    const liquidCtx = wx.createCanvasContext('liquid');
    /*vessel图形上下文*/
    const vesselCtx = wx.createCanvasContext('vessel');
    /*pour图形上下文*/
    const pourCtx = wx.createCanvasContext('pour');
    /*液体数组*/
    var liquids = [];
    var pours = [];

    this.strokeWidth = 5;   // 器皿壁厚
    this.strokeColor = '#000000'; // 器皿边框颜色
    this.colorMix = false;  // 是否混合颜色，false为分层
    this.fillSpeed = 0.5;   // 每10毫秒上升高度
    this.pourSpeed = 3.0;   // 每10毫秒液体加入速度
    this.pourWidth = 30;    // 加入液柱宽度

    this.reset = function () {
        liquids = [];
        redrawVessel();
        redrawLiquid();
    }

    this.addLiquid = function (liquid, callback) {
        const height = liquid.height;
        liquid.height = 0;
        liquids.push(liquid);
        var pour = {
            top: 0,
            bottom: 0,
            color: liquid.color,
            position: liquid.position
        }
        pours.push(pour);
        const duration = height / that.fillSpeed;
        const deltaTime = height / that.pourSpeed;
        const delayTime = (profile.ctxHeight - topHeightForLiquid(liquids.length - 1)) / that.pourSpeed;
        function pourLiquid() {
            function pourTop() {
                if (pour.top <= + pour.bottom) {
                    pour.top += that.pourSpeed;
                    redrawPour();
                    setTimeout(function () {
                        pourTop();
                    }, 10);
                }
            }
            function pourBottom() {
                if (topHeightForLiquid(liquids.length - 1) + pour.bottom < profile.ctxHeight) {
                    pour.bottom += that.pourSpeed;
                    redrawPour();
                    setTimeout(function () {
                        pourBottom();
                    }, 10);
                }
            }
            pourBottom();
            setTimeout(pourTop, (duration + deltaTime) * 10);
        }

        function fillLiquid() {
            if (height > liquid.height) {
                liquid.height += that.fillSpeed;
                redrawLiquid();
                setTimeout(function () {
                    fillLiquid();
                }, 10);
            } else if (callback) {
                callback();
            }
        }

        pourLiquid();
        setTimeout(fillLiquid, delayTime * 10);
        return this;
    };


    /*初始化*/
    setTimeout(init, 0);
    function init() {
        vesselCtx.setLineCap('round');
        vesselCtx.setLineJoin('round');
        vesselCtx.setStrokeStyle(that.strokeColor);
        vesselCtx.setLineWidth(that.strokeWidth);
        that.reset();
    }

    /****************method****************/
    /*draw vessel*/
    function redrawVessel() {
        vesselCtx.save();
        vesselCtx.translate(ctxPadding, ctxPadding);
        profile.createVesselPath(vesselCtx);
        vesselCtx.stroke();
        vesselCtx.restore();
        vesselCtx.draw();
    }

    /*draw pour*/
    var shouldRedrawPour = false;
    function redrawPour() {
        if (shouldRedrawPour == false) {
            shouldRedrawPour = true;

            setTimeout(function () {
                for (var i = 0; i < pours.length; i++) {
                    drawPour(pours[i].top, pours[i].bottom, pours[i].color, pours[i].position);
                }
                pourCtx.draw();
                shouldRedrawPour = false;
            }, 10)
        }
    }

    function drawPour(top, bottom, color, position) {
        if (top > bottom) return;
        bottom = Math.min(bottom, profile.ctxHeight - topHeightForLiquid(liquids.length - 1));
        if (top > bottom) return;
        if (!position) position = 0;
        pourCtx.save();
        pourCtx.translate(ctxPadding, ctxPadding);
        pourCtx.setFillStyle(color);
        pourCtx.fillRect((that.ctxWidth - that.pourWidth) / 2.0 + position, top, that.pourWidth, bottom - top);
        pourCtx.restore();
    }

    /*draw liquid*/
    var shouldRedrawLiquid = false;
    function redrawLiquid() {
        if (shouldRedrawLiquid == false) {
            shouldRedrawLiquid = true;
            redrawPour();
            setTimeout(function () {
                if (that.colorMix) {
                    drawLiquid(mixedColor(), topHeightForLiquid(liquids.length - 1), topHeightForLiquid(liquids.length - 1));
                } else {
                    for (var i = liquids.length - 1; i >= 0; i--) {
                        drawLiquid(liquids[i].color, topHeightForLiquid(i), liquids[i].height);
                    }
                }
                // clipLiquid();
                coverLiquid();
                liquidCtx.draw();
                shouldRedrawLiquid = false;
            }, 9);
        }
    }

    function drawLiquid(color, topHeight, height) {
        liquidCtx.save();
        liquidCtx.translate(ctxPadding, ctxPadding);
        liquidCtx.setFillStyle(color);
        liquidCtx.fillRect(0, profile.ctxHeight - topHeight, profile.ctxWidth, height);
        liquidCtx.restore();
    }

    function coverLiquid() {
        liquidCtx.save();
        liquidCtx.translate(ctxPadding, ctxPadding);
        profile.coverLiquidPath(liquidCtx);
        liquidCtx.setFillStyle("#FFFFFF");
        liquidCtx.fill();
        liquidCtx.restore();
    }

    /*private*/
    function topHeightForLiquid(index) {
        var i = Math.min(index, liquids.length - 1);
        var height = 0;
        while (i >= 0) {
            height += liquids[i--].height;
        }
        return height;
    }

    function mixedColor() {
        if (liquids.length == 0) return "#000000";
        var r = 0, g = 0, b = 0, a = 0;
        var height = 0;
        for (var idx in liquids) {
            if (liquids.hasOwnProperty(idx)) {
                var liquid = liquids[idx];
                var c = liquid.color;
                var h = liquid.height;
                if (/^(rgba|RGBA)/.test(c)) {
                    var aColor = c.replace(/(?:\(|\)|rgba|RGBA)*/g, "").split(",");
                    r += aColor[0] * h;
                    g += aColor[1] * h;
                    b += aColor[2] * h;
                    a += aColor[3] * h;
                } else if (/^(rgb|RGB)/.test(c)) {
                    var aColor = c.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
                    r += aColor[0] * h;
                    g += aColor[1] * h;
                    b += aColor[2] * h;
                    a += h;
                } else if (/^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(c)) {
                    var aNum = c.replace(/#/, "").split("");
                    if (aNum.length === 6) {
                        r += parseInt(aNum[0] + aNum[1], 16) * h;
                        g += parseInt(aNum[2] + aNum[3], 16) * h;
                        b += parseInt(aNum[4] + aNum[5], 16) * h;
                    } else if (aNum.length === 3) {
                        r += parseInt(aNum[0] + aNum[0], 16) * h;
                        g += parseInt(aNum[1] + aNum[1], 16) * h;
                        b += parseInt(aNum[2] + aNum[2], 16) * h;
                    }
                    a += h;
                }
                height += h;
            }
        }
        r = parseInt(r / height);
        g = parseInt(g / height);
        b = parseInt(b / height);
        a = parseFloat(a / height).toFixed(3);
        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    }
}