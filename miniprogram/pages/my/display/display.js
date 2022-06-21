// pages/my/display/display.js
import {getQueryParam} from '../../../common/common.js'
const db = wx.cloud.database();
const app = getApp();
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    display_index: 0,
    data_length: 0,
    stores_data: [],
    all_img_src: []
  },
  /**
   * 跳转到商家详细界面
   */
  clickToDetail: function (e) {
    var storeOpenid = e.currentTarget.dataset.openid;
    wx.navigateTo({
      url: '/pages/my/detail/detail?openid=' + storeOpenid
    })
  },

  async getAreaInfo() {
    db.collection('index').where({
        filed: 'areaInfo'
    }).get().then( res => {
       console.log(res.data[0].area);
    })
  },

  /**
   * 加载store集合中的数据，设置对应index区域的渲染数据
   */
  async loadStoresData(obj) {
    let that = this;
    let valueList = app.globalData.areaList;
    console.log(obj);
    // 按区域查找
    if (obj.type === 'area') {
        db.collection('stores')
        .where(getQueryParam(obj.index, null))
        .get().then( res => {
            console.log(res.data);
            that.setData({
                data_length: res.data.length,
                stores_data: res.data
            });
        })
        that.setData({
            valueList,
            displayObj: obj
        })
        return ;
    }
    // 按分类类别查找
    valueList = [];
    await db.collection('index')
    .where({
        filed: 'typeInfo'
    })
    .get().then( res => {
        let typeInfo = res.data[0].typeInfo;
        typeInfo.forEach(type => {
            valueList.push(type.name);
        }); 
    })
    await db.collection('stores')
    .where({
        label: _.all([valueList[obj.index]])
    })
    .get().then( res => {
        that.setData({
            data_length: res.data.length,
            stores_data: res.data
        });
    })
    that.setData({
        valueList,
        displayObj: obj
    })
  },

  /**
   * 点击区域列表
   */
  clickAreaItem: function (event) {
    let obj = this.data.displayObj;
    let index = event.currentTarget.dataset.index;
    obj.index = index;
    this.loadStoresData(obj);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let obj = app.globalData.displayObj;
    this.loadStoresData(obj);
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
    console.error('触底了！');

    /**
     * 触底后再次读取20条数据，从上次数据长度序列开始读取skip(old_data_length)
     */
    const that = this;
    const obj = this.data.displayObj;
    const stores_data = that.data.stores_data;
    const old_data_length = that.data.data_length;

    // 按区域查找
    if (obj.type === 'area') {
        db.collection('stores')
        .where(getQueryParam(obj.index, null))
        .skip(old_data_length)
        .get().then( res => {
            // console.log('res.data.length:' + res.data.length);
            // console.log('old_data_length:' + old_data_length);
            //存储匹配结果
            for(let i = 0;i < res.data.length; i++) {
              stores_data[i + old_data_length] = res.data[i];
            }
            // 设置展示结果数据
            that.setData({
              data_length: res.data.length + old_data_length,
              stores_data
            });
        })
        return ;
    }
    // 按分类类别查找
    let valueList = this.data.valueList;
    await db.collection('stores')
    .where({
        label: _.all([valueList[obj.index]])
    })
    .get().then( res => {
        // console.log('res.data.length:' + res.data.length);
        // console.log('old_data_length:' + old_data_length);
        //存储匹配结果
        for(let i = 0;i < res.data.length; i++) {
            stores_data[i + old_data_length] = res.data[i];
        }
        // 设置展示结果数据
        that.setData({
            data_length: res.data.length + old_data_length,
            stores_data
        });
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

  
  
})