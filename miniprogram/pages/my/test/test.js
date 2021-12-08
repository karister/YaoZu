// pages/my/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    avatarUrl: '',
    nickName: '',
    show: true,
  },
  
  getUserInfo: function (paams) {
    const that = this;
    wx.getUserProfile({
      desc: '获取你的昵称、头像、地区及性别',
      success: res => {
        // console.log(res)
        // 成功获取
        that.setData({
          avatarUrl: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName
        })
        that.setData({ show: false });
      },
      fail: res => {
        console.log(res)
        //拒绝授权
        wx.showToast({
          title: '登录失败',
          icon: 'error',
          duration: 2000
        });
        return;
      }
    })
  },


  // 上传图片
uploadToCloud() {
  wx.cloud.init();
  const { fileList } = this.data;
  if (!fileList.length) {
    wx.showToast({ title: '请选择图片', icon: 'none' });
  } else {
    const uploadTasks = fileList.map((file, index) => this.uploadFilePromise(`my-photo${index}.png`, file));
    Promise.all(uploadTasks)
      .then(data => {
        wx.showToast({ title: '上传成功', icon: 'none' });
        const newFileList = data.map(item => ({ url: item.fileID }));
        this.setData({ cloudPath: data, fileList: newFileList });
      })
      .catch(e => {
        wx.showToast({ title: '上传失败', icon: 'none' });
        console.log(e);
      });
  }
},

uploadFilePromise(fileName, chooseResult) {
  return wx.cloud.uploadFile({
    cloudPath: fileName,
    filePath: chooseResult.url
  });
},
  /**
   * vantui上传文件组件读取文件后的动作函数
   * @param {errMsg.detail.file: 当前读取的文件} e 
   */
  vantUploadImg: function (e) {
    var res = e.detail.file;
    var fileList = this.data.fileList;
    for(let i = 0; i < res.length; i++) {
      fileList.push({
        url: res[i].url,
      });
      console.log('uploadUrl:' + res[i].url)
    }
    this.setData({
      fileList
    })
  },
  /**
   * wx原生API点击上传按钮的动作函数
   */
  uploadImg: function () {
    var that = this;
    wx.chooseMedia({
      count: 9,
      mediaType: ['image','video'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        var fileList = that.data.fileList;
        for(let i = 0; i < res.tempFiles.length; i++) {
          fileList.push({
            url: res.tempFiles[i].tempFilePath,
          });
          console.log('uploadUrl:' + res.tempFiles[i].tempFilePath);
        }
        that.setData({
          fileList
        })
      },
      fail: console.error
    }) 
  },
  /**
   * vantui上传文件组件点击删除文件后的动作函数
   * @param {event.detail.index: 删除图片的序号值} e 
   */
  vantDeleteImg: function (e) {
    var index = e.detail.index;
    var fileList = this.data.fileList;
    console.log('deleteUrl:' + fileList[index].url);
    fileList.splice(index, 1);
    this.setData({
      fileList
    })
  },


  getPhoneNumber: function (e) {
   
    console.log(e.detail)
    
  },
  login: function(){
    var that = this;
    wx.showModal({//用户授权弹窗
      title: '温馨提示',
      content: '提示',
      success(res) {
        console.log(res)
        //如果用户点击了确定按钮
        if (res.confirm) {
          wx.getUserProfile({
            desc: '获取你的昵称、头像、地区及性别',
            success: res => {
              console.log(res.userInfo)//控制台输出结果
              console.log("获取成功");
            },
            fail: res => {
              console.log(res)
              //拒绝授权
              wx.showToast({
                title: '登录失败',
                icon: 'error',
                duration: 2000
              });
              return;
            }
          });
        } else if (res.cancel) {
          //如果用户点击了取消按钮
          console.log(3);
          wx.showToast({
            title: '登录失败',
            icon: 'error',
            duration: 2000
          });
          return;
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({ show: true });
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