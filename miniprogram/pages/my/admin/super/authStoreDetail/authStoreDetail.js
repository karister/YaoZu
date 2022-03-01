import {getSingleDataByOpenid} from '../../../../../common/common.js'
import Toast from '../../../../../miniprogram_npm/@vant/weapp/toast/toast.js';

const db = wx.cloud.database();
const _ = db.command;
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeOpenid: '',
    phone: '',
    adminName: '',
    // 认证图片地址[门店照片，营业执照]
    authImgUrl: ['',''],
    authState: '',


    // step0_info_box的高度
    step0InfoBoxHeight: 600,
    // 上传的头像地址
    brandImgSrc: '',
    // 表单提交的地址信息
    address: '',
    // 定位经纬度
    latitude: 0,
    longitude: 0,
    // 表单提交的名称信息
    brandName: '',
    // 选定的区域值
    area: '',
    // 分类列表
    labelList: [''],
  },

  /**
   * 点击审核通过
   */
  async onClickToAuth() {
    let that = this;
    
    wx.showLoading({
      title: '修改中...',
    })
    // user表中身份改为商家
    await db.collection('user').where({
      _openid: that.data.storeOpenid
    })
    .update({
      data: {
        identity: 'store',
        updateTime: new Date()
      },
      success: res=>{
        console.log(res)
      },
      fail: console.error
    })
    // store表中认证状态和查看状态改为成功
    await db.collection('stores').where({
      _openid: that.data.storeOpenid
    }).update({
      data: {
        authState: 1,
        viewState: 1
      }
    })
    wx.hideLoading();
    Toast.success('审核成功!');
    wx.switchTab({
      url: '/pages/my/admin/userInfo/userInfo',
    })
  },

  /**
   * 手动查看定位
   */
  onLocation: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.openLocation({
      latitude: that.data.latitude,
      longitude: that.data.longitude,
      scale: 18
    })     
    wx.hideLoading()
  },

  /**
   * 
   * @param {点击预览图片的索引} event 
   */
  previewImg: function (event) {
    var index = event.currentTarget.dataset.index;
    var imgUrls = this.data.authImgUrl;
    wx.previewImage({
      urls: imgUrls,
      current: imgUrls[index]
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let that = this;
    let storeOpenid = options.openid;
    that.setData({
      storeOpenid
    })
    // 读取用户入驻填写的信息
    await getSingleDataByOpenid('stores', storeOpenid).then(res=>{
      // console.log(res);
      let state = false;
      if(res.authImgUrl) {
        state = true;
      }
      let length = res.label.length -1;
      let step0InfoBoxHeight = that.data.step0InfoBoxHeight;
      step0InfoBoxHeight += length*90;
      that.setData({
        phone: res.phone,
        adminName: res.name,
        authImgUrl: res.authImgUrl,
        authImgState: state,
        brandName: res.brand,
        brandImgSrc: res.brandImgSrc,
        area: res.area,
        address: res.address,
        latitude: res.latitude,
        longitude: res.longitude,
        labelList: res.label,
        step0InfoBoxHeight
      })
    }).catch(error=>{
      console.error('查询入驻时填写的信息失败！')
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