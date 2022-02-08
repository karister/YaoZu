// pages/my/admin/super/valueSet/valueSet.js
const db = wx.cloud.database();
import Toast from '../../../../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // areas:[
        //     {
        //         name: '中心市场',
        //         url: '',
        //         isUpload: false
        //     },
        //     {
        //         name: '博览中心',
        //         url: '',
        //         isUpload: false
        //     },
        //     {
        //         name: '家私城',
        //         url: '',
        //         isUpload: false
        //     },
        //     {
        //         name: '光明家具城',
        //         url: '',
        //         isUpload: false
        //     },
        //     {
        //         name: '其他区域',
        //         url: '',
        //         isUpload: false
        //     }
        // ]
        checked: true
    },
    switchChange: function() {
        this.setData({
            checked: !this.data.checked
        })
    },


    /**
     * 添加区域标签
     */
    addArea: function () {
        let that = this;
        let areaList = that.data.areas;
        areaList.push({
            name: '',
            url: '',
            isUpload: false
        })
        this.setData({
            areas: areaList
        })
    },
    /**
     * 删除区域标签
     * @param {删除的索引} event 
     */
    deleteArea: function (event) {
        let that = this;
        let index = event.currentTarget.dataset.index;
        let areaList = that.data.areas;
        // 最少要有一个标签
        if(areaList.length > 1) {
        // 删除对应索引的标签
        areaList.splice(index, 1);
        that.setData({
            areas: areaList
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
        let areaList = that.data.areas;
        areaList[index].name = value;
        that.setData({
            areas: areaList
        })
        
    },

    /**
   * 点击传头像
   */
  uploadImg: function (event) {
    let index = event.currentTarget.dataset.index;
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
        wx.cloud.uploadFile({
          cloudPath: 'image-temp/' + new Date().getTime() +   '.png', // 上传至云端的路径
          filePath: url, // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            console.log(res.fileID)
            let areas = that.data.areas;
            areas[index].url = res.fileID;
            areas[index].isUpload = true;
            that.setData({
              areas
            })
          },
          fail: console.error,
          complete: function () {
              console.log(that.data.areas)
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
    updateData: function () {
        let that = this;
        let areaList = that.data.areas;
        let iconList = []
        areaList.forEach(area => {
            iconList.push(area.url);
        });
        db.collection('index').where({
            filed: 'areaInfo'
        })
        .update({
            data: {
                area: that.data.areas,
                iconList: iconList,
                checked: that.data.checked
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
    onLoad: function (options) {
        db.collection('index').where({
            filed: 'areaInfo'
        }).get().then( res => {
            let areaList = res.data[0].area;
            areaList.forEach(area => {
                if(area.url == '') {
                    area.isUpload = false;
                } else {
                    area.isUpload = true;
                }
            });
            this.setData({
                areas: areaList,
                checked: res.data[0].checked
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