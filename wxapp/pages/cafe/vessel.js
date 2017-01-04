
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
    /*液体数组*/
    var liquids = [];

    this.strokeWidth = 5;      // 器皿壁厚
    this.strokeColor = '#000000'; // 器皿边框颜色
    this.colorMix = false;  // 是否混合颜色，false为分层
    this.fillSpeed = 5;      // 每10毫秒上升高度

    this.reset = function () {
        liquids = [];
        redrawVessel();
        redrawLiquid();
    }

    this.addLiquid = function (liquid, callback) {

        const height = liquid.height;
        liquid.height = 0;
        liquids.push(liquid);
        function animate() {
            if (height > liquid.height) {
                liquid.height += that.fillSpeed;
                redrawLiquid();
                setTimeout(function () {
                    animate();
                }, 10);
            } else if (callback) {
                callback();
            }
        }
        animate();
        return this;
    };


    /*初始化*/
    setTimeout(init, 0);
    function init() {
        vesselCtx.setLineCap('round');
        vesselCtx.setLineJoin('miter');
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
        // createClosedVesselPath(vesselCtx);
        vesselCtx.stroke();
        vesselCtx.restore();
        vesselCtx.draw();
    }

    /*draw liquid*/
    var shouldRedraw = false;
    function redrawLiquid() {
        if (shouldRedraw == false) {
            shouldRedraw = true;
            setTimeout(function () {
                clearLiquid();
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
                shouldRedraw = false;
            }, 10);
        }
    }

    function clearLiquid() {
        liquidCtx.clearRect(0, 0, profile.ctxWidth, profile.ctxHeight);
        liquidCtx.draw();
    }

    function drawLiquid(color, topHeight, height) {
        liquidCtx.save();
        liquidCtx.translate(ctxPadding, ctxPadding);
        // liquidCtx.setGlobalCompositeOperation('source-over');
        liquidCtx.setFillStyle(color);
        liquidCtx.fillRect(0, profile.ctxHeight - topHeight, profile.ctxWidth, height);
        liquidCtx.restore();
    }

    function clipLiquid() {
        liquidCtx.save();
        liquidCtx.translate(ctxPadding, ctxPadding);
        // liquidCtx.setGglobalCompositeOperation('destination-in');
        createClosedVesselPath(liquidCtx);
        liquidCtx.fill();
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
        if (liquids.length == 0) return "#000";
        var r = 0, g = 0, b = 0;
        var height = 0;
        for (var idx in liquids) {
            if (liquids.hasOwnProperty(idx)) {
                var liquid = liquids[idx];
                var c = liquid.color;
                var h = liquid.height;
                if (/^(rgb|RGB)/.test(c)) {
                    var aColor = c.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
                    r += aColor[0] * h;
                    g += aColor[1] * h;
                    b += aColor[2] * h;
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
                }
                height += h;
            }
        }
        r = parseInt(r / height).toString(16);
        g = parseInt(g / height).toString(16);
        b = parseInt(b / height).toString(16);
        var result = "#";
        if (r.length < 2) result += "0";
        result += r;
        if (g.length < 2) result += "0";
        result += g;
        if (b.length < 2) result += "0";
        result += b;
        return result;
    }
}