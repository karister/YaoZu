// pages/my/admin/function/storeInfo/storeInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**
     * Step0 Data
     */
    // 上传的头像地址
    brandImgSrc: '',
    // 上传头像的状态
    isUpload: false,
    // 选择区域的状态
    isSelected: false,
    // 表单提交的地址信息
    address: '',
    // 定位经纬度
    latitude: 0,
    longitude: 0,
    // 地址文本框的文字提示
    placeholder: '例：1区2栋301',
    // 表单提交的名称信息
    brandName: '',
    // 点击选择区域按钮的状态
    isClick: true,
    // 选择器的值(许多地方使用了area,尽量不要修改，增加不影响)
    columns: ['中心市场', '博览中心', '家私城', '光明家具城','其他区域'],
    // 暂时只用到了经纬度，在遍历时请使用值比较
    area_info: [
      {
        area: '中心市场',
        address: '赣州市南康区家具城工业大道亚琦城市壹号北80米[南康家具城中心市场]',
        latitude: 25.688255,
        longitude: 114.779696

      },
      {
        area: '博览中心',
        address: '赣州市南康区工业大道38-40号[南康家具城博览中心区]',
        latitude: 25.685532,
        longitude: 114.779386
      },
      {
        area: '家私城',
        address: '赣州市南康区迎宾大道与市场东路交汇处[居然之家盈海家博城]',
        latitude: 25.691644,
        longitude: 114.792854
      },
      {
        area: '光明家具城',
        address: '赣州市南康区迎宾东大道(仁济医院东北)[光明国际家具城]',
        latitude: 25.685177,
        longitude: 114.785399
      }
    ],
    // 选定的区域值
    area: '',
    // 分类列表
    labelList: [''],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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