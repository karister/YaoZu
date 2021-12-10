// pages/my/display/display.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    area_info: [
      {
        area: '中心市场',
        font_color: 'white',
        bgk_color: '#4692B9'//'#f05b04'
      },
      {
        area: '博览中心',
        font_color: 'black',
        bgk_color: ''
      },
      {
        area: '家私城',
        font_color: 'black',
        bgk_color: ''
      },
      {
        area: '光明家具城',
        font_color: 'black',
        bgk_color: ''
      }
    ],
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

  /**
   * 加载store集合中的数据，设置对应index区域的渲染数据
   */
  loadStoresData(index) {
    var that = this;
    // 获取数据库引用
    const db = wx.cloud.database();

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!
    // 设置data中数组对象的方法
    const area_info = that.data.area_info;
    for(let i = 0;i < 4; i ++) {
      area_info[i].bgk_color = '';
      area_info[i].font_color = 'black';
      // 为当前点击的index
      if(i == index) {
        area_info[index].bgk_color = '#4692B9';
        area_info[i].font_color = 'white';
        db.collection('stores').where({
          area: area_info[index].area,
          viewState: 1
        })
        .get({ 
          success: function(res) {
            //打印调试信息
            // console.log('success');
            // console.log('res.length:' + res.data.length);
            //存储匹配结果
            const stores_data = that.data.stores_data;
            for(let i = 0;i < res.data.length; i++) {
              stores_data[i] = res.data[i];
              // console.log(stores_data[i]);
            }
            console.error('next load');
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
      display_index: index,
      area_info 
    })
  },

  /**
   * 加载图片地址
   */
  loadImgSrcData: function () {
    // 这里app.music_num是前面计算出来的记录总数
    // 一般是在本界面之前 求出 
    // 当然在本界面求也是可以的 相对麻烦
    // 这里就需要自己去求总数 我就不贴代码了 去开发文档看就行
    //  因为 微信小程序的js 是并发 不按顺序执行代码
  
    var total =500;
    const batchTimes = Math.ceil(total / 20);
    console.log(batchTimes);   //获取需要获取几次 
    var arraypro=[];          // 定义空数据 用来存储之后的数据
    const db = wx.cloud.database()
    //初次循环获取云端数据库的分次数的promise数组
    for (let i = 0; i < batchTimes; i++) {
      console.log(i)
      db.collection('img_src').skip(i*20).get({
        success: function (res) {

          console.log(res.data)
          
          for (let j = 0; j < res.data.length; j++) {
            arraypro.push(res.data[j])
          }
          
          // console.log(arraypro);
          console.log(arraypro.length);
        
          if(arraypro.length==500) {
            this.setData({
              all_img_src: arraypro
            })
          }
        }
      })
      
    }
  },
  /**
   * 加载所有数据
   */
  loadAllData: function () {
    var total =500;
    const batchTimes = Math.ceil(total / 20);
    console.log(batchTimes);   //获取需要获取几次 
    var arraypro=[];          // 定义空数据 用来存储之后的数据
    const db = wx.cloud.database()
    //初次循环获取云端数据库的分次数的promise数组
    for (let i = 0; i < batchTimes; i++) {
      console.log(i)
      db.collection('img_src').skip(i*20).get({
        success: function (res) {
          console.log(res.data)       
          for (let j = 0; j < res.data.length; j++) {
            arraypro.push(res.data[j])
          }
          // console.log(arraypro);
          console.log(arraypro.length);
          if(arraypro.length==500) {
            this.setData({
              all_img_src: arraypro
            })
          }
        }
      })
      
    }
  },

  /**
   * 点击区域列表
   */
  clickAreaItem: function (e) {
    console.error('点击区域列表');
    this.loadStoresData(e.currentTarget.dataset.index);
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.error('页面加载');
    this.loadStoresData(options.index);

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
    console.log(area_info);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.error('页面渲染');
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
        db.collection('stores').where({
          area: area_info[index].area
        }).skip(old_data_length)
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