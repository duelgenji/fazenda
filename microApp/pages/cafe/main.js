// pages/cafe/main.js

var vessel = null;

Page({
  data: {
    canvasWidth: "1000px",
    canvasHeight: "300px"
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数

    // TODO 分析 options 选择容器
    var profile = 'cup';

    vessel = require('vessel.js')(profile);
    // vessel.backgroundColor = "#FFFFFF";
    // vessel.strokeWidth = 5;   // 器皿壁厚
    // vessel.strokeColor = '#000000'; // 器皿边框颜色
    // vessel.colorMix = true;   // 是否混合颜色，false为分层
    vessel.fillSpeed = 50;    // 液面上升速度(每秒)
    vessel.pourSpeed = 300;   // 液体加入速度(每秒)
    vessel.pourWidth = 30;    // 加入液柱宽度
    vessel.pourCircleHeight = 20;
    vessel.FPS = 60;          // 刷新帧率
    vessel.enableWaves = true; // 是否启用液面波动

    this.setData({
      canvasWidth: vessel.ctxWidth + "px",
      canvasHeight: vessel.ctxHeight + "px"
    });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    vessel.reset();
    vessel.start();
    setTimeout(function () {
      vessel.addLiquid({
        color: 'rgba(255,0,0,0.2)',
        height: 30
      }, function () {
        vessel.addLiquid({
          color: 'rgba(102,51,0,0.8)',
          height: 60
        }, function () {
          vessel.addLiquid({
            color: '#996633',
            height: 75,
            position: -40
          });
          setTimeout(function () {
            vessel.addLiquid({
              color: '#DDDDDD',
              height: 60,
              position: 30
            });
          }, 200);
        });
      });
    }, 500);

  },
  onHide: function () {
    // 页面隐藏
    vessel.stop();
  },
  onUnload: function () {
    // 页面关闭
  }
})