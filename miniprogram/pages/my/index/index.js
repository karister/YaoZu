// pages/my/index/index.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
import {getRandomData} from '../../../common/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
      imgUrls: [],
      imgUrls1: [],
      hotProductObj: []
  },

  /**
   * 获取分类信息
   * @param {*} e 
   */
    getTypeInfo() {
        const that = this;
        db.collection('index').where({
            filed: 'typeInfo'
        }).get().then( res => {
            that.setData({
                typeInfo: res.data[0].typeInfo
            }) 
        })
    },

  /**
   * 点击进入区域商家列表
   * @param {index} e 
   */
  imgClick: function (e) {
      let obj = {
        index: e.currentTarget.dataset.index,
        type: e.currentTarget.dataset.type
      }
      app.globalData.displayObj = obj;
      wx.navigateTo({
        url: '/pages/my/display/display'
      })
  },
  /**
   * 点击进入搜索框
   */
  clickToSearch: function () {
    wx.navigateTo({
      url: '/pages/my/search/search'
    })
  },
  /**
   * 获取index页面图片
   */
  getIndexImage() {
    const that = this;
    db.collection('index').where({
      filed: 'index_image'
    })
    .get({
      success: res => {
        let imageList = res.data[0].imageList;
        let imageUrlTemp = [];
        imageList.forEach( url => {
          if(url != '') {
            imageUrlTemp.push(url);
          }
        });

        that.setData({
          imgUrls: imageUrlTemp,
        }) 
      }
    })

    db.collection('index').where({
      filed: 'areaInfo'
    })
    .get({
      success: res => {
        that.setData({
          imgUrls1: res.data[0].area
        }) 
      }
    })
  },

  //生成从minNum到maxNum的随机数
  getRandomNum(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10);  
        case 2:   
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        default: 
            return 0; 
    } 
  },

  /**
   * 随机获取火爆产品信息
   */
  async getHotProductInfo() {
    let that = this;
    let randomImage = {};
    let randomNum;
    let randomNumMax;
    let productInfo;
    await db.collection('product').where(getRandomData()).count().then(res => {
      randomNumMax = (res.total < 20) ? res.total : 20;
    })
    while (!randomImage.url) {
      randomNum = Math.floor(Math.random() * randomNumMax);
      await db.collection('product').where(getRandomData()).get().then(res => {
        let labelObjects = res.data[randomNum].labels;
        productInfo = res.data[randomNum];
        randomNum = Math.floor(Math.random() * labelObjects.length);
        randomImage = labelObjects[randomNum].imageObjects[Math.floor(Math.random() * labelObjects[randomNum].imageObjects.length)];
        randomImage.labelName = labelObjects[randomNum].labelName;
      }).then(async function() {
        if(randomImage.url) {
          console.log(randomImage)
          await db.collection('stores').where({
            _openid: productInfo._openid
          }).get().then(res => {
            randomImage.brandName = res.data[0].brand;
            randomImage.openid = res.data[0]._openid;
            // randomImage.browseNum = res.data[0].browseNum;
            randomImage.browseNum = that.getRandomNum(1000,3000);
          })
        }
      })
    }
    return randomImage;
  },

  /**
   * 点击爆款图片跳转至商家详情
   * openid : 商家openid
   */
  clickToStore(event){
    let openid = event.currentTarget.dataset.openid;
    wx.navigateTo({
      url: '/pages/my/detail/detail?openid=' + openid
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function () {
    this.getIndexImage();
    this.getTypeInfo();
    let hotProductObj = [];
    for (let index = 0; index < 6; index++) {
      await this.getHotProductInfo().then(res => {
        hotProductObj.push(res)
      })
    }
    this.setData({
      hotProductObj
    })
    // console.log(productTemp)
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
  onReachBottom: async function () {
    let hotProductObj = this.data.hotProductObj;
    for (let index = 0; index < 6; index++) {
      await this.getHotProductInfo().then(res => {
        hotProductObj.push(res);
      })
    }
    this.setData({
      hotProductObj
    })
    // console.log(hotProductObj)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})