/****************config****************/
const ctxPadding = 10;  // 画布padding
const ctxWidth = 1000;  // 画布去padding后宽
const ctxHeight = 1000; // 画布去padding后高
const strokeWidth = 5;  // 器皿壁厚
const strokeColor = '#000'; // 器皿颜色
const colorMix = true;  // 是否混合颜色，false为分层

/*图形上下文*/
const ctx = document.getElementById('canvas').getContext('2d');
/*离屏canvas 用于制作液体图片*/
const offCtx = document.getElementById('offCanvas').getContext('2d');

/*液体数组*/
var liquids = [];

/*勾勒容器轮廓*/
function createVesselPath(context) {
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(ctxWidth, 0);
    context.bezierCurveTo(ctxWidth, ctxHeight, ctxWidth, ctxHeight, ctxWidth / 2.0, ctxHeight);
    context.bezierCurveTo(0, ctxHeight, 0, ctxHeight, 0, 0);
    context.closePath();
}

/*初始化*/
init();

/*******************/

/****************action****************/

setTimeout(function () {
    addLiquid({
        color: '#630',
        height: 200
    });
}, 500);

setTimeout(function () {
    addLiquid({
        color: '#999',
        height: 150
    });
}, 2000);

setTimeout(function () {
    addLiquid({
        color: '#0F0',
        height: 100
    });
}, 4000);

/*******************/

/****************method****************/
function init() {
    ctx.canvas.width = ctxWidth + ctxPadding * 2;
    ctx.canvas.height = ctxHeight + ctxPadding * 2;
    ctx.translate(ctxPadding, ctxPadding);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'miter';

    offCtx.canvas.width = ctxWidth + ctxPadding * 2;
    offCtx.canvas.height = ctxHeight + ctxPadding * 2;

    setTimeout(redraw, 0);
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
    if (r.length < 2) result += "0"; result += r;
    if (g.length < 2) result += "0"; result += g;
    if (b.length < 2) result += "0"; result += b;
    return result;
}

/*action*/
function addLiquid(liquid) {
    const height = liquid.height;
    liquid.height = 0;
    liquids.push(liquid);
    function animate() {
        if (height > liquid.height) {
            liquid.height += 8;
            redraw();
            setTimeout(function () {
                animate();
            }, 10);
        }
    }

    animate();
}

var shouldRedraw = false;
function redraw() {
    if (shouldRedraw == false) {
        shouldRedraw = true;
        setTimeout(function () {
            clear();
            if (colorMix) {
                drawLiquid(mixedColor(), topHeightForLiquid(liquids.length - 1));
            } else {
                for (var i = liquids.length - 1; i >= 0; i--) {
                    drawLiquid(liquids[i].color, topHeightForLiquid(i));
                }
            }
            drawVessel();
            shouldRedraw = false;
        }, 10);
    }
}

function clear() {
    ctx.clearRect(0, 0, ctxWidth + ctxPadding * 2, ctxHeight + ctxPadding * 2);
}

function drawVessel() {
    ctx.save();
    createVesselPath(ctx);
    ctx.stroke();
    ctx.restore();
}

function drawLiquid(color, height) {
    offCtx.save();
    offCtx.fillRect(0, ctxHeight + ctxPadding - height, ctxWidth + ctxPadding * 2, height);
    createVesselPath(offCtx);
    offCtx.globalCompositeOperation = 'source-in';
    offCtx.fillStyle = color;
    offCtx.fill();
    offCtx.restore();

    var image = new Image();
    image.src = offCtx.canvas.toDataURL('image/png');
    ctx.drawImage(image, 0, 0, ctxWidth, ctxHeight, 0, 0, ctxWidth, ctxHeight);

    offCtx.clearRect(0, 0, ctxWidth + ctxPadding * 2, ctxHeight + ctxPadding * 2);
}

/*******************/
