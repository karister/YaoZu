// pages/my/test/test.js

const app = getApp();
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    
  },
  


  /**
   * vantui上传文件组件读取文件后的动作函数
   * @param {errMsg.detail.file: 当前读取的文件} e 
   */
  vantUploadImg: function (e) {
    var res = e.detail.file;
    var fileList = this.data.fileList;
    for(let i = 0; i < res.length; i++) {
      fileList.push({
        url: res[i].url,
      });
      console.log('uploadUrl:' + res[i].url)
    }
    this.setData({
      fileList
    })
    console.log(this.data.fileList)

    // for(let i = 0; i< fileList.length; i++) {
    //   console.log(fileList[i].url)
    //   wx.cloud.uploadFile({
    //     cloudPath: 'test/' + i + '.' + 'example.png', // 上传至云端的路径
    //     filePath: fileList[i].url, // 小程序临时文件路径
    //     success: res => {
    //       // 返回文件 ID
    //       console.log()
    //       db.collection('test').add({
    //         data: {
    //           url: res.fileID
    //         }
    //       })
    //     },
    //     fail: console.error
    //   })
    // }

    
    
  },
  /**
   * wx原生API点击上传按钮的动作函数
   */
  uploadImg: function () {
    var that = this;
    wx.chooseMedia({
      count: 9,
      mediaType: ['image','video'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        var fileList = that.data.fileList;
        for(let i = 0; i < res.tempFiles.length; i++) {
          fileList.push({
            url: res.tempFiles[i].tempFilePath,
          });
          console.log('uploadUrl:' + res.tempFiles[i].tempFilePath);
        }
        that.setData({
          fileList
        })
      },
      fail: console.error
    }) 
  },
  /**
   * vantui上传文件组件点击删除文件后的动作函数
   * @param {event.detail.index: 删除图片的序号值} e 
   */
  vantDeleteImg: function (e) {
    var index = e.detail.index;
    var fileList = this.data.fileList;
    console.log('deleteUrl:' + fileList[index].url);
    fileList.splice(index, 1);
    this.setData({
      fileList
    })  
  },


  getPhoneNumber: function (e) {
   
    console.log(e.detail)
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    var fileList = that.data.fileList;
    db.collection('test').get({
      success: function (res) {
        var data = res.data;
        console.log(data)
        data.forEach(element => {
          // console.log(element)
          fileList.push({
            url: element.url
          })
        });
        that.setData(fileList);
        console.log(that.data.fileList)
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