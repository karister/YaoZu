// pages/my/admin/super/indexImgAdmin/indexImgAdmin.js
import {getSingleDataByOpenid} from '../../../../../common/common.js'
const db = wx.cloud.database();
const _ = db.command;
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 纯图片链接
    imageList: [],
    // 图片对象
    imageObject: [],
    // 选中后的图片框颜色
    selectedColor: 'red',
    // 正常的图片框颜色
    normalColor: '#e4e4e4',
    // 按钮编辑状态
    disabled: true,
    // 选中的图片索引
    selectIndex: 0
  },

  /**
   * 取消选中的图片
   */
  cancelSelect() {
    let imageObject = this.data.imageObject;
    imageObject[this.data.selectIndex].borderColor = this.data.normalColor;
    this.setData({
      imageObject,
      disabled: true
    })
  },

  /**
   * 长按图片进行编辑
   * @param {imageindex: 当前点击的图片索引;labelindex: 标签的索引} event   
   */
  editImage(event) {
    let that = this;
    let imageIndex = event.currentTarget.dataset.imageindex;
    let imageObject = that.data.imageObject;
    if(that.data.disabled) {
      imageObject[imageIndex].borderColor = that.data.selectedColor;
      that.setData({
        imageObject,
        disabled: false,
        selectIndex: imageIndex
      })
    }
  },

  /**
   * 选择图片
   */
  chooseImage() {
    let that = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image','video'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        let url = res.tempFiles[0].tempFilePath;
        let selectIndex = that.data.selectIndex;
        let imageList = that.data.imageList;
        let imageObject = that.data.imageObject;
        imageList[selectIndex] = url;
        imageObject[selectIndex].url = url;
        imageObject[selectIndex].borderColor = that.data.normalColor;
        that.setData({
          imageList,
          imageObject,
          disabled: true
        });
      }
    })
  },

  /**
   * 同步上传图片至云存储，返回图片链接列表（fileID）
   */
  async uploadToCloud() {
    let that = this;
    let imageList = that.data.imageList;
    let imageObject = that.data.imageObject;
    let now = new Date();
    let time = (now.getMonth() + 1).toString() + now.getDate().toString() + now.getHours().toString() + now.getMinutes().toString();
    for (let index = 0; index < imageList.length; index++) {
      await wx.cloud.uploadFile({
        cloudPath: 'index_img/' + time + '/' + index + '.png', // 上传至云端的路径
        filePath: imageList[index], // 临时文件路径
      }).then(res=>{
        imageList[index] = res.fileID;
        imageObject[index].url = res.fileID;
      }).catch(error => {
        console.error('图片上传到云存储失败1')
      })
    }
    that.setData({
      imageList,
      imageObject
    })
  },

  async onPublish() {
    let that = this;
    await that.uploadToCloud().then(res=>{
      db.collection('index').where({
        _id: '133e253361c1d599017d273c0b729104'
      })
      .update({
        data: {
          imageList: that.data.imageList
        }
      })
    }).catch(error => {
      console.error('图片上传到云存储失败2')
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    db.collection('index').where({
      _id: '133e253361c1d599017d273c0b729104'
    }).get().then(res=>{
      let imageObject = that.data.imageObject;
      let imageList = that.data.imageList;
      res.data[0].imageList.forEach(url=>{
        imageObject.push({
          url: url,
          borderColor: that.data.normalColor
        })
        imageList.push(url);
      })
      that.setData({
        imageObject,
        imageList
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