// pages/my/join/brandJion/brandJion.js
import Toast from '../../../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 入驻流程的步骤数
    joinStep: 0,
    // step0_info_box的高度
    step0InfoBoxHeight: 850,
    // step1_info_box的高度
    step1InfoBoxHeight: 520,
    // step2_info_box的高度
    step2InfoBoxHeight: 620,
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
    columns: ['中心市场', '博览中心', '家博城', '光明家具城','其他区域'],
    // 选定的区域值
    area: '',
    // 分类列表
    labelList: [
      {
        label: '分类标签',
        labelName: ''
      }
      
    ],
    /**
     * Step1 Data
     */
    // 认证图片地址[门店照片，营业执照]
    authImgUrl: [
      {
        url: '',
        isUpload: false
      },
      {
        url: '',
        isUpload: false
      }
    ],
    adminName: '',
    phoneNumber: '',
    checked: true,
  },
  /**
   * 跳转上一步
   */
  backStep: function () {
    var joinStep = this.data.joinStep;
    joinStep--;
    this.setData({
      joinStep
    })
  },
  /**
   * 跳转下一步，同时提交表单
   * @param {提交的表单数据} event 
   */
  nextStep: function (event) {
    // 基本值:data,提交数据value,step步骤数
    var data = this.data;
    var value = event.detail.value;
    var step = data.joinStep;
    console.log(value)

    // 表单提交条件
    var isInputFull;
    // 不同step提交值的设值
    if(step == 0) {
      var address = data.address;
      var brandName = data.brandName;
      address = value.address;
      brandName = value.brandName;
      this.setData({
        address,
        brandName
      })
      // step0 提交条件
      isInputFull = (brandName && address && data.brandImgSrc && data.area && data.labelList[0].labelName && data.checked);
    } else if(step == 1) {
      var adminName = data.adminName;
      var phoneNumber = data.phoneNumber;
      adminName = value.adminName;
      phoneNumber = value.phoneNumber;
      this.setData({
        adminName,
        phoneNumber
      })
      // step1 提交条件
      isInputFull = (adminName && phoneNumber && data.authImgUrl[0].isUpload && data.authImgUrl[1].isUpload);
    }

    // isInputFull = true;
   
    
    if(isInputFull) {
      console.log(data)
      var joinStep = this.data.joinStep;
      joinStep++;
      this.setData({
        joinStep
      })
      Toast.success({
        message: '填写成功',
        duration: 1000
      });
    } else {
      if(step == 0 && !data.checked) {
        Toast.fail({
          message: '请完整填写并勾选下方服务协议',
          duration: 1000
        });
        return ;
      }
      Toast.fail({
        message: '请完整填写',
        duration: 1000
      });
    } 
  },
  /**
   * ************************Step1 Functiom************************
   * ************************              ************************
  */
  onLocation: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.choosePoi({
      success: function (res) {
        that.setData({
          address: res.address,
          latitude: res.latitude,
          longitude: res.latitude
        })
      }
    });
    // wx.getLocation({
    //   type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    //   success (res) {
    //     const latitude = res.latitude
    //     const longitude = res.longitude
    //     wx.openLocation({
    //       latitude,
    //       longitude,
    //       scale: 18
    //     })
    //   }
    // })
    wx.hideLoading()
  },

  /**
   * 点击勾选服务协议框动作
   * @param {勾选状态} event 
   */ 
  checkChange: function (event) {
    this.setData({
      checked: event.detail,
    });
  },
  /**
   * 点击查看服务协议
   */
  viewpolicy: function () {
    wx.navigateTo({
      url: '/pages/my/join/policy/policy'
    })
  },
  /**
   * 
   * @param {点击预览图片的索引} event 
   */
  previewImg: function (event) {
    var index = event.currentTarget.dataset.index;
    var imgUrls = this.data.authImgUrl;
    wx.previewImage({
      urls: [imgUrls[0].url,imgUrls[1].url],
      current: imgUrls[index].url
    })
  },
  /**
   * wx原生API点击上传按钮的动作函数
   * @param {图片索引} event
   */
  uploadAuthImg: function (event) {
    var index = event.currentTarget.dataset.index;
    var that = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image','video'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        var url = res.tempFiles[0].tempFilePath;
        console.log('uploadUrl:' + url);
        var authImgUrl = that.data.authImgUrl;
        authImgUrl[index].url = url;
        authImgUrl[index].isUpload = true;
        that.setData({
          authImgUrl
        })
      },
      fail: console.error
    }) 
  },
  /**
   * ************************Step0 Functiom************************
   * ************************              ************************
   */
  /**
   * 设置标签数据
   * @param {当前输入值} event
   */
  setLabelData: function (event) {
    // 实时的输入值
    var value = event.detail;
    // 传入的labelList index
    var index = event.currentTarget.dataset.index;
    var labelList = this.data.labelList;
    console.log(value)
    console.log(index)
    labelList[index].labelName = value;
    this.setData({
      labelList
    })
    
  },

  /**
   * 添加标签
   */
  addLabel: function () {
    var labelList = this.data.labelList;
    // 最多不能超过4个标签
    if(labelList.length < 4) {
      labelList.push({
        label: '分类标签',
        labelName: ''
      })
      // 增加标签后，增加相对应的盒子高度
      var step0InfoBoxHeight = this.data.step0InfoBoxHeight + 90;
      this.setData({
        labelList,
        step0InfoBoxHeight
      })
    }
  },
  /**
   * 删除标签
   * @param {删除的索引} event 
   */
  deleteLabel: function (event) {
    var index = event.currentTarget.dataset.index;
    var labelList = this.data.labelList;
    // 最少要有一个标签
    if(labelList.length > 1) {
      // 删除对应索引的标签
      labelList.splice(index, 1);
      // 删除标签后，减小相对应的盒子高度
      var step0InfoBoxHeight = this.data.step0InfoBoxHeight - 90;
      this.setData({
        labelList,
        step0InfoBoxHeight
      })
    }
  },
  /**
   * 滑动选择区域
   * @param {滑动改变的索引} event 
   */
  onChange: function (event) {
    const { picker, value, index } = event.detail;

    // Toast(`当前值：${value}, 当前索引：${index}`);
  },
  /**
   * 取消选择
   */
  cacelSelect: function () {
    var step0InfoBoxHeight = this.data.step0InfoBoxHeight - 74;
    this.setData({
      isSelected: false,
      step0InfoBoxHeight
    })
  },
  /**
   * 确认选择
   * @param {选中的索引和值} event 
   */
  confirmSelect: function (event) {
    var {value, index} = event.detail;
    var placeholder = this.data.placeholder;
    if(value == '其他区域') {
      placeholder = '例：迎宾东大道xxx号';
      // Toast({
      //   message: '若您的门市区域为其他区域，请完整填写门市地址，可点击右边定位按钮手动定位',
      //   duration: 3000
      // });
      Dialog.alert({
        message: '若您的门市区域为其他区域，请完整填写门市地址，可点击右边定位按钮手动定位',
        confirmButtonText: '知道了'
      }).then(() => {
        // on close
      });
    } else {
      placeholder = '例：1区2栋301';
    }
    var step0InfoBoxHeight = this.data.step0InfoBoxHeight - 74;
    this.setData({
      isSelected: false,
      isClick: false,
      area: value,
      step0InfoBoxHeight,
      placeholder
    })
    
  },
  /**
   * 点击选取门店区域
   */
  clickSelectArea: function () {
    var step0InfoBoxHeight = this.data.step0InfoBoxHeight + 74;
    this.setData({
      isSelected: true,
      step0InfoBoxHeight
    })
  },

  /**
   * wx原生API点击上传按钮的动作函数
   */
  uploadImg: function () {
    var that = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image','video'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        var url = res.tempFiles[0].tempFilePath;
        console.log('uploadUrl:' + url);
        that.setData({
          brandImgSrc: url,
          isUpload: true,
        })
      },
      fail: console.error
    }) 
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