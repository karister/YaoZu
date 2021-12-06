// pages/my/join/brandJion/brandJion.js
import Toast from '../../../../miniprogram_npm/@vant/weapp/toast/toast'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoBoxHeight: 600,
    brandImgSrc: '',
    brandName: '',

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
  submitForm: function (event) {
    console.log(event)
  },

  /**
   * 添加标签
   */
  addLabel: function () {
    var labelList = this.data.labelList;
    // 最多不能超过4个标签
    if(labelList.length < 4) {
      labelList.push({
        label: '分类标签',
        labelName: ''
      })
      // 增加标签后，增加相对应的盒子高度
      var infoBoxHeight = this.data.infoBoxHeight + 80;
      this.setData({
        labelList,
        infoBoxHeight
      })
    }
  },
  /**
   * 删除标签
   * @param {删除的索引} event 
   */
  deleteLabel: function (event) {
    var index = event.currentTarget.dataset.index;
    var labelList = this.data.labelList;
    // 最少要有一个标签
    if(labelList.length > 1) {
      // 删除对应索引的标签
      labelList.splice(index, 1);
      // 删除标签后，减小相对应的盒子高度
      var infoBoxHeight = this.data.infoBoxHeight - 80;
      this.setData({
        labelList,
        infoBoxHeight
      })
    }
  },
  /**
   * 滑动选择区域
   * @param {滑动改变的索引} event 
   */
  onChange: function (event) {
    const { picker, value, index } = event.detail;
    // Toast(`当前值：${value}, 当前索引：${index}`);
  },
  /**
   * 取消选择
   */
  cacelSelect: function () {
    this.setData({
      isSelected: false
    })
  },
  /**
   * 确认选择
   * @param {选中的索引和值} event 
   */
  confirmSelect: function (event) {
    var {value, index} = event.detail;
    console.log(value)
    this.setData({
      isSelected: false,
      isClick: false,
      area: value
    })
  },
  /**
   * 点击选取门店区域
   */
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