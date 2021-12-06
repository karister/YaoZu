// pages/my/join/brandJion/brandJion.js
import Toast from '../../../../miniprogram_npm/@vant/weapp/toast/toast'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoBoxHeight: 600,
    brandImgSrc: '',
    isIpload: false,
    isSelected: false,
    isClick: true,
    columns: ['中心市场', '博览中心', '家博城', '光明家具城'],
    area: '',
    labelList: [
      {
        label: '分类标签',
        labelName: ''
      }
      
    ]
  },

  addLabel: function () {
    var labelList = this.data.labelList;
    if(labelList.length < 4) {
      labelList.push({
        label: '分类标签',
        labelName: ''
      })
      var infoBoxHeight = this.data.infoBoxHeight + 80;
      this.setData({
        labelList,
        infoBoxHeight
      })
    }
  },
  onChange: function (event) {
    const { picker, value, index } = event.detail;
    Toast(`当前值：${value}, 当前索引：${index}`);
  },
  cacelSelect: function (event) {
    this.setData({
      isSelected: false
    })
  },
  confirmSelect: function (event) {
    var {value, index} = event.detail;
    console.log(value)
    this.setData({
      isSelected: false,
      isClick: false,
      area: value
    })
  },
  clickSelectArea: function () {
    this.setData({
      isSelected: true
    })
  },

  /**
   * wx原生API点击上传按钮的动作函数
   */
  uploadImg: function () {
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
        that.setData({
          brandImgSrc: url,
          isIpload: true,
        })
      },
      fail: console.error
    }) 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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