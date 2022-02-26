// pages/my/index/index.js
const db = wx.cloud.database();
const _ = db.command;
import {getRandomData} from '../../../common/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
      imgUrls: [],
      imgUrls1: []
  },

  /**
   * 点击进入区域商家列表
   * @param {index} e 
   */
  imgClick: function (e) {
      var index = e.currentTarget.dataset.index;
      console.log(index);
      wx.navigateTo({
          url: '/pages/my/display/display?index=' + index
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
        // let iconList = res.data[0].iconList;
        let imageUrlTemp = [];
        // let iconUrlTemp = [];
        imageList.forEach( url => {
          if(url != '') {
            imageUrlTemp.push(url);
          }
        });
        // iconList.forEach( url => {
        //   if(url != '') {
        //     iconUrlTemp.push(url);
        //   }
        // });
        that.setData({
          imgUrls: imageUrlTemp,
          // imgUrls1: iconUrlTemp
        }) 
      }
    })

    db.collection('index').where({
      filed: 'areaInfo'
    })
    .get({
      success: res => {
        // let iconList = res.data[0].area;
        // let iconUrlTemp = [];
        // iconList.forEach( url => {
        //   if(url != '') {
        //     iconUrlTemp.push(url);
        //   }
        // });
        let areaList = res.data[0].area;
        let areaTemp = [];
        let tempObject = {};
        areaList.forEach((area,index) => {
          if(index % 2 == 0) {
            tempObject.num1 = area.name,
            tempObject.url1 = area.url
          } else {
            tempObject.num2 = area.name,
            tempObject.url2 = area.url
            areaTemp.push(tempObject);
            tempObject = {};
          }
        });
        // console.log(areaTemp);
        that.setData({
          imgUrls1: areaTemp
        }) 
        
      }
    })
  },

  /**
   * 获取火爆产品信息
   */
  getHotProductInfo() {
    let RandomUrl = '';
    let randomNum;
    let randomNumMax;
    db.collection('product').count().then(res => {
      randomNumMax = (res.total > 20) ? res.total : 20;
    })
    while (RandomUrl == '') {
      randomNum = Math.floor(Math.random() * randomNumMax);
      db.collection('product').then(res => {
        let labelObjects = res.data[randomNum].labels;
        randomNum = Math.floor(Math.random() * labelObjects.length);
        let imageObjects = labelObjects[randomNum].imageObjects;
        randomNum = Math.floor(Math.random() * imageObjects.length);
        RandomUrl = imageObjects[randomNum].url;
      })
    }
    
    return RandomUrl;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getIndexImage();
    // this.getHotProductInfo();
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