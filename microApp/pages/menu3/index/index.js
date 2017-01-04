//index.js
//获取应用实例
var app = getApp()

const ctxWidth  = 280; // 画布宽
const ctxHeight = 205; // 画布高

/*勾勒容器轮廓*/
function createVesselPath(context) {
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(ctxWidth, 0);
    context.bezierCurveTo(ctxWidth, ctxHeight, ctxWidth, ctxHeight, ctxWidth / 2.0, ctxHeight);
    context.bezierCurveTo(0, ctxHeight, 0, ctxHeight, 0, 0);
    context.closePath();
}

const ctxPadding = ctxWidth / 10;  //画布padding

function Vessel() {
    const that = this;

    /*liquid图形上下文*/
    const liquidCtx = wx.createCanvasContext('liquidCtx')
    /*vessel图形上下文*/
    const vesselCtx = wx.createCanvasContext('vesselCtx')
    /*液体数组*/
    var liquids = [];

    this.strokeWidth = 5;      // 器皿壁厚
    this.strokeColor = '#000'; // 器皿边框颜色
    this.colorMix    = false;  // 是否混合颜色，false为分层
    this.fillSpeed   = 5;      // 每10毫秒上升高度

    this.addLiquid = function(liquid, callback) {
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

    /****************method****************/
    function init() {
      // console.log(liquidCtx.canvas);
        // liquidCtx.canvas.width = ctxWidth + ctxPadding * 2;
        // liquidCtx.canvas.height = ctxHeight + ctxPadding * 2;
        liquidCtx.translate(ctxPadding, ctxPadding);
        liquidCtx.save();

        vesselCtx.setLineCap('round');
        vesselCtx.setLineJoin('miter');
        // vesselCtx.canvas.width = ctxWidth + ctxPadding * 2;
        // vesselCtx.canvas.height = ctxHeight + ctxPadding * 2;
        vesselCtx.setStrokeStyle(that.strokeColor);
        vesselCtx.setLineWidth(that.strokeWidth);
        vesselCtx.translate(ctxPadding, ctxPadding);
        vesselCtx.save();

        redrawVessel();
        redrawLiquid();
    }

    /*draw vessel*/
    function redrawVessel() {
        vesselCtx.save();
        createVesselPath(vesselCtx);
        vesselCtx.stroke();
        vesselCtx.restore();
        vesselCtx.draw();
    }

    /*draw liquid*/
    var shouldRedraw = false;
    function redrawLiquid () {
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
                clipLiquid();
                liquidCtx.draw();
                shouldRedraw = false;
            }, 10);
        }
    }

    function clearLiquid() {
        liquidCtx.clearRect(0, 0, ctxWidth + ctxPadding * 2, ctxHeight + ctxPadding * 2);
    }

    function drawLiquid(color, topHeight, height) {
        liquidCtx.save();
        liquidCtx.globalCompositeOperation = 'source-over';
        liquidCtx.fillStyle = color;
        liquidCtx.fillRect(0, ctxHeight + ctxPadding - topHeight, ctxWidth + ctxPadding * 2, height);
        liquidCtx.restore();
    }

    function clipLiquid() {
        liquidCtx.save();
        liquidCtx.globalCompositeOperation = 'destination-in';
        createVesselPath(liquidCtx);
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




Page({
  //事件处理函数
  onLoad: function () {
  

    var vessel = new Vessel();
vessel.strokeColor = "red";
vessel.colorMix = true;

setTimeout(function () {
    vessel.addLiquid({
        color: '#630',
        height: 200
    }, function () {
        vessel.addLiquid({
            color: '#999',
            height: 150
        }).addLiquid({
            color: '#0F0',
            height: 100
        });
    });
}, 500);

  }
})
