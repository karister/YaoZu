// pages/my/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    area_info: [
      {
        area: '中心市场',
        address: '赣州市南康区家具城工业大道亚琦城市壹号北80米[南康家具城中心市场]',
        latitude: 25.688255,
        longitude: 114.779696

      },
      {
        area: '博览中心',
        address: '赣州市南康区工业大道38-40号[南康家具城博览中心区]',
        latitude: 25.685532,
        longitude: 114.779386
      },
      {
        area: '家私城',
        address: '赣州市南康区迎宾大道与市场东路交汇处[居然之家盈海家博城]',
        latitude: 25.691644,
        longitude: 114.792854
      },
      {
        area: '光明家具城',
        address: '赣州市南康区迎宾东大道(仁济医院东北)[光明国际家具城]',
        latitude: 25.685177,
        longitude: 114.785399
      }
    ],
    display_index: 0,
    store_info: {}
  },
  /**
   * 调起系统拨打电话
   */
  callPhone: function () {
    var obj_store = this.data.store_info;
    wx.makePhoneCall({
      phoneNumber: obj_store.phone//仅为示例，并非真实的电话号码
    })
  },
  /**
   * 调起微信内置地图查看定位
   */
  onLocation: function () {
    var obj_area = this.data.area_info[this.data.display_index];
    wx.showLoading({
      title: '加载中',
    })
    wx.openLocation({
      latitude: obj_area.latitude,
      longitude: obj_area.longitude,
      scale: 18
    })
    wx.hideLoading()
    // wx.getLocation({
    //   type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    //   success (res) {
    //     const latitude = res.latitude
    //     const longitude = res.longitude
    //     wx.openLocation({
    //       latitude,
    //       longitude,
    //       scale: 18
    //     })
    //   }
    //  })
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * 查询display界面点击送过来的store_id去stores数据库查询对应数据
     */
    const id = options.id;
    console.log(id);
    const that = this;
    const db = wx.cloud.database();
    db.collection('stores').where({
      _id: id
    })
    .get({ 
      success: function(res) {
        console.log(res.data[0]);
        var store_info = that.data.store_info;
        store_info = res.data[0];
        that.setData({
          store_info
        })
      }
    })
    // 延时会儿等待读出数据
    setTimeout(() => {
      console.log('going to timer');
       // 设置区域信息
      for(let i = 0; i < 4; i++) {
        if(that.data.area_info[i].area == that.data.store_info.area) {
          console.log(that.data.area_info[i].area);
          that.setData({
            display_index: i
          })
        }
      }
    }, 500);
    
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