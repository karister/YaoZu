// pages/my/display/display.js
import {getQueryParam} from '../../../common/common.js'
const db = wx.cloud.database();
const app = getApp();
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
  async loadStoresData(index) {
    console.log(index);
    var that = this;
    // 获取数据库中区域信息
    // await this.getAreaInfo();
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!
    // 设置data中数组对象的方法
    // const area_info = that.data.area_info;
    for(let i = 0;i < app.globalData.areaList.length; i ++) {
      // area_info[i].bgk_color = '';
      // area_info[i].font_color = 'black';
      // 为当前点击的index
      if(i == index) {
        // area_info[index].bgk_color = '#4692B9';
        // area_info[i].font_color = 'white';
        db.collection('stores').where(getQueryParam(index,null))
        .get({ 
          success: function(res) {
            //打印调试信息
            // console.log('success');
            // console.log('res.length:' + res.data.length);
            //存储匹配结果
            const stores_data = [];
            for(let i = 0;i < res.data.length; i++) {
              stores_data[i] = res.data[i];
              console.log(stores_data[i]);
            }
            // console.error('next load');
            // 设置展示结果数据
            that.setData({
              data_length: res.data.length,
              stores_data
            });
          }
        })
        
      }
    }
    that.setData ({
      display_index: index
    })
  },

  /**
   * 点击区域列表
   */
  clickAreaItem: function (e) {
    // console.error('点击区域列表');
    let dataset = e.currentTarget.dataset;
    this.loadStoresData(dataset.index + dataset.num*4);
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.error('页面加载');
    // 加载商家数据
    this.loadStoresData(options.index);
    // 加载区域信息


    // 手动自适应区域信息显示的处理。。。。。。
    let areaList1 = [];
    let areaList2 = [];
    app.globalData.areaList.forEach((area,index) => {
      if(index < 4)
        areaList1.push(area);
      else
        areaList2.push(area);
    });
    console.log(areaList1);
    console.log(areaList2);
    this.setData({
      areaList1,
      areaList2
    })

    /**
     * 获取所有area的数据总数便于后面读取数据分页
     */
    var that = this;
    const db = wx.cloud.database()
    var area_info = that.data.area_info;
    for(let i=0; i < 4; i++) {
      db.collection('stores').where({
        area: area_info[i].area
      }).count().then(res => {
        console.log(area_info[i].area + ':' + res.total);
        area_info[i].data_total = res.total;
        that.setData({
          area_info
        })
      })
    }
    // console.log(area_info);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.error('页面渲染');
    // this.loadImgSrcData();
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
    console.error('触底了！');

    /**
     * 触底后再次读取20条数据，从上次数据长度序列开始读取skip(old_data_length)
     */
    const that = this;
    const index = that.data.display_index;
    const db = wx.cloud.database()
    const area_info = that.data.area_info;
    const stores_data = that.data.stores_data;
    const old_data_length = that.data.data_length;
    for(let i = 0;i < 4; i ++) {
      // 为当前点击的index
      if(i == index) {
        db.collection('stores').where(getQueryParam(index,null)).skip(old_data_length)
        .get({ 
          success: function(res) {
            console.log(res.data);
            console.log('res.data.length:' + res.data.length);
            console.log('old_data_length:' + old_data_length);
            //存储匹配结果
            for(let i = 0;i < res.data.length; i++) {
              stores_data[i + old_data_length] = res.data[i];
            }
            // 设置展示结果数据
            that.setData({
              data_length: res.data.length + old_data_length,
              stores_data
            });
          }
        })
        
      }
    }
    that.setData ({
      display_index: index,
      area_info 
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

  
  
})