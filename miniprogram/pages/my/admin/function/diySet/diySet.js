// pages/my/admin/function/diySet/diySet.js
import {getSingleDataByOpenid} from '../../../../../common/common.js'
import Toast from '../../../../../miniprogram_npm/@vant/weapp/toast/toast.js';
const app = getApp();
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    browseNum: 100
  },

  onChange(event) {
    this.setData({
      browseNum: event.detail
    })
  },

  onClickToSet() {
    let that = this;
    wx.showLoading({
      title: '修改中...',
    })
    db.collection('mock_stores').where({
      _openid: app.globalData.openid
    })
    .update({
      data: {
        browseNum: that.data.browseNum
      },
      success: res=>{
        wx.hideLoading();
        Toast.success('修改成功!');
        wx.navigateTo({
          url: '/pages/my/detail/detail?openid=' + app.globalData.openid
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let that = this;
    await getSingleDataByOpenid('mock_stores').then(res=>{
      that.setData({
        browseNum: res.browseNum
      })
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