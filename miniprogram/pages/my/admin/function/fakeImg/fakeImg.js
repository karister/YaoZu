// pages/my/admin/function/imgManage/imgManage.js
import Toast from '../../../../../miniprogram_npm/@vant/weapp/toast/toast';

const db = wx.cloud.database();
const _ = db.command;
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    brandName: '',
    /*
    labelObject: {
      //标签名
      labelName: 
      //图片
      imgUrls:
      //是否空链接
      urlsEmpty: 
    }
    */
    labelObject: [],
    // 纯图片链接集合(二维数组)
    imgUrls: [],
    // 选中后的图片框颜色
    selectedColor: 'red',
    // 正常的图片框颜色
    normalColor: '#e4e4e4',
    // 是否隐藏头部提示信息
    hideview: false
    

  },

  // 设置分类标签名称
  setLabelName(event) {
    let index = event.currentTarget.dataset.index;
    let input = event.detail;
    let labelObject = this.data.labelObject;
    labelObject[index].labelName = input;
    this.setData({
        labelObject,
    })
    // console.log(index + ':' + input);

  },

  // 添加展图分类对象
  addLabelObject() {
    var obj = {
        labelName: '',
        images:[],
        disable: true,
        selectIndex: 0,
        urlsEmpty: true//显示空状态
    };
    var labelObject = this.data.labelObject;
    var imgUrls = this.data.imgUrls;
    labelObject.push(obj);
    imgUrls.push([]);
    this.setData({
        hideview: false,
        labelObject,
        imgUrls
    })
  },
  
  /**
   * 全部清空上传的图片
   * @param {labelindex: 标签的索引} event 
   */
  allClear(event) {
    var labelIndex = event.currentTarget.dataset.labelindex;
    var labelObject = this.data.labelObject;
    var imgUrls = this.data.imgUrls;
    // console.log(labelIndex);
    labelObject[labelIndex].images = [];
    labelObject[labelIndex].urlsEmpty = true;
    imgUrls[labelIndex] = [];
    this.setData({
      labelObject,
      imgUrls
    })
    // console.log(labelObject[labelIndex]);
  },

  /**
   * 删除选中的图片
   * @param {imageindex: 当前点击的图片索引;labelindex: 标签的索引} event   
   */
  deleteImage(event) {
    var labelIndex = event.currentTarget.dataset.labelindex;
    var labelObject = this.data.labelObject;
    var imgUrls = this.data.imgUrls;
    var imageIndex = labelObject[labelIndex].selectIndex;
    // 删除纯图片链接集合中对应索引的图片
    imgUrls[labelIndex].splice(imageIndex,1);
    // 删除图片对象集合中对应索引的图片
    labelObject[labelIndex].images.splice(imageIndex,1);
    // 增加集合元素
    labelObject[labelIndex].images.push({
      url: '',
      label: '',
      model: '',
      price: '',
      borderColor: this.data.normalColor
    })
    // 增加集合元素
    imgUrls[labelIndex].push('');
    // 禁用编辑按钮
    labelObject[labelIndex].disable = true;
    this.setData({
      labelObject,
      imgUrls
    })
  },
  /**
   * 更改单张图片
   * @param {labelindex: 标签的索引} event 
   */
  changeImage(event) {
    const that = this;
    var labelIndex = event.currentTarget.dataset.labelindex;
    var labelObject = this.data.labelObject;
    var selectIndex = labelObject[labelIndex].selectIndex;
    var imgUrls = this.data.imgUrls;
    console.log(labelIndex + ':' + selectIndex)
    wx.chooseMedia({
      count: 1,
      mediaType: ['image','video'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        labelObject[labelIndex].images[selectIndex].url = res.tempFiles[0].tempFilePath;
        imgUrls[labelIndex][selectIndex] = res.tempFiles[0].tempFilePath;
        // 更新普通边框颜色
        labelObject[labelIndex].images[selectIndex].borderColor = that.data.normalColor;
        // 禁用编辑按钮
        labelObject[labelIndex].disable = true;
        that.setData({
          labelObject,
          imgUrls
        })
      },
      fail: console.error
    })
  },

  /**
   * 取消选中的图片
   * @param {labelindex: 标签的索引} event 
   */
  cancelSelect(event) {
    var labelIndex = event.currentTarget.dataset.labelindex;
    var labelObject = this.data.labelObject;
    labelObject[labelIndex].images[labelObject[labelIndex].selectIndex].borderColor = this.data.normalColor;
    // 禁用编辑按钮
    labelObject[labelIndex].disable = true;
    this.setData({
      labelObject
    })
  },

  /**
   * 长按图片进行编辑
   * @param {imageindex: 当前点击的图片索引;labelindex: 标签的索引} event   
   */
  editImage(event) {
    var imageIndex = event.currentTarget.dataset.imageindex;
    var labelIndex = event.currentTarget.dataset.labelindex;
    var labelObject = this.data.labelObject;
    // console.log(imageIndex + ':' + labelIndex)
    if(labelObject[labelIndex].disable) {
      labelObject[labelIndex].images[imageIndex].borderColor = this.data.selectedColor;
      // 启用编辑按钮
      labelObject[labelIndex].disable = false;
      // 更新标签中选中的图片索引
      labelObject[labelIndex].selectIndex = imageIndex;
      this.setData({
        labelObject
      })
    }
  },
  
  /**
   * 去往编辑产品信息页面
   * @param {} event 
   */
  toEditProductInfo(event) {
    var labelIndex = event.currentTarget.dataset.labelindex;
    var labelObject = this.data.labelObject;
    var imgUrls = this.data.imgUrls;
    var imageIndex = labelObject[labelIndex].selectIndex;
    var imageUrl = imgUrls[labelIndex][imageIndex];
    this.cancelSelect(event);
    console.log(imageUrl);
    wx.navigateTo({
      url: `/pages/my/admin/function/imgManage/productInfo?imageUrl=${imageUrl}&imageIndex=${imageIndex}&labelIndex=${labelIndex}`,
    })
  },


  /**
   * 点击图片预览大图
   * @param {imageindex: 当前点击的图片索引;labelindex: 标签的索引} event   
   */
  viewImage: function (event) {
    var imageIndex = event.currentTarget.dataset.imageindex;
    var labelIndex = event.currentTarget.dataset.labelindex;
    var imgUrls = this.data.imgUrls;
    var labelObject = this.data.labelObject;
    // console.log(imageIndex + ':' + labelIndex)
    // 禁用编辑按钮
    labelObject[labelIndex].disable = true;
    // 改变选中图片边框颜色
    labelObject[labelIndex].images[labelObject[labelIndex].selectIndex].borderColor = this.data.normalColor;
    this.setData({labelObject});
    if(imgUrls[labelIndex][imageIndex] != '') {
      wx.previewImage({
        current: imgUrls[labelIndex][imageIndex], // 当前显示图片的http链接
        urls: imgUrls[labelIndex] // 需要预览的图片http链接列表
      })
    }
  },

  /**
   * 空状态的上传图片，即第一次上传
   * @param {event.currentTarget.dataset.index: 当前上传的标签索引} event  
   */
  firstUpload: function (event) {
    const that = this;
    var labelIndex = event.currentTarget.dataset.index;
    var labelObject = this.data.labelObject;
    wx.chooseMedia({
      count: 9,
      mediaType: ['image','video'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        var imgUrls = that.data.imgUrls;
        for(let i = 0; i < 9; i++) {
          if(i < res.tempFiles.length) {// 上传的图片直接赋值url显示
            labelObject[labelIndex].images.push({
              url: res.tempFiles[i].tempFilePath,
              model: '',
              label: '',
              price: '',
              borderColor: that.data.normalColor
            });
            imgUrls[labelIndex].push(res.tempFiles[i].tempFilePath);
          } else {// 不足9张的部分显示空图片
            labelObject[labelIndex].images.push({
              url: '',
              model: '',
              label: '',
              price: '',
              borderColor: that.data.normalColor
            });
            imgUrls[labelIndex].push('');
          }
        }
        labelObject[labelIndex].urlsEmpty = false;
        that.setData({
          labelObject,
          imgUrls
        })
      },
      fail: console.error
    })
  },

  /**
   * 发布图片，把分类标签下上传的图片存储到云存储
   * @param {event.currentTarget.dataset.index: 当前发布的标签索引} event 
   */
  onPublish: function (event) {
    var that = this;
    var data = this.data;
    var labelIndex = event.currentTarget.dataset.index;
    var labelObject = data.labelObject;
    var imgUrls = this.data.imgUrls;
    console.log(imgUrls)
    console.log(labelObject)
    // 将上传图片得到的临时链接通过上传到云存储换取fileID
    imgUrls[labelIndex].forEach( (item,index) => {
      var now = new Date();
      var time = now.getFullYear().toString() + (now.getMonth()+1).toString() + now.getDate().toString() + now.getDay().toString() + now.getHours().toString() + now.getMinutes().toString();
      // console.log(time);
      // 上传到云存储
      wx.cloud.uploadFile({
        cloudPath: 'product_img/' + data.brandName + '/' + data.labelObject[labelIndex].labelName + '/' + time + '/' + index + '.png', // 上传至云端的路径
        filePath: item, // 临时文件路径
        success: res => {
          console.log(res.fileID);
          imgUrls[labelIndex][index] = res.fileID;
          labelObject[labelIndex].images[index].url = res.fileID;
          // 换取到fileID更新到page data
          that.setData({imgUrls});
        },
        fail: console.error('上传云存储失败')
      })
    })

    wx.showLoading({
      title: '保存中',
    })
    // 延时2000ms等待图片上传到云存储换取fileID
    setTimeout( ()=> {
      // 更新图片地址到数据库
      // 构建空列表（同数据库中product-labels列表结构一致）
      var dbLabelObbject = [];
      labelObject.forEach( labelOb => {
        dbLabelObbject.push({
          imageObjects: labelOb.images,
          labelName: labelOb.labelName
        })
      } )
      // 从iamgeUrls即纯图片数组中，去除有效url
      let imageListBuffer = [];
      imgUrls.forEach(images => {
        let list = [];
        images.forEach(url => {
          if(url != '')
            list.push(url)
        });
        imageListBuffer.push(list);
      });
      db.collection('product').where({
        _openid: app.globalData.openid
      })
      .update({
        data:{
          labels: dbLabelObbject,
          imageList: imageListBuffer
        },
        success: function (res) {
          // console.log(res); 
        },
        fail: console.error
      })
      wx.hideLoading();
      Toast.success({
        message: '发布成功',
        duration: 1000
      });
    },3000); 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    // 得到商家的标签分类
    db.collection('product').where({
      _openid: app.globalData.openid
    })
    .get({
      success: function (res) {
        var labelData = res.data[0].labels;
        var labelObject = that.data.labelObject;
        var imgUrls = that.data.imgUrls;
        let imageList = [];
        for(let i = 0; i < labelData.length; i++) {
          imageList = [];
          if(labelData[i].imageObjects.length == 0) {
            labelObject.push({
              labelName: labelData[i].labelName,
              images:[],
              disable: true,
              selectIndex: 0,
              urlsEmpty: true//显示空状态
            })          
          } else {
            labelData[i].imageObjects.forEach( imgObj => {
              imageList.push(imgObj.url);
            } )
            labelObject.push({
              labelName: labelData[i].labelName,
              images: labelData[i].imageObjects,
              disable: true,
              selectIndex: 0,
              urlsEmpty: false//不显示空状态
            })
          }
          imgUrls.push(imageList)
          console.log(imageList)
        }
        console.log(imgUrls)
        that.setData({
          labelObject,
          imgUrls,
          brandName: res.data[0].brandName
        });
      }
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