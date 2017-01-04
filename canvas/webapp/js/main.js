
var vessel = new Vessel();
vessel.strokeColor = "green";
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

