// pages/my/display/display.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    data_length: 1,
    stores_data: []
  },

  /**
   * 读加载store集合中的数据，设置对应index区域的渲染数据
   */
  loadStoresData(index) {
    var that = this;
    // 获取数据库引用
    const db = wx.cloud.database()

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!
    // 设置data中数组对象的方法
    const area_info = that.data.area_info;
    for(let i = 0;i < 4; i ++) {
      area_info[i].font_color = that.data.color_other_item;
      // 为当前点击的index
      if(i == index) {
        area_info[index].font_color = that.data.color_current_item;
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
            for(let i = 0;i < res.data.length; i++) {
              stores_data[i] = res.data[i];
              console.log(stores_data[i]);
            }
            console.error('next load');
            // 设置展示结果数据
            that.setData({
              data_length: res.data.length,
              stores_data
            });
          }
        })
      }
    }
    that.setData ({
      display_index: index,
      area_info 
    })
  },

  /**
   * 加载图片地址
   */
  loadImgSrcData: function () {
    var length = this.data.data_length;
    var stores_data = this.data.stores_data;
    const db = wx.cloud.database();
    // if(stores_data != undefined) {
    //   for(let i = 0;i < length; i++) {
    //     let store_id = stores_data[i]._id;
    //     console.log(i + ':' + store_id);
    //     db.collection('img_src').where({
    //       brandID: store_id
    //     })
    //     .get({
    //       success:res=> {
    //         var img_src = res.data[0].imgUrl;
    //         stores_data[i].imgSrc = img_src;
    //         console.log(stores_data[i]);
    //       },
    //       fail: console.error
    //     })
    //   }
    //   this.setData({
    //     stores_data
    //   })
    // } else {
    //   console.log('no data!');
    // }
  },

  /**
   * 点击区域列表
   */
  clickAreaItem: function (e) {
    console.error('点击区域列表');
    this.loadStoresData(e.currentTarget.dataset.index);
    
    // this.loadImgSrcData();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.error('页面初始加载');
    console.log(this.data.data_length);
    this.loadStoresData(options.index);
    while(this.data.data_length != 0) {
      console.log(this.data.stores_data);
      console.log(this.data.data_length);
    }
    console.error('!!!!!!!!!!!!!!!!!!');
    // this.loadImgSrcData();
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