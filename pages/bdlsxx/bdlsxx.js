// pages/bdxsxx/bdxsxx.js
var ajax = require("../../ajax/ajax.js")
var app = getApp()
Page({
  data: {
    openid: null,
    userInfo: null
  },
  onLoad: function () {
    new app.ToastPannnel.ToastPannnel()

  },
  getUserInfo: function (e) {
    if (e.detail.rawData) {
      var info = JSON.parse(e.detail.rawData)

      if (info.gender == 1) {
        info.gender = "男"
      } else if (info.gender == 0) {
        info.gender = "女"
      } else {
        info.gender = "未知"
      }
      this.setData({
        userInfo: info,
        openid: app.globalData.openid
      })
      
    } else {
      this.show("用户信息授权失败，请重新授权！")
    }
  },
  formSubmit: function (e) {
    if (!e.detail.value.name || !e.detail.value.id) {
      this.show("请完善用户信息！！")
      return
    }
    if (!e.detail.value.headurl) {
      this.show("请先授权用户信息！")
      return
    }

    if (e.detail.value.id.length==10){
      this.show("你的工号错误格式！")
      return
    }
    app.globalData.userInfo = e.detail.value
    ajax.ajax({
      data: e.detail.value,
      url: "/user/updateWXUser",
      success: res => {
        if (res.data.state != 200) {
          this.show(res.data.message)
        }else{
          wx.showToast({
            title: '绑定账号成功',
            success: () => {
              setTimeout(() => {
                wx.switchTab({
                  url: '../usercenter/usercenter',
                })
              }, 2000)
            }
          })
        }
      },
      fail: () => {
        this.show("网络异常！")
      }
    })
  },
  onPullDownRefresh:()=>{
    wx.stopPullDownRefresh()
  }
})