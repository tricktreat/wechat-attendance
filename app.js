//app.js
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
          url: "https://www.ibilidi.cn/getOpenid",
          success: res => {
            this.globalData.openid = res.data.openid

            //获取数据库中的用户信息
            ajax.ajax({
              url: "/user/getUserByOpenid/" + res.data.openid,
              success: res => {
                if (res.data.data.id.length==10){
                  ajax.ajax({
                    url: '/student/getStudentByOpenid/' + this.globalData.openid,
                    success: res => {
                      if (this.userInfoReadyCallback) {
                        this.userInfoReadyCallback(res.data.data)
                      }

                      // this.globalData.userInfo = res.data.data;
                    }
                  })
                }else{
                  if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res.data.data)
                  }
                // this.globalData.userInfo = res.data.data
                }
                //如果已经执行到index，则将获取的用户数据设置到index界面；通过函数是否定义来判断是否已经执行到page

                // if (this.userInfoReadyCallback) {
                //   this.userInfoReadyCallback(res.data.data)
                // }
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