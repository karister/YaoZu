// pages/my/index/index.js
const db = wx.cloud.database();
const _ = db.command;

Page({

  /**
   * 页面的初始数据
   */
  data: {
      imgUrls: [],
      imgUrls1: ['/images/consult.png','/images/feedback.png','/images/user2.png','/images/user2.png']
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
      _id: '133e253361c1d599017d273c0b729104'
    })
    .get({
      success: res => {
        that.setData({
          imgUrls: res.data[0].imageList
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