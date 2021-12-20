// pages/my/community/index/index.js
import {getUserIdentity} from '../../../../common/common.js'

const app = getApp();
const db = wx.cloud.database();

const store_space_db = db.collection('store_space');
const stores_db = db.collection('stores');
const user_db = db.collection('user');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:'',
    message: [],
  },

  /**
   * 获取屏幕窗口高度
   */
  getScreenHeight() {
    let that = this;
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        // 获取可使用窗口宽度
        let clientHeight = res.windowHeight;
        // 获取可使用窗口高度
        let clientWidth = res.windowWidth;
        // 算出比例
        let ratio = 750 / clientWidth;
        // 算出高度(单位rpx)
        let height = clientHeight * ratio;
        // 设置高度
        that.setData({
          height: height
        });
        // console.log(height)
      }
    })
  },

  /**
   * 跳转到发布信息填写界面
   */
  clickToPublish() {
    wx.navigateTo({
      url: '/pages/my/community/publish/publish'
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getScreenHeight();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    let that = this;
    let identity = '';
    await getUserIdentity().then(res=>{
      identity = res;
      console.log(identity);
    })
    // 普通用户
    if(identity == 'user') {
      // console.log('i am user')
    }
    // 商家
    if(identity == 'store') {
      store_space_db.get({
        success: function (res) {
          that.setData({
            message: res.data
          })
        }
      })
    }
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