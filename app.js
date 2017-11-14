432//app.js
var ToastPannnel = require("./template/toast/toast.js")
var ajax = require("/ajax/ajax.js");
App({
  ToastPannnel,
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {

        //获取openid
        wx.request({
          data: { code: res.code },
          url: "https://www.ibilidi.cn/getKQOpenid",
          success: res => {
          if(!res.data.openid){
            wx.showModal({
              title: '难过+1',
              content: '未知原因，后台崩了，考勤平台暂时无法使用！😂',
                confirmText:'好的',
                showCancel:false
            })
            return
          }
            this.globalData.openid = res.data.openid

            //获取数据库中的用户信息
            ajax.ajax({
              url: "/user/getUserByOpenid/" + res.data.openid,
              success: res => {
                if (res.data.data&&res.data.data.id.length == 10) {
                  ajax.ajax({
                    url: '/student/getStudentByOpenid/' + this.globalData.openid,
                    success: res => {
                      if (this.userInfoReadyCallback) {
                        this.userInfoReadyCallback(res.data.data)
                      } else{
                        wx.showToast({
                          duration:1000,
                          icon: 'loading',
                          title: '请重新启动',
                          success: setTimeout(() => {
                            this.userInfoReadyCallback(res.data.data)
                          }, 1000)
                        })
                      }
                    }
                  })
                } else if (res.data.data){
                  if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res.data.data)
                  } else {
                    wx.showToast({
                      icon: 'loading',
                      title: '请重新启动',
                      success: setTimeout(()=>{
                        this.userInfoReadyCallback(res.data.data)
                      },1000)
                    })
                  }
                }
              }
            })
          }
        })
      }
    })
  },
  globalData: {
    userInfo: null,
    openid: null
  }
})