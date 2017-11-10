// pages/setting/setting.js
var ajax=require("../../ajax/ajax.js")
var app=getApp()
Page({

  data: {
    userInfo:null
  },

  onLoad: function (options) {

    this.setData({
      userInfo: app.globalData.userInfo
    })
  }
})