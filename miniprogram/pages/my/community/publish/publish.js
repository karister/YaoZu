// pages/my/community/publish/publish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    div_line: {
      width: '',
      color: ''
    },
    fileList: [],
  },

  vantImgUpload(event) {
    let files = event.detail.file;
    // console.log(event.detail.file)
    let fileList = this.data.fileList;
    files.forEach( (element,index) => {
      fileList.push({
        url: element.url,
        name: index
      })
    });
    this.setData({fileList})
  },

  inputFocus() {
    this.setData({
      div_line: {
        width: '4',
        color: 'rgb(0, 47, 167)'
      }
    })
  },

  inputBlur() {
    this.setData({
      div_line: {
        width: '2',
        color: 'rgb(44, 44, 44)'
      }
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