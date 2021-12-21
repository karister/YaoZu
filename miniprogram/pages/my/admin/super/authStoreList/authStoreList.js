// pages/my/admin/super/authStoreList/authStoreList.js
const app = getApp();
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {

    display_info: []
  },

  /**
   * 跳转到商家详细界面
   */
  clickToDetail: function (event) {
    var storeOpenid = event.currentTarget.dataset.openid;
    wx.navigateTo({
      url: '/pages/my/admin/super/authStoreDetail/authStoreDetail?openid=' + storeOpenid
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let display_info = that.data.display_info;
    db.collection('stores').where({
      authState: 0,
      viewState: 0
    })
    .get().then(res=>{
      res.data.forEach(element=>{
        let labelText = '';
        element.label.forEach((label, index, array)=>{
          labelText += label;
          if(index != (array.length-1)) {
            labelText += '|';
          }
        })
        let obj = {
          openid: element._openid,
          brandImgUrl: element.brandImgSrc,
          brandName: element.brand,
          area: element.area,
          address: element.address,
          labelText: labelText
        }
        display_info.push(obj);
        // console.log(obj);
      })
      that.setData({display_info})
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