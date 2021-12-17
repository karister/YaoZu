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
        iconStr: 'shenhe',
        text: '我的认证',
        class: 'van-hairline--bottom'
      },
      {
        iconStr: 'info',
        text: '店铺信息',
        class: 'van-hairline--bottom'
      },
      {
        iconStr: 'tupian',
        text: '展图管理',
        class: 'van-hairline--bottom'
      },
      {
        iconStr: 'set',
        text: '个性化修改',
        class: ''
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
    // 用户身份,决定入口功能
    identity: 'user',
  },
  /**
   * 我的认证
   */
  myAuthFun: function () {
    wx.navigateTo({
      url: '/pages/my/admin/function/authentication/authentication',
    })
  },
  /**
   * 店铺信息
   */
  storeInfo: function () {
    wx.navigateTo({
      url: '/pages/my/admin/function/storeInfo/storeInfo',
    })
  },
  /**
   * 展图修改
   */
  imgManage: function () {
    wx.navigateTo({
      url: '/pages/my/admin/function/imgManage/imgManage',
    })
  },

  /**
   * 商家界面的各个功能跳转
   * @param {功能index} event 
   */
  actionFuntion: function (event) {
    // 是否已授权
    if(this.data.avatarUrl == '') {
      this.setData({show: true});
    } else {
      var index = event.currentTarget.dataset.index;
      console.log('function: ' + index );
      if(index == 0) {
        this.myAuthFun();
      } else if(index == 1) {
        this.storeInfo();
      } else if(index == 2) {
        this.imgManage();
      }  
    }
  },

  /**
   * 点击我的浏览跳转浏览记录
   */
  browseFunction() {
    // 是否已授权
    if(this.data.avatarUrl == '') {
      this.setData({show: true});
    } else {
      wx.navigateTo({
        url: '/pages/my/admin/browse/browse'
      })
    }
  },

  /**
   * 点击商家入驻跳转到入驻界面
   */
  brandJoin: function () {
     // 是否已授权
     if(this.data.avatarUrl == '') {
      this.setData({show: true});
    } else {
      // 不是商户
      if(this.data.identity == 'user') {
        wx.navigateTo({
          url: '/pages/my/join/brandJion/brandJion'
        })
      } else {
        db.collection('stores').where({
          _openid: app.globalData.openid
        })
        .get({
          success: function (res) {
            console.log(res.data[0])
            wx.navigateTo({
              url: '/pages/my/detail/detail?openid=' + app.globalData.openid
            })
          }
        })
      }
    }
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
      },
      complete: function () {
        // 授权成功
        if(that.data.avatarUrl != '') {
          // console.log(that.data.avatarUrl)
          // 更新用户头像和名称
          db.collection('user').where({
            _openid: app.globalData.openid
          })
          .update({
            data: {
              avatarUrl: that.data.avatarUrl,
              nickName: that.data.nickName,
              updateTime: (new Date())
            },
            success: function(res) {
              // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
              console.log(res.errMsg);
            }
          })
          // 更新浏览记录表中的头像和名称
          db.collection('browse').where({
            _openid: app.globalData.openid
          })
          .update({
            data: {
              avatarUrl: that.data.avatarUrl,
              nickName: that.data.nickName,
            }
          })
        }
        
      }
    })
  },


  /** 
   * 检查用户信息
  */
  checkUserInfo: function () {
    const that = this;
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
    // 检查openid的身份,若为user，则开启商家入驻接口，若为store则改为我的店铺接口
    const that = this;
    db.collection('user').where({
      _openid: app.globalData.openid
    })
    .get({
      success: function (res) {
        console.log(res);
        if(res.data[0].identity == 'store') {
          that.setData({identity: 'store'})
        }
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
    this.checkUserInfo();
    // console.log(this.data.identity)
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