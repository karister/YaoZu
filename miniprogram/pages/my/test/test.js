Page({
  // 页面的初始数据
  data: {
    inputShowed: false,  //初始文本框不显示内容
    areas: ['1区1栋A001','1区1栋A002']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1. 获取数据库引用
    const db = wx.cloud.database()
    // db.collection('stores').doc('001').get({
    //   success: function (res) {
    //     console.log(res.data)
    //     console.log('success')
    //   },
    //   fail: function (res) {
    //     console.error(res.errMsg)
    //   }
    // })
    // 2. 构造查询语句
    // collection 方法获取一个集合的引用
    // where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。API 也支持高级的查询条件（比如大于、小于、in 等），具体见文档查看支持列表
    // get 方法会触发网络请求，往数据库取数据
    db.collection('stores').where({
      area: '中心市场'
    })
    .get({
      success: function(res) {
        // 输出 [{ "title": "The Catcher in the Rye", ... }]
        console.log(res.data)
        console.log('success')
      }
    })
  },




  // 搜索门店数据
  searchData: function () {
    
    // var inputData = e.detail.value;
    // var list = this.data.areas;
    // console.log(inputData);
    // for(var i = 0; i < list.length; i++) {
    //   var index = list[i].indexOf(inputData);
    //   var result = (index === -1) ?false :true;
    //   if(result) {
    //     console.log(list[i]);
    //   }
    // }
  },
  // 使文本框进入可编辑状态
  showInput: function () {
    this.setData({
      inputShowed: true   //设置文本框可以输入内容
    });
  },
  // 取消搜索
  hideInput: function () {
    this.setData({
      inputShowed: false
    });
  }




  
});
