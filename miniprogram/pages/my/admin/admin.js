// pages/my/admin/admin.js
const db = wx.cloud.database();
const _ = db.command;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    admin_info: [
      {
        iconStr: 'testA',
        text: '我的发布'
      },
      {
        iconStr: 'testB',
        text: '点赞评论'
      },
      {
        iconStr: 'testC',
        text: '收藏的店'
      },
      {
        iconStr: 'testD',
        text: '收藏商品'
      },
      {
        iconStr: 'testE',
        text: '优惠人口'
      }
    ],
    // 是否第一次使用小程序
    isFirstLogin: false,
    // 用户头像地址
    avatarUrl: '',
    // 用户微信昵称
    nickName: '',
    // 遮罩层状态
    show: false,
  },

  /**
   * 检查用户是否授权
   */
  checkAuthed: function () {
    if(this.data.avatarUrl == '') {
      this.setData({show: true});
    }
  },

  /**
   * 点击获取授权
   */
  getUserInfo: function () {
    const that = this;
    wx.getUserProfile({
      desc: '获取你的昵称、头像、地区及性别',
      success: res => {
        var avatarUrl = that.data.avatarUrl;
        var nickName = that.data.nickName;
        // console.log(res)
        // 成功获取
        avatarUrl = res.userInfo.avatarUrl;
        nickName = res.userInfo.nickName;
        // 写入globalData
        app.globalData.avatarUrl = avatarUrl;
        app.globalData.nickName = nickName;
        // 关闭遮罩层，更新page data
        that.setData({ 
          show: false,
          avatarUrl,
          nickName
        });
      },
      fail: res => {
        // console.log(res)
        //拒绝授权
        that.setData({ show: false });
      }
    })
  },


  /** 
   * 检查用户信息
  */
  checkUserInfo: function () {
    const that = this;
    const openid = app.globalData.openid;
    console.log(app.globalData)
    // 全局数据中头像地址是否为空
    if(app.globalData.avatarUrl == '') {
      // 开启遮罩层
      that.setData({show:true});
    }
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
    // this.checkUserInfo();
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