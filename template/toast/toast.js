//定义模版的数据
let _comData={
  '_toast_.isHide':false,
  '_toast_.content':''
}

//定义模版的函数
let toastPannel={
  show:function(data){
    let self=this
    this.setData({ '_toast_.isHide': true, '_toast_.content':data})
    setTimeout(function(){
      {
        self.setData({ '_toast_.isHide': false })
      }
    },2500)
  }
}

// 在page的作用域里new ToastPannnel，并将自己的_comData和定义的函数合并到page对象
function ToastPannnel(){
  let pages=getCurrentPages()
  let curPage=pages[pages.length-1]
  this.__page=curPage
  Object.assign(curPage,toastPannel)
  curPage.toastPannel=this;
  curPage.setData(_comData);
  return this;
}

module.exports={
  ToastPannnel
}