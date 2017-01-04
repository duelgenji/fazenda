function toast(msg){
    if(!msg)
        msg = "成功";
    wx.showToast({
        title:msg.toString()
    });
}

module.exports = {
  toast: toast
}