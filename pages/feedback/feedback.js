// pages/feedback/feedback.js
var ajax = require("../../ajax/ajax.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannnel.ToastPannnel()
  },

feedback:function(e){
  if (!e.detail.value.content|| !e.detail.value.phone){
    this.show("请填写完整！")
    return
  }
 ajax.ajax({
   url:'/feedback/addFeedback',
   method:'POST',
   header: { "content-type": "application/json" },
   data: { content: e.detail.value.content, phone: e.detail.value.phone},
   success:(res)=>{
     if (res.data.state){
     wx.showToast({
       title: '反馈成功',
       icon:'success'
     })
   }
   }
 })
},
onPullDownRefresh:function(){
  wx.stopPullDownRefresh()
}
})