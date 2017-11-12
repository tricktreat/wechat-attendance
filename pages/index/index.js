//index.js
//获取应用实例
var ajax = require("../../ajax/ajax.js")
const app = getApp()

Page({
  data: {
    signedstudent: null,
    kcinfos: [],
    animationpick: {},
    animationData: {},
    motto: 'Hello World',
    userInfo: null,
    hasUserInfo: false,
    navimagesurl: "http://115.159.58.187/kckqimages/icon/chinesestyle/",
    navimages: ["c_zi.png", "c_chou.png", "c_yin.png", "c_mao.png", "c_chen.png", "c_si.png", "c_wu.png", "c_wei.png"],
    navimagest: ["c_shen.png", "c_you.png", "c_xu.png", "c_hai.png"],
    itemindex: null,
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
  teacherselect: function (e) {
    this.animation.opacity(0).step()
    this.setData({
      animationpick: this.animation.export()
    })
    this.animation.opacity(0.7).step()
    setTimeout(() => {
      this.setData({
        animationpick: this.animation.export()
      })
    }, 200)

    switch (e.currentTarget.dataset.index) {
      case 0:
        this.setData({ itemindex: 0})
        this.getckinfobyjsh("绿色课程为可签到状态")
        break
      case 1:
        this.getckinfobyjsh("查看已经签到的同学")
        this.setData({picker:true, itemindex: 1 })
        break
      case 2:
        this.getckinfobyjsh("查看未签到的同学")
        this.setData({picker:true, itemindex: 2 })
        break
      case 3:
        this.setData({ itemindex: 3 })
        this.show("暂未推出该功能")
        break
    }
  },
  studentselect: function (e) {
    this.animation.opacity(0).step()
    this.setData({
      animationpick: this.animation.export()
    })
    setTimeout(() => {
      this.setData({
        animationpick: this.animation.export()
      })

    }, 200)
    this.animation.opacity(1).step()
    switch (e.currentTarget.dataset.index) {
      case 0:

        var data = []
        for (var i of this.data.userInfo.kcInfos) {
          data.push(i.kcmc)
        }
        this.setData({ itemindex: 0, kcinfos: data })
        break
      case 1:


        this.setData({ itemindex: 1 })
        this.show("暂未推出该功能")
        break
      case 2:
        this.setData({ itemindex: 2 })
        this.show("暂未推出该功能")
        break
      case 3:
        this.setData({ itemindex: 3 })
        this.show("暂未推出该功能")
        break
      case 4:
        this.setData({ itemindex: 4 })
        this.show("暂未推出该功能")
        break
      case 5:
        this.setData({ itemindex: 5 })
        this.show("暂未推出该功能")
        break
      case 6:
        this.setData({ itemindex: 6 })
        this.show("暂未推出该功能")
        break
      case 7:
        this.setData({ itemindex: 7 })
        this.show("暂未推出该功能")
        break
    }
  },
  pickkc: function (e) {
    this.setData({ kcindex: e.detail.value[0] })
  },
  signin: function () {
    wx.showLoading({
      title: '请稍后...',
      mask: true
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

  },
  onShow: function () {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.scale(0.95, 0.95).step()
    this.setData({
      animationData: animation.export()
    })

    setTimeout(() => {

      animation.scale(1, 1).step()
      this.setData({
        animationData: animation.export()
      })


    }, 200)
  },

  getckinfobyjsh: function (message) {
    ajax.ajax({
      url: 'kcinfo/getKcinfosByJsh/' + this.data.userInfo.id,
      success: res => {
        this.setData({ kcinfos: res.data.data })
        wx.stopPullDownRefresh()
        this.show(message)
      }
    })
  },
  onPullDownRefresh: function () {
    //教师下拉逻辑
    if (this.data.userInfo.id.length != 10) {

      switch (this.data.itemindex) {
        case null, 0:
          this.getckinfobyjsh("课程信息已更新")
          break
          case 1:
          this.confirm()
          default:
          wx.stopPullDownRefresh()

      }
      
      return
    }
    //学生下拉逻辑
    switch (this.data.itemindex) {
      case null, 0:
        ajax.ajax({
          url: "/user/getUserByOpenid/" + app.globalData.openid,
          success: res => {
            if (res.data.data && res.data.data.id.length == 10) {
              ajax.ajax({
                url: '/student/getStudentByOpenid/' + app.globalData.openid,
                success: res => {
                  app.userInfoReadyCallback(res.data.data)
                  this.setData({ userInfo: res.data.data })

                  wx.stopPullDownRefresh()
                  this.show('课程信息已更新')
                }
              })
            }
          }
        })
        break
default:
        wx.stopPullDownRefresh()
    }

  },
  changekcstate: function (e) {
    wx.showLoading({
      title: '更改课程状态',
      mask: true
    })
    var index = e.currentTarget.dataset.index
    var kch = this.data.kcinfos[index].kch
    ajax.ajax({
      url: '/kcinfo/changeAllowOrNot/' + kch,
      success: res => {

        this.getckinfobyjsh(res.data.message)
        wx.hideLoading()
      }
    })
  },

  confirm:function(){
    var kc = this.data.kcinfos[this.data.kcindex]
    ajax.ajax({
      url:'kcqd/getKcqdInfosByKch/'+kc.kch,
      success:(e)=>{
        this.setData({ picker: false, signedstudent: e.data.data})
        ajax.ajax({
          url: 'student/getStudentsByKch/' + kc.kch,
          success:res=>{
            var allstudentthiskc = res.data.data
            var notsignstudent=[]
            var flag=0
            for (var i of allstudentthiskc){
              var flag = 0
              for (var j of e.data.data){
                if(i.id==j.student.id){
                  flag=1
                  break
                }
              }
              if(flag==0){
                notsignstudent.push(i)
              }
            }
            this.setData({ notsignstudent: notsignstudent})
          }
        })
      }
    })
    
  }
})