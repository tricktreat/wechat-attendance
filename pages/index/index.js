//index.js
//获取应用实例
var ajax = require("../../ajax/ajax.js")
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: null,
    hasUserInfo: false,
    navimagesurl: "http://115.159.58.187/kckqimages/icon/chinesestyle/",
    navimages: ["c_zi.png", "c_chou.png", "c_yin.png", "c_mao.png", "c_chen.png", "c_si.png", "c_wu.png", "c_wei.png"],
    kcxz: true,
    kcindex: 0
  },

  onLoad: function () {

    // 设置信息之后更新全局用户信息到index界面
    if (app.globalData.userInfo) {
      this.setData(
        {
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        }
      )
    }

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
    new app.ToastPannnel.ToastPannnel()
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
  },
  test: function (e) {
    console.log(e)
  },

  selectkc: function (e) {
    if (e.currentTarget.dataset.index == 0) {
      var data = []
      for (var i of this.data.userInfo.kcInfos) {
        data.push(i.kcmc)
      }
      var tmp = !this.data.kcxz
      this.setData({ kcxz: tmp, kcinfos: data })
    }
  },
  pickkc: function (e) {
    this.setData({ kcindex: e.detail.value[0] })
  },
  signin: function () {
    wx.showLoading({
      title: '请稍后...',
      mask:true
    })
    var QQMapWX = require('../../dependence/qqmap-wx-jssdk.js');
    // 实例化API核心类
    var demo = new QQMapWX({
      key: '6XABZ-X5ZW4-73VUU-DZ5O7-3KSZV-Z2BWB' // 必填
    });

    var userinfo = this.data.userInfo
    var kcindex = this.data.kcindex
    var kc = userinfo.kcInfos[kcindex]
    var signinckinfo = { kch: kc.kch, xh: userinfo.id, kcmc: kc.kcmc, qddd: kc.skdd }
    console.log(signinckinfo)

    wx.request({
      url: 'https://www.ibilidi.cn/getJXL',
      data: { jxl: signinckinfo.qddd.slice(0, 3) },
      success: (e) => {
        if (!e.data.rows[0]) {
          this.show("暂不支持该课程所在的教学地点签到！")
          wx.hideLoading()
          return
        }
        demo.calculateDistance({
          to: [{
            latitude: e.data.rows[0].lat,
            longitude: e.data.rows[0].lng
          }],
          success: (res) => {
            var dis = res.result.elements[0].distance
            console.log(dis, e.data.rows[0].distancelimit)
            if (e.data.rows[0].distancelimit < dis) {
              wx.hideLoading()
              this.show("签到失败，当前与" + signinckinfo.qddd + "距离为" + res.result.elements[0].distance + "米")

            } else {
              ajax.ajax({
                url: "kcqd/signIn",
                data: signinckinfo,
                header: { "content-type": "application/json" },
                method: 'POST',
                success: (e) => {
                  if (e.data.state == 200) {
                    wx.hideLoading()
                    wx.showToast({
                      title: e.data.message,
                    })
                    this.show(res.result.elements[0].distance)
                  } else {
                    wx.hideLoading()                    
                    this.show(e.data.message)
                  }
                }
              })

            }
          }
        })
      }
    })


  }
})