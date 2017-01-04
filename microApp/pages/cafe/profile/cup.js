
var profile = {
    ctxWidth: 300,
    ctxHeight: 250,
    createVesselPath: function (context) {
        const ctxWidth = profile.ctxWidth;
        const ctxHeight = profile.ctxHeight;

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(ctxWidth, 0);
        context.bezierCurveTo(ctxWidth, ctxHeight, ctxWidth, ctxHeight, ctxWidth / 2.0, ctxHeight);
        context.bezierCurveTo(0, ctxHeight, 0, ctxHeight, 0, 0);
        context.closePath();
    },
    coverLiquidPath: function (context) {
        const ctxWidth = profile.ctxWidth;
        const ctxHeight = profile.ctxHeight;

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(ctxWidth, 0);
        context.bezierCurveTo(ctxWidth, ctxHeight, ctxWidth, ctxHeight, ctxWidth / 2.0, ctxHeight);
        context.bezierCurveTo(0, ctxHeight, 0, ctxHeight, 0, 0);
        context.lineTo(0, 0);
        context.lineTo(0, ctxHeight);
        context.lineTo(ctxWidth, ctxHeight);
        context.lineTo(ctxWidth, 0);
        context.lineTo(0, 0);
        context.closePath();
    }
}

module.exports = profile;
