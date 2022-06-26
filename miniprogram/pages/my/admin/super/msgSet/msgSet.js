// pages/my/admin/super/msgSet/msgSet.js
import Notify from '../../../../../miniprogram_npm/@vant/weapp/notify/notify';
const db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        msgObj: {
            content: '',
            index: 0,
            list: []
        },
        isShow: true
    },

    /**
     * 添加一条消息
     */
    async addMessage() {
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

        await db.collection('index').where({
            filed: 'message'
        })
        .update({
            data: {
                msgList: list
            }
        }).then( res => {
            
        })

        this.setData({
            'msgObj.list': list,
            input: ''
        })
    },

    /**
     * 删除一条消息
     * @param {*index} options 
     */
    async delMessage(event) {
        this.setData({isShow: false});
        let index = event.currentTarget.dataset.index;
        console.log(index);
        let list = this.data.msgObj.list;
        list.splice(index, 1);

        await db.collection('index').where({
            filed: 'message'
        })
        .update({
            data: {
                msgList: list
            }
        }).then( res => {
            
        })

        this.setData({
            'msgObj.list': list
        })
        this.setData({isShow: true});

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let msgObj = this.data.msgObj;
        db.collection('index').where({
            filed: 'message'
        }).get().then( res => {
            let list = res.data[0].msgList;
            let obj = {
                content: list[0],
                index: 0,
                list: list
            }
            msgObj = obj;
            this.setData({
                msgObj
            })
        })
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