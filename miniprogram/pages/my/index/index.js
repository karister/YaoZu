// pages/my/index/index.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;

const GET_INDEX_INFO_FUNCTION = 'getIndexInfo';
const INDEX_IMAGE_OPTIONS = require('../../../common/constant');
import {getRandomData} from '../../../common/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
      swiperList: [],
      categoryList: [],
  },

  /**
   * 更新消息通知
   */
    updateMsg(time) {
        setInterval(() => {
            let msgObj = this.data.msgObj;
            let index = msgObj.index + 1;
            if (index >= msgObj.list.length)
                index = 0;
            msgObj.content = msgObj.list[index];
            msgObj.index = index;
            this.setData({
                msgObj
            });
        }, time)
    },


    /**
     * 获取数据库中消息通知
     */
    getMessage() {
        let msgObj = this.data.msgObj;
        db.collection('index').where({
            filed: 'message'
        }).get().then( res => {
            let list = res.data[0].msgList;
            let obj = {
                content: list[0],
                index: 0,
                list: list
            }
            msgObj = obj;
            this.setData({
                msgObj
            })
        })
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
  async getIndexImage() {
    const that = this;
    const categories = [
      INDEX_IMAGE_OPTIONS.SWIPER,
      INDEX_IMAGE_OPTIONS.CATEGORY
    ]
    console.log('categories: ', categories);
    wx.cloud.callFunction({
      name: GET_INDEX_INFO_FUNCTION,
      data: {
        categories
      },
      success: function (res) {
        console.log('云函数GET_INDEX_INFO_FUNCTION调用成功：', res);
        // 处理返回结果
        // 从云函数返回的数据中提取不同的列表
        const swiperList = res.result.data.filter(item => item.category === INDEX_IMAGE_OPTIONS.SWIPER).map(imageItem => ({
          url: imageItem.item.fileID
        }));
        const categoryList = res.result.data.filter(item => item.category === INDEX_IMAGE_OPTIONS.CATEGORY).map(imageItem => ({
          url: imageItem.item.fileID,
          label: imageItem.item.label
        }));;

        console.log('swiperList:', swiperList);
        console.log('categoryList:', categoryList);

        that.setData({
          swiperList: swiperList,
          categoryList: categoryList
        });
      },
      fail: function (error) {
        console.error('云函数GET_INDEX_INFO_FUNCTION调用失败：', error);
        // 处理错误
      }
    });


    // try {
    //   const result = await db.collection(collectionName)
    //     .where({
    //       category: INDEX_IMAGE_OPTIONS.SWIPER
    //     })
    //     .get();
    //    console.log("result.data: ", result.data);
    //   // 获取查询结果的数据
    //   const swiperList = result.data.map(({ item })  => ({
    //     url: item.fileID,
    //     _id: item._id
    //   }));

    //   // 在这里可以处理获取到的图片信息，比如将数据存储到页面的数据变量中
    //   this.setData({
    //     swiperList: swiperList
    //   });
    //   console.log('从数据库获取图片信息成功', swiperList);
    // } catch (error) {
    //   console.error('从数据库获取图片信息失败', error);
    // }
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
    let imgFlag = true;
    while (imgFlag) {
      randomNum = Math.floor(Math.random() * randomNumMax);
      await db.collection('product').where(getRandomData()).get().then(res => {
        let labelObjects = res.data[randomNum].labels;
        productInfo = res.data[randomNum];
        randomNum = Math.floor(Math.random() * labelObjects.length);
        let realLabelObj = labelObjects[randomNum];
        randomImage = realLabelObj.imageObjects[Math.floor(Math.random() * realLabelObj.imageObjects.length)];
        if (randomImage != undefined) {
            randomImage.labelName = realLabelObj.labelName;
            if (randomImage.url.indexOf('cloud') >= 0)
                imgFlag = false;
        }
      })
    }
    console.log(randomImage);
    await db.collection('stores').where({
        _openid: productInfo._openid
    }).get().then(res => {
        randomImage.brandName = res.data[0].brand;
        randomImage.openid = res.data[0]._openid;
        // randomImage.browseNum = res.data[0].browseNum;
        randomImage.browseNum = that.getRandomNum(1000,3000);
    })
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
    // this.getMessage();
    // this.updateMsg(5000);

    this.getIndexImage();
    // this.getTypeInfo();
    // let hotProductObj = [];
    // for (let index = 0; index < 4; index++) {
    //   await this.getHotProductInfo().then(res => {
    //     hotProductObj.push(res)
    //   })
    // }
    // this.setData({
    //   hotProductObj
    // })
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
    // let hotProductObj = this.data.hotProductObj;
    // for (let index = 0; index < 6; index++) {
    //   await this.getHotProductInfo().then(res => {
    //     hotProductObj.push(res);
    //   })
    // }
    // this.setData({
    //   hotProductObj
    // })
    // console.log(hotProductObj)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})