// pages/setting/setting.js
var ajax = require("../../ajax/ajax.js")
var app = getApp()
Page({

  data: {
    userInfo: null,
    animationbgim: {}
  },
  onShow: function () {
    if (app.globalData.userInfo && !this.data.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    var n = 1
    setInterval(() => {
      animation.scale(n, n).step()
      if (n == 1) {
        n = 0.97
      } else {
        n = 1
      }
      this.setData({
        animationbgim: animation.export()
      })
    }, 1000)
  },
  tap: function () {
    this.show("开发中，苏州大学wakeup俱乐部")
  },
  tapabout: function () {
    wx.navigateTo({
      url: '../about/about',
    })
  },
  tapfeedback: function () {
    wx.navigateTo({
      url: '../feedback/feedback',
    })

  },
  onLoad: function (options) {

    this.setData({
      userInfo: app.globalData.userInfo
    })
    new app.ToastPannnel.ToastPannnel()
  },
  onPullDownRefresh: function () {

    if (!app.globalData.userInfo) {
      this.show('更新数据失败，用户未登录！')
      wx.stopPullDownRefresh()
      return
    }
    this.setData({
      userInfo: app.globalData.userInfo
    })
    wx.stopPullDownRefresh()
  }
})