// pages/my/community/publish/publish.js
import Toast from '../../../../miniprogram_npm/@vant/weapp/toast/toast';
import {getUserIdentity,getSingleDataByOpenid} from '../../../../common/common.js'

const app = getApp();
const db = wx.cloud.database();
const store_space_db = db.collection('store_space');
const stores_db = db.collection('stores');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    div_line: {
      width: '',
      color: ''
    },
    // 发布人名称（商家为brandName,用户为nickName）
    name: '',
    // 发布人头像
    imageUrl: '',
    // 发布人身份
    identity: '',
    /**
     * 发布的图片列表
     * fileList：[{
     *    url: 
     *    name:
     * }]
     */
    fileList: [],
    // 标题
    title: '',
    // 内容
    content: '',
    // 时间（月.日 时 分）
    publishDate: ''
  },

  /**
   * 设置title content数据
   * @param {name：设置的数据名称 value：数据源} event 
   */
  setInputData(event) {
    let name = event.currentTarget.dataset.name;
    let value = event.detail.value;
    this.setData({
      [name]: value
    })
    // console.log(this.data);
  }, 

  /**
   * 发布信息，即保存数据到数据库中
   */
  submit() {
    // 填写完整性检查
    if(this.data.content == '') {
      Toast('请填写发布内容哦~');
      return ;
    }
    // 空标题处理
    if(this.data.title == '') {
      this.setData({
        title: '快来看一看！'
      })
    }
    let that = this;
    let fileList = that.data.fileList;
    // 图片上传到云存储
    fileList.forEach( (element,index,array) => {
      let now = new Date();
      let time = (now.getMonth() + 1).toString() + now.getDate().toString() + now.getHours().toString() + now.getMinutes().toString();
      wx.cloud.uploadFile({
        cloudPath: 'community/' + that.data.identity + '/' + that.data.name + '/' + time + '/' + index + '.png', // 上传至云端的路径
        filePath: element.url, // 临时文件路径
        success: res => {
          console.log(res.fileID);
          // 更新fileID
          array[index].url = res.fileID;
        },
        fail: ()=>{console.error('图片上传到云存储失败')},
        complete: function () {
          //
        }
      })
    });
    wx.showLoading({
      title: '图片上传中',
    })
    // 延时2000ms等待图片上传到云存储换取fileID
    setTimeout( ()=> {
      // 更新图片地址到数据库
      let now = new Date();
      let time = (now.getMonth() + 1).toString() + '.' + now.getDate().toString() + ' ' + now.getHours().toString() + ':' + now.getMinutes().toString();
      store_space_db.add({
        data: {
          name: that.data.name,
          imageUrl: that.data.imageUrl,
          title: that.data.title,
          content: that.data.content,
          fileList: fileList,
          publishDate: time
        },
        success: function (params) {
          wx.hideLoading();
          Toast.success('发布成功!');
          wx.switchTab({
            url: '/pages/my/community/index/index',
          })
        },
        fail: ()=>{console.error('更新图片地址到数据库失败')},
      })
    }, 2000);
  },

  /**
   * vant组件上传发表信息的配图
   * @param {files: 上传的图片链接} event 
   */
  vantImgUpload(event) {
    let that = this;
    let files = event.detail.file;
    // console.log(event.detail.file)
    let fileList = that.data.fileList;
    files.forEach( (element,index) => {
      fileList.push({
        url: element.url,
        name: index
      })
    });
    that.setData({fileList})
  },

  /**
   * 聚焦输入框时
   */
  inputFocus() {
    this.setData({
      div_line: {
        width: '4',
        color: 'rgb(0, 47, 167)'
      }
    })
  },

  /**
   * 输入框失去焦点时
   */
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
  onLoad: async function (options) {
    let that = this;
    let identity;
    await getUserIdentity().then(res=>{
      identity = res;
    })
    // 用户身份
    if(identity == 'user') {
      that.setData({
        name: app.globalData.nickName,
        imageUrl: app.globalData.avatarUrl,
        identity: identity
      })
    }
    // 商家身份
    if(identity == 'store') {
      // 读取商家品牌头像和名称
      await getSingleDataByOpenid('stores').then(res=>{
        that.setData({
          name: res.brand,
          imageUrl: res.brandImgSrc,
          identity: identity
        })
      })
    }
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