//index.js
//获取应用实例
var ajax = require("../../ajax/ajax.js")
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: null,
    hasUserInfo: false
  },

  onLoad: function () {
    var that = this
    //定义一个跨界面传参数的函数，也作为onload先执行的标志。
    app.userInfoReadyCallback = res => {
      if (res) {
              console.log(res)
              app.globalData.userInfo = res;
              this.setData({
                userInfo: res,
                hasUserInfo: true
              })
      }
    }
    //如果已经设置好app的全局userInfo，则执行该段，设置界面的userInfo。
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },

  iamstudent: () => {
    wx.redirectTo({
      url: '../bdxsxx/bdxsxx',
    })
  },
  iamteacher: () => {
    wx.redirectTo({
      url: '../bdlsxx/bdlsxx',
    })
  }
})