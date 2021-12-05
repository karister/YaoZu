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
    display_info: {
      brandName: '',
      brandImgSrc: '',
      labelList: [],
      labelText: '',
      browseNum: 0,
      authState: '',
      authText: '',
      address: '',
      phoneNumber:''
    },
    display_index: 0
  },
  /**
   * 调起系统拨打电话
   */
  callPhone: function () {
    var obj_store = this.data.display_info;
    wx.makePhoneCall({
      phoneNumber: obj_store.phoneNumber//仅为示例，并非真实的电话号码
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
     * 接收跳转过来携带的info数据。info中包含_id,area
     */
    const str = options.info;
    const strData = str.split('|');
    const id = strData[0];
    const area = strData[1];
    console.log(id);
    console.log(area);
    const that = this;
    const db = wx.cloud.database();
    // 设置区域信息
    for(let i = 0; i < 4; i++) {
      if(that.data.area_info[i].area == area) {
        that.setData({
          display_index: i
        })
      }
    }
    db.collection('stores').where({
      _id: id
    })
    .get({ 
      success: function(res) {
        var res_data = res.data[0];
        console.log(res_data);
        //设置展示数据
        var display_info = that.data.display_info;   
        display_info.brandName = res_data.brand;//品牌名
        display_info.brandImgSrc = res_data.imgSrc;//品牌头像地址
        var labels = res_data.label;//标签信息
        for(let i = 0; i < labels.length; i++) {
          display_info.labelList[i] = labels[i];
          display_info.labelText += labels[i];
          if(i != (labels.length-1)) {
            display_info.labelText += '|';
          }
        }
        display_info.browseNum = res_data.browseNum;//浏览量
        display_info.authState = (res_data.authState == 1) ?'authed' :'unauth';//认证状态
        display_info.authText = (res_data.authState == 1) ?'企业已认证' :'企业未认证';//认证展示文本
        display_info.address = res_data.address + '[' + area + ']';//店面地址
        display_info.phoneNumber = res_data.phone;//商家手机号
        console.log(display_info)
        that.setData({
          display_info
        })
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