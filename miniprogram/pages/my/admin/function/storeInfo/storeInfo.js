// pages/my/admin/function/storeInfo/storeInfo.js
import Toast from '../../../../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../../../../miniprogram_npm/@vant/weapp/dialog/dialog';

const db = wx.cloud.database();
const _ = db.command;
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    // step0_info_box的高度
    step0InfoBoxHeight: 750,
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
    show: false,
    labelColumns: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
    // 由于picker组件是在标签循环渲染后出现的，无法获取picker对象的index，所有保存一个show为true时的index
    currentIndex: 0
  },

  onConfirm(event) {
    let pickedName = event.detail.value;
    let labelList = this.data.labelList;
    let labelIndex = this.data.currentIndex;
    labelList[labelIndex] = pickedName;
    this.setData({labelList});
    this.onClose();
  },
  showPopup(event) {
    this.setData({ 
        show: true,
        currentIndex: event.currentTarget.dataset.index
    });
  },
  onClose() {
    this.setData({ show: false });
  },



  /**
   * 
   * @param {提交的数据} event 
   */
  updateData: function (event) {
    // 基本值:data,提交数据value
    var data = this.data;
    var value = event.detail.value;
    // console.log(value)

    // 表单提交条件
    var isInputFull;
    // 不同step提交值的设值
    var address = data.address;
    var brandName = data.brandName;
    address = value.address;
    brandName = value.brandName;
    this.setData({
      address,
      brandName
    })
    isInputFull = (brandName && address && data.brandImgSrc && data.area && data.labelList[0]);
    if(isInputFull) {
      /**
       * 全部数据填写提交完毕，写入stores 集合
       */
      db.collection('stores').where({
        _openid: app.globalData.openid
      })
      .update({
        data: {
          brandImgSrc: data.brandImgSrc,
          brand: data.brandName,
          name: data.adminName,
          phone: data.phoneNumber,
          area: data.area,
          address: data.address,
          latitude: data.latitude,
          longitude: data.longitude,
          label: data.labelList,
        },
        success: function (res) {
          console.log(res)
        }
      })
      /**
       * 更新product集合中的标签数据
       * 由于product-labels{imgUrls,labelName}的对象结构，所以只更新labelName需要把labels读取出来再更新
       */

      //  取product中的labels字段更新至labelsBuffer
      var labelsBuffer = [];
      db.collection('product').where({
        _openid: app.globalData.openid
      })
      .get({
        success: function (res) {
          // 更新buffer以labelList即修改的标签列表为准
          let updateFlag = false; //更新标志，即是否已存在的label
          data.labelList.forEach(labelName => {
            res.data[0].labels.forEach(label => {
              // 如果已存在的label，则读取拼凑object写入buffer
              if(label.labelName == labelName) {
                updateFlag = true;
                labelsBuffer.push({
                  labelName: labelName,
                  imageObjects: label.imageObjects
                })
              }
            })
            // 未更新，即新增的label，给imgUrls空列表写入buffer
            if(!updateFlag) {
              labelsBuffer.push({
                labelName: labelName,
                imageObjects: []
              })
            }
            // 重置标志
            updateFlag = false;
          });
          // console.log(data.labelList)
          // console.log(labelsBuffer);
        }
      })
      // 加载提示在保存信息，等待上方更新完labelsBuffer
      wx.showLoading({
        title: '保存中',
      }) 
      setTimeout(function () {
        // 更新至product数据库中
        db.collection('product').where({
          _openid: app.globalData.openid
        })
        .update({
          data: {
            brandName: data.brandName,
            labels: labelsBuffer
          }
        })
        wx.hideLoading();
        Toast.success({
          message: '修改成功',
          duration: 1000
        });
      },2000)
      
    } else {
      Toast.fail({
        message: '请完整填写',
        duration: 1000
      });
    }
  },

  onLocation: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.choosePoi({
      success: function (res) {
        that.setData({
          address: res.address.replace('江西省赣州市南康区',''),
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    });
    wx.hideLoading()
  },

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
    // console.log(value)
    // console.log(index)
    labelList[index] = value;
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
      labelList.push('')
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
    // 设置区域定位
    var area_info = this.data.area_info;
    var latitude = this.data.latitude;
    var longitude = this.data.longitude;
    for(let i = 0; i < area_info.length; i++) {
      if(value == area_info[i].area) {
        latitude = area_info[i].latitude;
        longitude = area_info[i].longitude;
      }
    }
    this.setData({
      isSelected: false,
      isClick: false,
      area: value,
      step0InfoBoxHeight,
      placeholder,
      latitude,
      longitude
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
   * 点击传头像
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
        wx.cloud.uploadFile({
          cloudPath: 'brand_img/' + that.data.brandName + '/' + (new Date()).getTime() + '.png', // 上传至云端的路径
          filePath: url, // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            console.log(res.fileID)
            that.setData({
              brandImgSrc: res.fileID,
              isUpload: true,
            })
          },
          fail: console.error,
          complete: function () {
            // 更新stores中的认证图片路径
            db.collection('stores').where({
              _openid: app.globalData.openid
            })
            .update({
              data: {
                brandImgSrc: that.data.brandImgSrc
              }
            })
          }
        })
      },
      fail: console.error
    }) 
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
    
    // 读取入驻时填写的信息
    db.collection('stores').where({
      _openid: app.globalData.openid
    })
    .get({
      success: function (res) {
        var data = res.data[0];
        console.log(res.data[0])
        that.setData({
          brandImgSrc: data.brandImgSrc,
          isUpload: true,
          brandName: data.brand,
          area: data.area,
          isSelected: false,
          isClick: false,
          address: data.address,
          latitude: data.latitude,
          longitude: data.longitude,
          labelList: data.label
        })

        var length = that.data.labelList.length -1;
        var step0InfoBoxHeight = that.data.step0InfoBoxHeight;
        step0InfoBoxHeight += length*90;
        that.setData({
          step0InfoBoxHeight
        })
      },
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