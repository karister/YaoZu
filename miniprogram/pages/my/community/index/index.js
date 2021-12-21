// pages/my/community/index/index.js
import {getUserIdentity} from '../../../../common/common.js'

const app = getApp();
const db = wx.cloud.database();

const store_space_db = db.collection('store_space');
const user_space_db = db.collection('user_space');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 屏幕窗口高度
    height:'',
    // 读取的动态记录列表
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
   * 点击图片预览大图
   * @param {imageIndex: 当前点击的图片索引;imgUrls: 图片列表} event   
   */
  viewImage: function (event) {
    let imageIndex = event.currentTarget.dataset.index;
    let imgList = event.currentTarget.dataset.imglist;
    // console.log(imageIndex + ':' + imgList[imageIndex].url)
    // 纯图片列表
    let imgUrls = [];
    imgList.forEach(element=>{
      imgUrls.push(element.url);
    })
    wx.previewImage({
      current: imgUrls[imageIndex],
      urls: imgUrls
    })
  },

  /**
   * 调起系统拨打电话
   */
  callPhone: function (event) {
    let phoneNumber = event.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phoneNumber
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
    // 同步等待身份的读取
    await getUserIdentity().then(res=>{
      identity = res;
      console.log(identity);
    })
    let data_db = (identity == 'store') ?store_space_db :user_space_db;
    // 查询对应身份下的动态记录
    data_db.orderBy('publishDate', 'desc').get().then(res=>{
      let messageBuffer = res.data;
      messageBuffer.forEach((element,index,array) => {
        array[index].imgAutoHeight = Math.ceil(element.fileList.length/3)*150 + 30;
        array[index].itemAutoHeight = Math.ceil(element.fileList.length/3)*150 + 380;
        // console.log(element);
      })
      that.setData({
        message: messageBuffer
      })
    }).catch(error=>{
      console.error('查询对应身份下的动态记录失败！');
    })
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