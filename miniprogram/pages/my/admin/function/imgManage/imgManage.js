// pages/my/admin/function/imgManage/imgManage.js
import Toast from '../../../../../miniprogram_npm/@vant/weapp/toast/toast';

const db = wx.cloud.database();
const _ = db.command;
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    brandName: '',
    labelObject: [],
    // 侧边栏选中项
    activeKey: 0,
  },
  

  /**
   * 发布图片，把分类标签下上传的图片存储到云存储
   * @param {event.currentTarget.dataset.index: 当前发布的标签索引} event 
   */
  onPublish: function (event) {
    var data = this.data;
    var labelIndex = event.currentTarget.dataset.index;
    var labelObject = this.data.labelObject;
    labelObject[labelIndex].imgUrls.forEach( (item,index) => {
      wx.cloud.uploadFile({
        cloudPath: 'product_img/' + data.brandName + '/' + data.labelObject[labelIndex].labelName + '/' + index + '.' + (new Date()).getTime() + '.png', // 上传至云端的路径
        filePath: item, // 小程序临时文件路径
        success: res => {
          console.log(res.fileID);
        }
      })
    })
    Toast.success({
      message: '发布成功',
      duration: 1000
    });
  },

  /**
   * vantui上传文件组件读取文件后的动作函数
   * @param {event.detail.file: 当前读取的文件} event 
   */
  vantUploadImg: function (event) {
    var fileObject = event.detail.file;
    var labelIndex = event.currentTarget.dataset.index;
    var labelObject = this.data.labelObject;
    // console.log(imgUrls)
    // console.log(index)
    fileObject.forEach( (item) => {
      console.log(item.url);
      labelObject[labelIndex].imgUrls.push(item.url);
      labelObject[labelIndex].fileList.push({url: item.url});
    })
    this.setData({labelObject});
    console.log(this.data.labelObject);
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    // 得到商家的标签分类
    db.collection('product').where({
      _openid: app.globalData.openid
    })
    .get({
      success: function (res) {
        var labelData = res.data[0].labels;
        var labelObject = that.data.labelObject;
        // console.log(labelData)
        for(let i = 0; i < labelData.length; i++) {
          labelObject.push({
            labelName: labelData[i].labelName,
            imgUrls:labelData[i].imgUrls,
            fileList: []
          })
        }
        // console.log(label_img)
        that.setData({
          labelObject,
          brandName: res.data[0].brandName
        });
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