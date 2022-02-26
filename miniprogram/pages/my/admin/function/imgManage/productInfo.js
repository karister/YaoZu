const db = wx.cloud.database();
const _ = db.command;
const app = getApp();
import Toast from '../../../../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imageUrl: '',
        model: '',
        label: '',
        price: 0,
        isFirst: false,
        isLast: false
    },

    nullHandle(value) {
      if(value == null)
        return '';
      return value;
    },

    changeProduct(event) {
      const that = this;
      let dir = event.currentTarget.dataset.dir;
      let imageIndex = (dir == 'back') ? (Number(that.data.imageIndex) - 1) : (Number(that.data.imageIndex) + 1);
      console.log(imageIndex)
      let labelIndex = that.data.labelIndex;
      let labelObjects = that.data.labelObjects;
      let imageData = labelObjects[labelIndex].imageObjects[imageIndex];
      that.setData({
        imageUrl: that.nullHandle(imageData.url),
        model: that.nullHandle(imageData.model),
        label: that.nullHandle(imageData.label),
        price: that.nullHandle(imageData.price),
        imageIndex,
        isFirst: (imageIndex == 0) ? true : false,
        isLast: (imageIndex == 8) ? true : false,
      })
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
  async updateData(event) {
    const that = this;
    let value = event.detail.value;
    let imageIndex = that.data.imageIndex;
    let labelIndex = that.data.labelIndex;
    let labelObjects = that.data.labelObjects;
    labelObjects[labelIndex].imageObjects[imageIndex].model = value.model;
    labelObjects[labelIndex].imageObjects[imageIndex].label = value.label;
    labelObjects[labelIndex].imageObjects[imageIndex].price = value.price;
    db.collection('product').where({
      _openid: app.globalData.openid
    })
    .update({
      data: {
        labels: labelObjects
      },
      success: function () {
        wx.showLoading({
          title: '修改中',
        })
        setTimeout(() => {
          wx.hideLoading({
            success: (res) => {
              Toast.success({
                message: '提交成功!',
                duration: 500
              });
            },
          })
        }, 500);
      }
    })
  },

    /**
     * 生命周期函数--监听页面加载
     */
     onLoad: function (options) {
      const that = this;
      let imageIndex = options.imageIndex;
      let labelIndex = options.labelIndex;
      console.log(imageIndex)
      db.collection('product').where({
        _openid: app.globalData.openid
      })
      .get().then(res=>{
        let labelObjects = res.data[0].labels;
        that.setData({
          labelObjects,
          model: labelObjects[labelIndex].imageObjects[imageIndex].model,
          label: labelObjects[labelIndex].imageObjects[imageIndex].label,
          price: labelObjects[labelIndex].imageObjects[imageIndex].price
        })
      })
      that.setData({
          imageUrl: options.imageUrl,
          imageIndex,
          labelIndex,
          isFirst: (imageIndex == 0) ? true : false,
          isLast: (imageIndex == 8) ? true : false,
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