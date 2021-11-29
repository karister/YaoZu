Page({
  // 页面的初始数据
  data: {
    inputShowed: false,  //初始文本框不显示内容
    info: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // // 1. 获取数据库引用
    // const db = wx.cloud.database()
    // // 2. 构造查询语句
    // db.collection('stores').where({
    //   area: '中心市场'
    // })
    // .get({
    //   success: function(res) {
    //     // 输出 [{ "title": "The Catcher in the Rye", ... }]
    //     console.log(res.data)
    //     console.log('success')
    //   }
    // })
  },




  // 搜索门店数据
  searchData: function (e) {
    var that = this;
    var inputData = e.detail.value;
    var info_data = [];
    console.log(inputData);
    //搜索框无字符时不读取数据库
    if(inputData != '') {
      // 1. 获取数据库引用
      const db = wx.cloud.database()
      // 2. 构造查询语句
      db.collection('stores').where({
        brand: {
          // 模糊查询 '.*'相当于mysql的like
          $regex: '.*' + inputData + '.*',
          // 不区分大小写
          $options: 'i'
        }
      })
      .get({ 
        success: function(res) {
          //打印调试信息
          console.log('success');
          console.log('res.data:' + res.data);
          console.log('res.length:' + res.data.length);
          console.log('input.data:' + inputData)
          //存储匹配结果
          for(let i = 0;i < res.data.length; i++) {
            info_data[i] = res.data[i].brand + '(' + res.data[i].area + '-' + res.data[i].address +')';
          }
          //设置展示结果数据
          that.setData({
            info: info_data
          });
          //无搜素结果
          if(res.data.length === 0) {
            info_data[0] = '暂无该门店信息';
            that.setData({
              info: info_data
            });
          }
          
        }
      })
    }
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
      inputShowed: false,
      info: []
    });
  }




  
});
