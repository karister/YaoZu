// pages/my/display/display.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // areas: ['中心市场','博览中心','家私城','光明家具城'],
    area_info: [
      {
        area: '中心市场',
        font_color: '#e06c0d'
      },
      {
        area: '博览中心',
        font_color: ''
      },
      {
        area: '家私城',
        font_color: ''
      },
      {
        area: '光明家具城',
        font_color: ''
      }
    ],
    display_index: 0,
    color_current_item: '#e06c0d',
    color_other_item: '',
    stores_data: [
      {
        brand: 'asdad'
      }
    ]
  },

  /**
   * 点击区域列表
   */
  clickAreaItem: function (e) {
    var that = this;
    // 点击的区域index
    var index = e.currentTarget.dataset.index;
    // 获取数据库引用
    const db = wx.cloud.database()

    console.log(index);

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!
    // 设置data中数组对象的方法
    const area_info = this.data.area_info;
    for(let i = 0;i < 4; i ++) {
      area_info[i].font_color = this.data.color_other_item;
      // 为当前点击的index
      if(i === index) {
        area_info[index].font_color = this.data.color_current_item;
        db.collection('stores').where({
          area: {
            // 模糊查询 '.*'相当于mysql的like
            $regex: '.*' + area_info[index].area + '.*',
            // 不区分大小写
            $options: 'i'
          }
        })
        .get({ 
          success: function(res) {
            //打印调试信息
            // console.log('success');
            // console.log('res.data:' + res.data);
            // console.log('res.length:' + res.data.length);
            //存储匹配结果
            const stores_data = that.data.stores_data;
            // console.log(stores_data)
            for(let i = 0;i < res.data.length; i++) {
              stores_data[i] = res.data[i];
            }
            // 设置展示结果数据
            that.setData({
              stores_data
            });
          }
        })
      }
    }
    this.setData ({
      display_index: index,
      area_info 
    })

  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 1. 获取数据库引用
    const db = wx.cloud.database()
    // 2. 构造查询语句
    db.collection('stores').where({
      area: {
        // 模糊查询 '.*'相当于mysql的like
        $regex: '.*' + '中心市场' + '.*',
        // 不区分大小写
        $options: 'i'
      }
    })
    .get({ 
      success: function(res) {
        //打印调试信息
        // console.log('success');
        // console.log('res.data:' + res.data);
        // console.log('res.length:' + res.data.length);
        //存储匹配结果
        const stores_data = that.data.stores_data;
        // console.log(stores_data)
        for(let i = 0;i < res.data.length; i++) {
          stores_data[i] = res.data[i];
        }
        // 设置展示结果数据
        that.setData({
          stores_data
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

  
  
})