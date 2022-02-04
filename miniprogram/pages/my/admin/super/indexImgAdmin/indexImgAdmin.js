// pages/my/admin/super/indexImgAdmin/indexImgAdmin.js
import Toast from '../../../../../miniprogram_npm/@vant/weapp/toast/toast';
import {getSingleDataByOpenid} from '../../../../../common/common.js'
const db = wx.cloud.database();
const _ = db.command;
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 选中后的图片框颜色
    selectedColor: 'red',
    // 正常的图片框颜色
    normalColor: '#e4e4e4',
    // 按钮编辑状态
    disabled: true,
    // 选中的图片索引
    selectIndex: 0,
    // 首页固定可上传图片数量
    confirmNumImg: 6,
    // 修改项目
    project: [
      {
        name: '头部轮播图',
        dirName: 'Image',
        text: '轮播图拉伸比例长宽高大约3:1，为保证显示的效果请上传的图片大致符合拉伸比例',
        empty: true,
        imageList: [],
        imageObject: []

      },
      {
        name: '地区图标图',
        dirName: 'Icon',
        text: '图标图拉伸比例长宽高为1:1，为保证显示的效果请上传的图片大致符合拉伸比例',
        empty: true,
        imageList: [],
        imageObject: []
      }
    ]
  },

  /**
   * 取消选中的图片
   */
  cancelSelect() {
    let imageObject = this.data.imageObject;
    imageObject[this.data.selectIndex].borderColor = this.data.normalColor;
    this.setData({
      imageObject,
      disabled: true
    })
  },

  /**
   * 长按图片进行编辑
   * @param {imageindex: 当前点击的图片索引;labelindex: 标签的索引} event   
   */
  editImage(event) {
    let that = this;
    let imageIndex = event.currentTarget.dataset.imageindex;
    let imageObject = that.data.imageObject;
    if(that.data.disabled) {
      imageObject[imageIndex].borderColor = that.data.selectedColor;
      that.setData({
        imageObject,
        disabled: false,
        selectIndex: imageIndex
      })
    }
  },

  /**
   * 选择图片
   */
  chooseImage() {
    let that = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image','video'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        let url = res.tempFiles[0].tempFilePath;
        let selectIndex = that.data.selectIndex;
        let imageList = that.data.imageList;
        let imageObject = that.data.imageObject;
        imageList[selectIndex] = url;
        imageObject[selectIndex].url = url;
        imageObject[selectIndex].borderColor = that.data.normalColor;
        that.setData({
          imageList,
          imageObject,
          disabled: true
        });
      }
    })
  },

  /**
   * 同步上传图片至云存储，返回图片链接列表（fileID）
   */
  async uploadToCloud() {
    let that = this;
    let projectTemp = that.data.project;
    let now = new Date();
    let time = (now.getMonth() + 1).toString() + now.getDate().toString() + now.getHours().toString() + now.getMinutes().toString();
    projectTemp.forEach(pro => {
      pro.imageList.forEach( (imageUrl,index) => {
        wx.cloud.uploadFile({
          cloudPath: 'index_img/' + pro.dirName + '/' + time + '/' + index + '.png', // 上传至云端的路径
          filePath: imageUrl, // 临时文件路径
        }).then(res=>{
          console.log(res.fileID)
          pro.imageList[index] = res.fileID;
          pro.imageObject[index].url = res.fileID;
        }).catch(error => {
          console.error('图片上传到云存储失败1')
        })
      })
    });
    that.setData({
      project: projectTemp
    })
  },

  onPublish() {
    let that = this;
    that.uploadToCloud().then(res=>{
      db.collection('index').where({
        _id: '133e253361c1d599017d273c0b729104'
      })
      .update({
        data: {
          imageList: that.data.project[0].imageList,
          iconList: that.data.project[1].imageList
        }
      })
    }).catch(error => {
      console.error('图片上传到云存储失败2')
    })
    Toast.success({
      message: '发布成功',
      duration: 1000
    });
  },

  /**
   * 空状态的上传图片，即第一次上传 
   * @param {event.currentTarget.dataset.index: 当前上传的项目索引} event 
   */
  firstUpload: function (event) {
    let proIndex = event.currentTarget.dataset.index;
    const that = this;
    let imageNum = that.data.confirmNumImg;
    let imageObject = [];
    let imageList = [];
    wx.chooseMedia({
      count: imageNum,
      mediaType: ['image','video'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        for(let i = 0; i < imageNum; i++) {
          let url = '';
          if(i < res.tempFiles.length) {// 上传的图片直接赋值url显示
            url = res.tempFiles[i].tempFilePath;
            imageObject.push({
              url: url,
              borderColor: that.data.normalColor
            })
            imageList.push(url);
          } else {// 不足数量的部分显示空图片
            url = '';
            imageObject.push({
              url: url,
              borderColor: that.data.normalColor
            })
            imageList.push(url);
          }
          console.log(url)
        }
        if(proIndex == 0) {
          that.setData({
            'project[0].imageObject': imageObject,
            'project[0].imageList': imageList,
            'project[0].empty': false
          })
        } else {
          that.setData({
            'project[1].imageObject': imageObject,
            'project[1].imageList': imageList,
            'project[1].empty': false
          })
        }
        
      },
      fail: console.error
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    db.collection('index').where({
      _id: '133e253361c1d599017d273c0b729104'
    }).get().then(res=>{
      let resImageList = res.data[0].imageList;
      let resIconList = res.data[0].iconList;

      let imageObject = [];
      let iconObject = [];
      resImageList.forEach( url => {
        imageObject.push({
          url: url,
          borderColor: that.data.normalColor
        })
      })
      resIconList.forEach( url => {
        iconObject.push({
          url: url,
          borderColor: that.data.normalColor
        })
      })
      that.setData({
        'project[0].imageObject': imageObject,
        'project[0].imageList': resImageList,
        'project[0].empty': false,
        'project[1].imageObject': iconObject,
        'project[1].imageList': resIconList,
        'project[1].empty': false
      })
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