// pages/my/admin/super/msgSet/msgSet.js
import Notify from '../../../../../miniprogram_npm/@vant/weapp/notify/notify';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        msgObj: {
            content: '在代码阅读过程中人们!',
            index: 0,
            list: [
              '在代码阅读过程中人们!',
              '中华人民共和国万岁!',
              '人民万岁!'
            ]
        },
        isShow: true
    },

    /**
     * 添加一条消息
     */
    addMessage() {
        let list = this.data.msgObj.list;
        if (list.length == 10) {
            Notify({
                message: '通知消息已达10条上限！',
                color: '#ad0000',
                background: '#ffe1e1',
                duration: 1000,
              });
            return ;
        }
        list.push(this.data.input);
        this.setData({
            'msgObj.list': list,
            input: ''
        })
    },

    /**
     * 删除一条消息
     * @param {*index} options 
     */
    delMessage(event) {
        this.setData({isShow: false});
        let index = event.currentTarget.dataset.index;
        console.log(index);
        let list = this.data.msgObj.list;
        list.splice(index, 1);
        this.setData({
            'msgObj.list': list
        })
        this.setData({isShow: true});

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})