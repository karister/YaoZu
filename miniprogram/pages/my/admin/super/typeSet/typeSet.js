const db = wx.cloud.database();
import Toast from '../../../../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // typeInfo:[
        //     {
        //         name: '实木家具',
        //         img: '',
        //     },
        //     {
        //         name: '软体家具',
        //         img: '',
        //     }
        // ]
    },

    /**
     * 添加区域标签
     */
    addArea: function () {
        let that = this;
        let typeInfo = that.data.typeInfo;
        typeInfo.push({
            name: '',
            img: ''
        })
        this.setData({
            typeInfo
        })
    },
    /**
     * 删除区域标签
     * @param {删除的索引} event 
     */
    deleteArea: function (event) {
        let that = this;
        let index = event.currentTarget.dataset.index;
        let typeInfo = that.data.typeInfo;
        // 最少要有一个标签
        if(typeInfo.length > 1) {
        // 删除对应索引的标签
        typeInfo.splice(index, 1);
        that.setData({
            typeInfo
        })
        }
    },

    /**
     * 设置标签数据
     * @param {当前输入值} event
     */
    setLabelData: function (event) {
        let that = this;
        // 实时的输入值
        let value = event.detail;
        // 传入的labelList index
        let index = event.currentTarget.dataset.index;
        let typeInfo = that.data.typeInfo;
        typeInfo[index].name = value;
        that.setData({
            typeInfo
        })
        
    },

    /**
   * 点击传头像
   */
  uploadImg: function (event) {
    let index = event.currentTarget.dataset.index;
    console.log(index)
    let that = this;
    wx.chooseMedia({
    count: 1,
    mediaType: ['image','video'],
    sourceType: ['album', 'camera'],
    maxDuration: 30,
    camera: 'back',
      success(res) {
        let url = res.tempFiles[0].tempFilePath;
        console.log('uploadUrl:' + url);
        let now = new Date();
        let time = now.getFullYear() + '.' + (now.getMonth()+1) + '.' + now.getDay() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + '/' + now.getTime();
        wx.cloud.uploadFile({
          cloudPath: 'type_img/' + time + '.png', // 上传至云端的路径
          filePath: url, // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            console.log(res.fileID)
            let typeInfo = that.data.typeInfo;
            typeInfo[index].img = res.fileID;
            typeInfo[index].isUpload = true;
            that.setData({
              typeInfo
            })
          },
          fail: console.error,
          complete: function () {
              console.log(that.data.typeInfo)
          }
        })
      },
      fail: console.error
    }) 
  },

    /**
     * 
     * @param {*} options 
     */
    updateData: async function () {
        let that = this;
        db.collection('index').where({
            filed: 'typeInfo'
        })
        .update({
            data: {
                typeInfo: that.data.typeInfo,
            },
            success: function (res) {
                Toast.success({
                    message: '修改成功',
                    duration: 1000
                });
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        db.collection('index').where({
            filed: 'typeInfo'
        }).get().then( res => {
            let typeInfo = res.data[0].typeInfo;
            typeInfo.forEach(type => {
                if(type.img == '') {
                    type.isUpload = false;
                } else {
                    type.isUpload = true;
                }
                console.log(type);
            });
            this.setData({
                typeInfo
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