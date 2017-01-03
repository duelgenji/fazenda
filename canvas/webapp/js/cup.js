
const ctxWidth  = 1000; // 画布宽
const ctxHeight = 1000; // 画布高

/*勾勒容器轮廓*/
function createVesselPath(context) {
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(ctxWidth, 0);
    context.bezierCurveTo(ctxWidth, ctxHeight, ctxWidth, ctxHeight, ctxWidth / 2.0, ctxHeight);
    context.bezierCurveTo(0, ctxHeight, 0, ctxHeight, 0, 0);
    context.closePath();
}
