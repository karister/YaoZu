// pages/my/admin/function/function.js

const db = wx.cloud.database();
const _ = db.command;
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    adminName: '',
    // 认证图片地址[门店照片，营业执照]
    authImgUrl: ['',''],
    authState: ''
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
   * wx原生API点击上传按钮的动作函数
   * @param {图片索引} event
   */
  uploadAuthImg: function (event) {
    var index = event.currentTarget.dataset.index;
    var that = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image','video'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        // 临时文件路径
        var url = res.tempFiles[0].tempFilePath;
        console.log('uploadUrl:' + url);
        // 更新存储图片
        wx.cloud.uploadFile({
          cloudPath: 'auth_img/' + that.data.brandName + '/' + (new Date()).getTime() + '.' + index + '.png', // 上传至云端的路径
          filePath: url, // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            console.log(res.fileID)
            var authImgUrl = that.data.authImgUrl;
            authImgUrl[index] = res.fileID;
            that.setData({
              authImgUrl
            })
            console.log(that.data.authImgUrl)
          },
          fail: console.error,
          complete: function () {
            // 更新stores中的认证图片路径
            db.collection('stores').where({
              _openid: app.globalData.openid
            })
            .update({
              data: {
                authImgUrl: that.data.authImgUrl,
                authState: 0
              }
            })
          }
        })  
      },
      fail: console.error
      
    }) 
  },

  /**
   * 更新修改到数据库
   */
  upDateData: function () {
    var that = this;
    db.collection('stores').where({
      _openid: app.globalData.openid
    })
    .update({
      data: {
        name: that.data.adminName,
        phone: that.data.phone,
      }
    })
  },

  /**
   * 实时修改page data的数据
   * @param {实时输入值；输入值的名称} event 
   */
  modifyData: function (event) {
    var input = event.detail;
    var valueName = event.currentTarget.dataset.valuename;
    // console.log(valueName + ':' + input)
    this.setData({
      valueName: input
    })
    // console.log(this.data)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    // 查询认证基本信息 
    db.collection('stores').where({
      _openid: app.globalData.openid
    })
    .get({
      success: res => {
        // console.log(res.data[0])
        // 读取到authImgUrl的云端存储id
        this.setData({
          phone: res.data[0].phone,
          adminName: res.data[0].name,
          authImgUrl: res.data[0].authImgUrl,
          authState: res.data[0].authState,
          brandName: res.data[0].brand
        })
        console.log(this.data)
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