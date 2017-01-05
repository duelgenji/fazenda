
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
    this.fillSpeed = 50;    // 液面上升速度(每秒)
    this.pourSpeed = 300;   // 液体加入速度(每秒)
    this.pourWidth = 30;    // 加入液柱宽度
    this.pourCircleHeight = 20;
    this.FPS = 60;          // 刷新帧率
    this.enableWaves = true; // 是否启用液面波动

    var timer = null;
    this.start = function () {
        redrawVessel();
        timer = setTimeout(function () {
            updateWaves();
            redrawPour();
            redrawLiquid();
            that.start();
        }, 1000 / that.FPS);
    }

    this.stop = function () {
        clearTimeout(timer);
    }

    this.reset = function () {
        liquids = [];
        pours = [];
        redrawVessel();
        redrawPour();
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
            var end = false;
            function pourTop() {
                if (pour.top <= pour.bottom + that.pourCircleHeight * 2) {
                    pour.top += that.pourSpeed / that.FPS;
                    setTimeout(function () {
                        pourTop();
                    }, 1000 / that.FPS);
                } else {
                    end = true;
                }
            }
            function pourBottom() {
                if (topHeightForLiquid(liquids.length - 1) + pour.bottom < profile.ctxHeight) {
                    pour.bottom += that.pourSpeed / that.FPS;
                    setTimeout(function () {
                        pourBottom();
                    }, 1000 / that.FPS);
                } else if (liquids.length > 1) {
                    xx = Math.floor((waveNum - 2) * (0.5 + (pour.position ? pour.position : 0) / profile.ctxWidth)) + 1;
                    diffPt[xx] = 1000;

                    function ccc() {
                        if (end) return;
                        diffPt[xx] = 1000;
                        setTimeout(function () {
                            ccc();
                        }, 1000 / that.FPS);
                    }
                }
            }
            pourBottom();
            setTimeout(pourTop, (duration + deltaTime) * 1000);
        }

        function fillLiquid() {
            if (height > liquid.height) {
                liquid.height += that.fillSpeed / that.FPS;
                setTimeout(function () {
                    fillLiquid();
                }, 1000 / that.FPS);
            } else if (callback) {
                callback();
            }
        }

        pourLiquid();
        setTimeout(fillLiquid, delayTime * 1000);
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
        coverLiquid();
        vesselCtx.save();
        vesselCtx.translate(ctxPadding, ctxPadding);
        profile.createVesselPath(vesselCtx);
        vesselCtx.stroke();
        vesselCtx.restore();
        vesselCtx.draw();
    }

    function coverLiquid() {
        vesselCtx.save();
        vesselCtx.translate(ctxPadding, ctxPadding);
        profile.coverLiquidPath(vesselCtx);
        vesselCtx.setFillStyle("#FFFFFF");
        vesselCtx.fill();
        vesselCtx.restore();
    }

    /*draw pour*/
    var shouldRedrawPour = false;
    function redrawPour() {
        for (var i = 0; i < pours.length; i++) {
            drawPour(pours[i].top, pours[i].bottom, pours[i].color, pours[i].position);
        }
        pourCtx.draw();
    }

    function drawPour(top, bottom, color, position) {
        top -= that.pourCircleHeight;
        bottom += that.pourCircleHeight;
        if (top > bottom) return;
        bottom = Math.min(bottom, profile.ctxHeight - topHeightForLiquid(liquids.length - 1) + that.pourCircleHeight);
        if (top > bottom) return;
        if (!position) position = 0;

        var topCircleRoot = top + that.pourCircleHeight;
        var bottomCircleRoot = bottom - that.pourCircleHeight;

        if (topCircleRoot > bottomCircleRoot) {
            topCircleRoot = (topCircleRoot + bottomCircleRoot) / 2.0;
            bottomCircleRoot = topCircleRoot;
        }
        
        pourCtx.save();
        pourCtx.translate(ctxPadding, ctxPadding);
        pourCtx.setFillStyle(color);
        pourCtx.beginPath();
        pourCtx.moveTo((that.ctxWidth - that.pourWidth) / 2.0 + position, topCircleRoot);
        pourCtx.lineTo((that.ctxWidth - that.pourWidth) / 2.0 + position, bottomCircleRoot);
        pourCtx.bezierCurveTo((that.ctxWidth - that.pourWidth) / 2.0 + position, bottom, (that.ctxWidth + that.pourWidth) / 2.0 + position, bottom, (that.ctxWidth + that.pourWidth) / 2.0 + position, bottomCircleRoot);
        pourCtx.lineTo((that.ctxWidth + that.pourWidth) / 2.0 + position, topCircleRoot);
        pourCtx.bezierCurveTo((that.ctxWidth + that.pourWidth) / 2.0 + position, top, (that.ctxWidth - that.pourWidth) / 2.0 + position, top, (that.ctxWidth - that.pourWidth) / 2.0 + position, topCircleRoot);
        pourCtx.closePath();
        pourCtx.fill();
        pourCtx.restore();
    }

    /*draw liquid*/
    var shouldRedrawLiquid = false;
    function redrawLiquid() {
        if (that.colorMix) {
            drawLiquid(mixedColor(), topHeightForLiquid(liquids.length - 1), topHeightForLiquid(liquids.length - 1));
        } else {
            for (var i = liquids.length - 1; i >= 0; i--) {
                drawLiquid(liquids[i].color, topHeightForLiquid(i), liquids[i].height);
            }
        }
        liquidCtx.draw();
    }

    function drawLiquid(color, topHeight, height) {
        liquidCtx.save();
        liquidCtx.translate(ctxPadding, ctxPadding + profile.ctxHeight - topHeight);
        liquidCtx.setFillStyle(color);
        liquidCtx.beginPath();
        liquidCtx.moveTo(0, 0);
        if (that.enableWaves) {
            for (var i = 1; i < waves.length; i++)
                liquidCtx.lineTo(waves[i].x, waves[i].y);
        } else {
            liquidCtx.lineTo(profile.ctxWidth, 0);
        }
        liquidCtx.lineTo(profile.ctxWidth, height);
        liquidCtx.lineTo(0, height);
        liquidCtx.closePath();
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

    /*waves*/
    var waves = [];
    var diffPt = [];
    const waveNum = 250;
    for (var i = 0; i < waveNum; i++) {
        waves[i] = new wave(profile.ctxWidth * i / (waveNum - 1));
        diffPt[i] = 0;
    }

    var xx = 0;
    var dd = 5;

    function wave(x) {
        var friction = 0.05;
        var deceleration = 0.9;

        this.vy = 0;
        this.x = x;
        this.y = 0;
        this.update = function (target) {
            this.vy += target - this.y
            this.y += this.vy * friction;
            this.vy *= deceleration;
        }
    }

    function updateWaves() {
        var diff = diffPt[xx] * 0.05;
        if (Math.abs(diff) < 0.001) diff = 0;
        diffPt[xx] = diff;
        //左侧
        //差分，使得每个点都是上一个点的下一次的解，由于差分函数出来的解是一个曲线，且每次迭代后，曲线相加的结果形成了不断地波浪
        for (var i = xx - 1; i > 0; i--) {
            var d = xx - i;
            if (d > dd) d = dd;
            diffPt[i] -= (diffPt[i] - diffPt[i + 1]) * (1 - 0.01 * d);
        }
        //右侧
        for (var i = xx + 1; i < waveNum; i++) {
            var d = i - xx;
            if (d > dd) d = dd;
            diffPt[i] -= (diffPt[i] - diffPt[i - 1]) * (1 - 0.01 * d);
        }

        //更新点Y坐标
        for (var i = 0; i < waveNum; i++) {
            waves[i].update(diffPt[i]);
        }
    }
}