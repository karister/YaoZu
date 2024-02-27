// pages/my/admin/admin.js
import {checkAuthed,getSingleDataByOpenid} from '../../../../common/common.js'

const db = wx.cloud.database();
const _ = db.command;
const app = getApp();
const ADMIN_ROLE = 'admin';
const HOUSE_STORE = 'house_img'
const HOUSE_DB = 'house_img'
const INDEX_IMAGE_OPTIONS = require('../../../../common/constant.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    admin_info: [
      {
        iconStr: 'shenhe',
        text: '轮播图设置',
        class: 'van-hairline--bottom',
        option: INDEX_IMAGE_OPTIONS.SWIPER
      },
      {
        iconStr: 'info',
        text: '分类标签设置',
        class: 'van-hairline--bottom',
        option: INDEX_IMAGE_OPTIONS.CATEGORY
      },
      {
        iconStr: 'tupian',
        text: '热门区域设置',
        class: 'van-hairline--bottom',
        option: INDEX_IMAGE_OPTIONS.AREA
      },
      {
        iconStr: 'set',
        text: '消息通知设置',
        class: '',
        option: INDEX_IMAGE_OPTIONS.MESSAGE
      }
    ],
    // 用户头像地址
    avatarUrl: 'cloud://cloud1-9gfitrmvaedbeba4.636c-cloud1-9gfitrmvaedbeba4-1315869654/OIP.jpg',
    // 用户微信昵称
    nickName: '微信用户',
    // 微信手机号
    phoneNumber: '',
    // 遮罩层状态
    show: false,
    // 是否为admin身份
    isAdmin: false,
    // 是否为房东身份
    isHouseOwner: false,
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
        title: '家居馆设置',
        page: 'valueSet'
      }, {
        title: '首页分类设置',
        page: 'typeSet'
      }, {
        title: '消息通知设置',
        page: 'msgSet'
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
   * swiper 主页设置页面跳转
   */
  gotoIndexSettingPage: function (target) {
    const baseUrl = '/pages/my/index_management/';
    const url = `${baseUrl}${target}/index`;
  
    // 使用 wx.navigateTo 跳转页面
    wx.navigateTo({
      url: url,
    });
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
    var option = event.currentTarget.dataset.option;
    console.log("option: ", option);
    this.gotoIndexSettingPage(option) 
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
      success: function (res) {
        console.log('getPhoneNumber: ', res)
        // 更新globalData以便后续检查是否授权
        app.globalData.phoneNumber = res.result.phoneNumber;
      
        db.collection('user').where({
          _openid: app.globalData.openid
        })
        .update({
          data: {
            phoneNumber: res.result.phoneNumber
          }
        })
      
        that.setData({
          phoneNumber: res.result.phoneNumber,
          show: false
        })
      },
      fail: err => {
        // console.error(err);
        app.globalData.phoneNumber = '';
        that.setData({
          phoneNumber: ''
        })
      }
    })
  },

  // 检查phoneNumber是否有值，设置show属性
  checkPhoneNumber: function () {
    if (app.globalData.phoneNumber) {
      this.setData({ phoneNumber: app.globalData.phoneNumber });
      return ;
    }
     // true
    this.setData({ show: true });
  },

  // 检查role = admin
  checkRole: function() {
    if (ADMIN_ROLE === app.globalData.role) {
      this.setData({ isAdmin: true });
    }
  },

  addHouseImg: async function () {
    wx.showLoading({
      title: '正在上传',
    })
    try {
      const result = await wx.chooseMedia({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
      });

      const { tempFilePath } = result.tempFiles[0];
      
      // 上传图片到云存储
      const uploadResult = await wx.cloud.uploadFile({
        cloudPath: `${HOUSE_STORE}/${new Date().getTime()}.png`,
        filePath: tempFilePath, // 这里的 url 应该是图片的本地路径或者临时路径
      });

      const fileID = uploadResult.fileID;

      // 可选：如果需要，你还可以将 fileID 存入数据库或执行其他操作
      const dbResult = await db.collection(HOUSE_DB).add({
        data: {
          url: fileID
        },
      });

      wx.hideLoading();
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        duration: 1000
      })

      console.log('上传成功', tempFilePath);
    } catch (error) {
      console.error('上传失败', error);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("app global data: ", app.globalData);
    this.checkPhoneNumber();
    this.checkRole();
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
    // if(!checkAuthed()){
    //   this.setData({
    //     show: true
    //   })
    // };
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