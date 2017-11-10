var global=require("../global/global.js")

const ajax=obj=>{
  wx.request({
    url: global.API+obj.url,
    data:obj.data,
    method:obj.method,
    header: obj.header,
    dataType:obj.dataType,
    success: obj.success,
    fail:obj.fail,
    complete:obj.complete
  })
}

module.exports={
  ajax:ajax
}