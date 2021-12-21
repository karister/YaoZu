// pages/my/admin/admin.js
import {checkAuthed,getSingleDataByOpenid} from '../../../../common/common.js'

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
    // 微信手机号
    phoneNumber: '',
    // 遮罩层状态
    show: false,
    // 用户身份,决定入口功能
    identity: 'user',
    // 超级功能显示
    superShow: false,
    // 超级功能数据
    power: {
      title: '超级功能',
      showItem: false,
      item: [{
        title: '审核商家入驻',
        page: 'authStoreList'
      }, {
        title: '商家管理',
        page: 'storeAdmin'
      }, {
        title: '首页图片管理',
        page: 'indexImgAdmin'
      }]
    }
  },

  /**
   * 超级功能跳转
   * @param {功能index} event 
   */
  jumpPage (event) {
    let page = event.currentTarget.dataset.page;
    // console.log(page)
    wx.navigateTo({
      url: '/pages/my/admin/super/' + page + '/' + page,
    })
  },

  /**
   * 点击超级功能
   */
  onClickSuper() {
    let power = this.data.power;
    power.showItem = !power.showItem;
    this.setData({power});
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
   * 个性化设置
   */
  diySet(){
    wx.navigateTo({
      url: '/pages/my/admin/function/diySet/diySet',
    })
  },

  /**
   * 商家界面的各个功能跳转
   * @param {功能index} event 
   */
  actionFuntion: function (event) {
    // 是否已授权
    if(checkAuthed()) {
      var index = event.currentTarget.dataset.index;
      // console.log('function: ' + index );
      if(index == 0) {
        this.myAuthFun();
      } else if(index == 1) {
        this.storeInfo();
      } else if(index == 2) {
        this.imgManage();
      } else if(index == 3) {
        this.diySet();
      }   
    } else{
      this.setData({
        show: true
      })
    }
  },

  /**
   * 点击最近浏览跳转浏览记录
   */
  browseFunction() {
    // 是否已授权
    if(checkAuthed()) {
      wx.navigateTo({
        url: '/pages/my/admin/browse/browse'
      })
    } else{
      this.setData({
        show: true
      })
    }
  },

  /**
   * 点击我的收藏跳转我的收藏
   */
  collectFunction() {
    // 是否已授权
    if(checkAuthed()) {
      wx.navigateTo({
        url: '/pages/my/admin/collect/collect'
      })
    } else{
      this.setData({
        show: true
      })
    }
  },

  /**
   * 点击商家入驻跳转到入驻界面
   */
  brandJoin: function () {
     // 是否已授权
     if(checkAuthed()) {
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
    } else{
      this.setData({
        show: true
      })
    }
  },

  /**
   * 获取手机号
   */
  getPhoneNumber(e) {
    const that = this;
    wx.cloud.callFunction({
      name: 'getPhoneNumber',
      data: {
        weRunData: wx.cloud.CloudID(e.detail.cloudID),
      },
      success: res => {
        // console.log(res)
        // 更新globalData以便后续检查是否授权
        app.globalData.phoneNumber = res.result.phoneNumber;
        // 更新Page Data complete后更新至数据库以便小程序登陆时读取数据库数据判断是否授权
        that.setData({
          phoneNumber: res.result.phoneNumber
        })
      },
      fail: err => {
        // console.error(err);
        app.globalData.phoneNumber = '';
        that.setData({
          phoneNumber: ''
        })
      },
      complete: () => {
        db.collection('user').where({
          _openid: app.globalData.openid
        })
        .update({
          data: {
            phoneNumber: that.data.phoneNumber
          }
        })
      }
    })
  },

  /**
   * 点击获取授权
   */
  getUserInfo: function () {
    const that = this;
    wx.getUserProfile({
      desc: '获取你的昵称、头像、地区及性别',
      success: res => {
        // console.log(res)
        // 成功获取
        var avatarUrl = res.userInfo.avatarUrl;
        var nickName = res.userInfo.nickName;
        // 写入globalData
        app.globalData.avatarUrl = avatarUrl;
        app.globalData.nickName = nickName;
        // 关闭遮罩层，更新page data
        that.setData({ 
          show: false,
          avatarUrl: avatarUrl,
          nickName: nickName
        });
      },
      fail: res => {
        // console.log(res)
        //拒绝授权
        that.setData({ show: false });
      },
      complete: function () {
        // console.log(that.data.avatarUrl)
        // 更新用户头像和名称
        db.collection('user').where({
          _openid: app.globalData.openid
        })
        .update({
          data: {
            avatarUrl: app.globalData.avatarUrl,
            nickName: app.globalData.nickName,
            updateTime: (new Date())
          },
          success: function(res) {
            // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
            console.log(res.errMsg);
          }
        })
        // 更新浏览记录表中的头像和名称
        // 2.21.12.21 发现这段代码更新的字段没有使用价值，故屏蔽之
        // db.collection('browse').where({
        //   _openid: app.globalData.openid
        // })
        // .update({
        //   data: {
        //     avatarUrl: app.globalData.avatarUrl,
        //     nickName: app.globalData.nickName,
        //   }
        // })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 查询用户的身份和内部别名
    const that = this;
    console.log(app.globalData);
    await getSingleDataByOpenid('user').then(res=>{
      // 超级功能权限拥有者
      if(res.name == 'admin') {
        that.setData({superShow: true})
        // let admin_info = that.data.admin_info;
        // admin_info[admin_info.length-1].class = 'van-hairline--bottom';
        // let adminObj = {
        //   iconStr: 'super',
        //   text: '超级功能',
        //   class: ''
        // };
        // admin_info.push(adminObj);
        // that.setData({
        //   admin_info,
        //   adminFuncHeight: 500
        // });
      }
        that.setData({identity: res.identity});
    }).catch(error=>{
      console.error('检查openid的身份失败！')
    })
    // 已授权则更新page data的个人信息
    if(checkAuthed()) {
      that.setData({
        // 更新头像和名称至page data
        avatarUrl: app.globalData.avatarUrl,
        nickName: app.globalData.nickName,
        phoneNumber: app.globalData.phoneNumber
      })
    }
    // 检查用户是否为超级功能拥有者
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
    // 未授权
    if(!checkAuthed()){
      this.setData({
        show: true
      })
    };
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