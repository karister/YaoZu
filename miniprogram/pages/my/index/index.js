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
    let randomImage = '';
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
          // console.log(randomImage)
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
    let hotProductObj = [];
    let productTemp = [];
    let tempObject = {};
    for (let index = 0; index < 6; index++) {
      await this.getHotProductInfo().then(res => {
        let product = res;
        console.log(res)
        hotProductObj.push(product)
        if((index + 1) % 2) {
          tempObject.url1 = product.url;
          tempObject.label1 = product.label;
          tempObject.price1 = product.price;
          tempObject.brandName1 = product.brandName;
          tempObject.openid1 = product.openid;
          tempObject.browseNum1 = product.browseNum;
          tempObject.labelName1 = product.labelName;
        } else {
          tempObject.url2 = product.url;
          tempObject.label2 = product.label;
          tempObject.price2 = product.price;
          tempObject.brandName2 = product.brandName;
          tempObject.openid2 = product.openid;
          tempObject.browseNum2 = product.browseNum;
          tempObject.labelName2 = product.labelName;
          productTemp.push(tempObject);
          tempObject = {};
        }
      })
    }
    this.setData({
      hotProductObj: productTemp
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
    let tempProduct = [];
    for (let index = 0; index < 6; index++) {
      await this.getHotProductInfo().then(res => {
        console.log(res)
        tempProduct.push(res)
      })
    }
    let tempObject = {};
    tempProduct.forEach((product,index) => {
      index += 1;
      if(index % 2) {
        tempObject.url1 = product.url;
        tempObject.label1 = product.label;
        tempObject.price1 = product.price;
        tempObject.brandName1 = product.brandName;
        tempObject.openid1 = product.openid;
        tempObject.browseNum1 = product.browseNum;
        tempObject.labelName1 = product.labelName;
      } else {
        tempObject.url2 = product.url;
        tempObject.label2 = product.label;
        tempObject.price2 = product.price;
        tempObject.brandName2 = product.brandName;
        tempObject.openid2 = product.openid;
        tempObject.browseNum2 = product.browseNum;
        tempObject.labelName2 = product.labelName;
        hotProductObj.push(tempObject);
        tempObject = {};
      }
    });
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