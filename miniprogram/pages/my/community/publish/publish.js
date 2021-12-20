// pages/my/community/publish/publish.js

const app = getApp();
const db = wx.cloud.database();
const store_space_db = db.collection('store_space');
const stores_db = db.collection('stores');
const user_db = db.collection('user');

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
    // 时间（年月日）
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
    let that = this;
    // 组建动态信息对象
    let now = new Date();
    let time = now.getFullYear().toString() + '.' + (now.getMonth() + 1).toString() + '.' + now.getDate().toString()
    let messageObj = {
      fileList: that.data.fileList,
      title: that.data.title,
      content: that.data.content,
      publishDate: time
    }
    store_space_db.where({
      _openid: app.globalData.openid
    })
    .get({
      success: function (res) {
        // 第一次发表动态，先添加用户
        if(res.data.length == 0) {
          store_space_db.add({
            data: {
              name: that.name,
              imageUrl: that.imageUrl,
              message: [messageObj]
            }
          })
        } else{
          let messageBuffer = res.data[0].message;
          messageBuffer.unshift(messageObj);
        }
      },
    })
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
    let that = this;
    let identity;
    let nickName;
    let avatarUrl;
    // 判断用户身份
    user_db.where({
      _openid: app.globalData.openid
    })
    .get({
      success: function (res) {
        identity = res.data[0].identity;
        nickName = res.data[0].nickName;
        avatarUrl = res.data[0].avatarUrl;
        // 用户身份
        if(identity == 'user') {
          that.setData({
            name: nickName,
            imageUrl: avatarUrl
          })
        }
        // 商家身份
        if(identity == 'store') {
          // 读取商家品牌头像和名称
          stores_db.where({
            _openid: app.globalData.openid
          })
          .get({
            success: function (res) {
              that.setData({
                name: res.data[0].brand,
                imageUrl: res.data[0].brandImgSrc
              })
            },
          })
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