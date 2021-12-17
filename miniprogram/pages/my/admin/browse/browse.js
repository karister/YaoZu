// pages/my/admin/browse/browse.js
const app = getApp();
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // browse数据库中的browse字段
    browse: []
  },

  /**
   * 跳转到商家详细界面
   */
  clickToDetail: function (event) {
    var storeOpenid = event.currentTarget.dataset.openid;
    wx.navigateTo({
      url: '/pages/my/detail/detail?openid=' + storeOpenid
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    db.collection('browse').where({
      _openid: app.globalData.openid
    })
    .get({
      success: function (res) {
        that.setData({
          browse: res.data[0].browse
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