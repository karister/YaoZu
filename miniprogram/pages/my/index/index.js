// pages/my/index/index.js
const db = wx.cloud.database();
const _ = db.command;

Page({

  /**
   * 页面的初始数据
   */
  data: {
      imgUrls: [],
      imgUrls1: []
  },

  imgClick: function (e) {
      var index = e.currentTarget.dataset.index;
      console.log(index);
      wx.navigateTo({
          url: '/pages/my/display/display?index=' + index
        })
  },
  clickToSearch: function () {
    wx.navigateTo({
      url: '/pages/my/search/search'
    })
  },

  getIndexImage() {
    const that = this;
    db.collection('index').where({
      filed: 'index_image'
    })
    .get({
      success: res => {
        let imageList = res.data[0].imageList;
        // let iconList = res.data[0].iconList;
        let imageUrlTemp = [];
        // let iconUrlTemp = [];
        imageList.forEach( url => {
          if(url != '') {
            imageUrlTemp.push(url);
          }
        });
        // iconList.forEach( url => {
        //   if(url != '') {
        //     iconUrlTemp.push(url);
        //   }
        // });
        that.setData({
          imgUrls: imageUrlTemp,
          // imgUrls1: iconUrlTemp
        }) 
      }
    })

    db.collection('index').where({
      filed: 'areaInfo'
    })
    .get({
      success: res => {
        // let iconList = res.data[0].area;
        // let iconUrlTemp = [];
        // iconList.forEach( url => {
        //   if(url != '') {
        //     iconUrlTemp.push(url);
        //   }
        // });
        that.setData({
           imgUrls1: res.data[0].area
        }) 
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getIndexImage()
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