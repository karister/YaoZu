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
    authImgUrl: ''
  },


  /**
   * 
   * @param {点击预览图片的索引} event 
   */
  previewImg: function (event) {
    var index = event.currentTarget.dataset.index;
    var imgUrls = this.data.authImgUrl;
    wx.previewImage({
      urls: [imgUrls[0].url,imgUrls[1].url],
      current: imgUrls[index].url
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
        var url = res.tempFiles[0].tempFilePath;
        console.log('uploadUrl:' + url);
        wx.cloud.uploadFile({
          cloudPath: 'auth_img/' + app.globalData.openid + '/' + index + '.png', // 上传至云端的路径
          filePath: url, // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            console.log(res.fileID)
            var authImgUrl = that.data.authImgUrl;
            authImgUrl[index] = res.fileID;
            that.setData({
              authImgUrl
            })
          },
          fail: console.error
        })  
      },
      fail: console.error,
      complete: function () {
        // 这里未作是否上传成功的判断！！！！！！！！
        // wx.cloud.uploadFile({
        //   cloudPath: 'test/' + i + 'example.png', // 上传至云端的路径
        //   filePath: fileList[i].url, // 小程序临时文件路径
        //   success: res => {
        //     // 返回文件 ID
        //     console.log(res.fileID)
        //   },
        //   fail: console.error
        // })
      }
    }) 
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection('stores').where({
      _openid: app.globalData.openid
    })
    .get({
      success: res => {
        console.log(res.data[0])
        this.setData({
          phone: res.data[0].phone,
          adminName: res.data[0].name,
          authImgUrl: res.data[0].authImgUrl
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