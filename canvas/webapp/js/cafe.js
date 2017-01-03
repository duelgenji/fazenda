
const ctx = document.getElementById('canvas').getContext('2d');
const padding = 10;
ctx.translate(padding,padding);
ctx.strokeStyle = '#000';
ctx.lineWidth = 5;
ctx.lineCap = 'round';
ctx.lineJoin = 'miter';

function createVesselPath() {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(1000, 0);
    ctx.bezierCurveTo(1000, 1000, 1000, 1000, 500, 1000);
    ctx.bezierCurveTo(0, 1000, 0, 1000, 0, 0);
    ctx.closePath();
}

var liquidHeight = 500;

redraw();
animate();

/*private*/
function redraw() {
    clear();
    drawLiquid('red', liquidHeight);
    drawVessel();
}

function clear() {
    ctx.clearRect(0, 0, 1000 + padding * 2, 1000 + padding * 2);
}

function drawVessel() {
    ctx.save();
    createVesselPath();
    ctx.stroke();
    ctx.restore();
}

function drawLiquid(color, height) {
    ctx.save();
    ctx.fillRect(0, 1000 + padding - height, 1000 + padding * 2, height);
    createVesselPath();
    ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}

function animate() {
    if (liquidHeight < 0) return;
    liquidHeight -= 8;
    redraw();
    setTimeout(function () {
        animate();
    }, 10);
}
