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
    // vessel.fillSpeed = 0.5;
    vessel.colorMix = true;
    this.setData({
      canvasWidth: vessel.ctxWidth + "px",
      canvasHeight: vessel.ctxHeight + "px"
    });
  },
  onReady: function () {
    // 页面渲染完成
    vessel.start();
    setTimeout(function () {
      vessel.addLiquid({
        color: 'rgba(255,0,255,0.2)',
        height: 80
      }, function () {
        vessel.addLiquid({
          color: '#999999',
          height: 75,
          position: -40
        }, function () {
          vessel.stop();
        }).addLiquid({
          color: '#00FF00',
          height: 60,
          position: 30
        });
      });
    }, 500);
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})