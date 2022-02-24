// pages/my/admin/function/imgManage/productInfo.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imageUrl: '',
        model: '',
        label: '',
        price: 0
    },

    /**
   * 输入变化设置数据
   * @param {当前输入值} event
   */
  changeSetData: function (event) {
    // 实时的输入值
    var value = event.detail;
    // 输入项
    var item = event.currentTarget.dataset.item;
    this.setData({
      [item]:value
    })
    
  },

  /**
   * 提交数据
   * @param {*} options 
   */
  updateData(event) {
    var value = event.detail.value;
    console.log(value)
  },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            imageUrl: options.imageUrl
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